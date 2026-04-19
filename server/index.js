import dotenv from "dotenv";
import express from "express";
import bcrypt from "bcryptjs";
import { sql } from "./db.js";
import { requireAuth, requireAdmin, signToken } from "./auth.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8787);
const adminUsername = process.env.ADMIN_USERNAME || "admin";
const adminPassword = process.env.ADMIN_PASSWORD || "LISAdmin@2026";

app.use(express.json({ limit: "50mb" }));
app.use((req, res, next) => {
  const origin = req.headers.origin || "*";
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Vary", "Origin");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

const MEMBERSHIP_TIERS = new Set(["student", "professional", "life", "institutional"]);
const MEMBER_STATUSES = new Set(["pending", "approved", "rejected"]);
const MEMBER_CATEGORIES = new Set([
  "Librarian / Library Staff",
  "LIS Teacher",
  "LIS Student",
  "LIS Research Scholar",
  "Retired LIS Professional",
  "Others",
]);

const TEMPLATE_KEYS = new Set(["certificate", "id_front", "id_back"]);
const LIFE_CERTIFICATE_TEMPLATE_VERSION = 4;

async function ensureMemberDocumentColumns() {
  await sql`ALTER TABLE members ADD COLUMN IF NOT EXISTS certificate_data_url TEXT`;
  await sql`ALTER TABLE members ADD COLUMN IF NOT EXISTS certificate_template_version INTEGER`;
}

function normalizeMember(row) {
  if (!row) return null;
  return {
    id: row.id,
    membership_id: row.membership_id,
    membership_number: Number(row.membership_number),
    name: row.name,
    email: row.email,
    phone: row.phone,
    category: row.category,
    custom_detail: row.custom_detail,
    designation: row.designation,
    institution: row.institution,
    address: row.address,
    city: row.city,
    state: row.state,
    pincode: row.pincode,
    membership_tier: row.membership_tier,
    status: row.status,
    photo_data_url: row.photo_data_url || undefined,
    certificate_data_url: row.certificate_data_url || undefined,
    certificate_template_version: row.certificate_template_version ? Number(row.certificate_template_version) : undefined,
    created_at: row.created_at,
    approved_at: row.approved_at || undefined,
    issue_date: row.issue_date || undefined,
  };
}

function publicMember(row) {
  return normalizeMember(row);
}

function normalizeJsonArray(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function normalizeEvent(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    date: row.event_date,
    location: row.location,
    type: row.event_type,
    description: row.description,
    speakers: normalizeJsonArray(row.speakers),
    agenda: normalizeJsonArray(row.agenda),
    image_url: row.image_url || "",
    registration_url: row.registration_url || "",
    is_featured: Boolean(row.is_featured),
    sort_order: Number(row.sort_order || 0),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function normalizeTemplate(row) {
  if (!row) return null;
  return {
    key: row.template_key,
    label: row.label,
    template_url: row.template_url || "",
    field_map: row.field_map || {},
    updated_at: row.updated_at,
  };
}

function assertRequired(value, label) {
  if (!String(value || "").trim()) {
    throw new Error(`${label} is required.`);
  }
}

function validateRegistration(body) {
  assertRequired(body.name, "Full name");
  assertRequired(body.email, "Email");
  assertRequired(body.phone, "Phone number");
  assertRequired(body.password, "Password");
  assertRequired(body.category, "Category");
  assertRequired(body.custom_detail, "Custom detail");
  assertRequired(body.designation, "Designation");
  assertRequired(body.institution, "Institution");
  assertRequired(body.address, "Address");
  assertRequired(body.city, "City");
  assertRequired(body.state, "State");
  assertRequired(body.pincode, "PIN code");

  if (!MEMBERSHIP_TIERS.has(body.membership_tier)) {
    throw new Error("Invalid membership tier.");
  }

  if (!MEMBER_CATEGORIES.has(body.category)) {
    throw new Error("Invalid member category.");
  }

  if (String(body.password).length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }
}

async function generateMembershipIdentity() {
  const rows = await sql`SELECT nextval('membership_number_seq')::bigint AS membership_number`;
  const membershipNumber = Number(rows[0].membership_number);
  return {
    membershipNumber,
    membershipId: `LISA/${membershipNumber}`,
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/events", async (_req, res) => {
  try {
    const rows = await sql`
      SELECT * FROM events
      ORDER BY sort_order ASC, created_at DESC
    `;
    res.json({ events: rows.map(normalizeEvent) });
  } catch {
    res.status(500).json({ error: "Failed to load events." });
  }
});

app.get("/api/content", async (req, res) => {
  try {
    const section = String(req.query.section || "").trim();
    const rows = section
      ? await sql`SELECT section, key, value, updated_at FROM site_content WHERE section = ${section} ORDER BY key ASC`
      : await sql`SELECT section, key, value, updated_at FROM site_content ORDER BY section ASC, key ASC`;
    res.json({ content: rows });
  } catch {
    res.status(500).json({ error: "Failed to load site content." });
  }
});

app.get("/api/document-templates", async (_req, res) => {
  try {
    const rows = await sql`
      SELECT * FROM document_templates
      ORDER BY CASE template_key
        WHEN 'certificate' THEN 1
        WHEN 'id_front' THEN 2
        WHEN 'id_back' THEN 3
        ELSE 10
      END
    `;
    res.json({ templates: rows.map(normalizeTemplate) });
  } catch {
    res.status(500).json({ error: "Failed to load document templates." });
  }
});

app.get("/api/image-proxy", async (req, res) => {
  try {
    const rawUrl = String(req.query.url || "").trim();
    const url = new URL(rawUrl);

    if (!["http:", "https:"].includes(url.protocol)) {
      return res.status(400).json({ error: "Only http and https image URLs are supported." });
    }

    const upstream = await fetch(url, {
      headers: {
        "User-Agent": "LISAcademyWebsite/1.0",
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
    });

    if (!upstream.ok) {
      return res.status(502).json({ error: "Failed to fetch template image." });
    }

    const contentType = upstream.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      return res.status(415).json({ error: "The provided URL did not return an image." });
    }

    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.header("Content-Type", contentType);
    res.header("Cache-Control", "public, max-age=3600");
    res.send(buffer);
  } catch {
    res.status(400).json({ error: "Invalid image URL." });
  }
});

app.post("/api/members/register", async (req, res) => {
  try {
    validateRegistration(req.body);

    const email = String(req.body.email).trim().toLowerCase();
    const phone = String(req.body.phone).trim();

    const existing = await sql`
      SELECT id FROM members
      WHERE lower(email) = ${email} OR phone = ${phone}
      LIMIT 1
    `;

    if (existing.length > 0) {
      return res.status(409).json({ error: "A member with this email or mobile number already exists." });
    }

    const { membershipNumber, membershipId } = await generateMembershipIdentity();
    const passwordHash = await bcrypt.hash(String(req.body.password), 10);
    const issueDate = new Date().toISOString();

    const rows = await sql`
      INSERT INTO members (
        membership_number,
        membership_id,
        name,
        email,
        phone,
        password_hash,
        category,
        custom_detail,
        designation,
        institution,
        address,
        city,
        state,
        pincode,
        membership_tier,
        status,
        photo_data_url,
        issue_date,
        approved_at
      ) VALUES (
        ${membershipNumber},
        ${membershipId},
        ${String(req.body.name).trim()},
        ${email},
        ${phone},
        ${passwordHash},
        ${String(req.body.category).trim()},
        ${String(req.body.custom_detail).trim()},
        ${String(req.body.designation).trim()},
        ${String(req.body.institution).trim()},
        ${String(req.body.address).trim()},
        ${String(req.body.city).trim()},
        ${String(req.body.state).trim()},
        ${String(req.body.pincode).trim()},
        ${String(req.body.membership_tier).trim()},
        ${"approved"},
        ${req.body.photo_data_url ? String(req.body.photo_data_url) : null},
        ${issueDate},
        ${issueDate}
      )
      RETURNING *
    `;

    const member = publicMember(rows[0]);
    const token = signToken({ role: "member", memberId: member.id, membershipId: member.membership_id, email: member.email });

    res.status(201).json({ token, member });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed.";
    res.status(400).json({ error: message });
  }
});

app.post("/api/members/login", async (req, res) => {
  try {
    const identifier = String(req.body.identifier || "").trim();
    const password = String(req.body.password || "");

    if (!identifier || !password) {
      return res.status(400).json({ error: "Email or membership ID and password are required." });
    }

    const rows = await sql`
      SELECT * FROM members
      WHERE lower(email) = ${identifier.toLowerCase()} OR membership_id = ${identifier}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid login credentials." });
    }

    const member = rows[0];
    const valid = await bcrypt.compare(password, member.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid login credentials." });
    }

    if (member.status !== "approved") {
      return res.status(403).json({ error: `Membership is currently ${member.status}.` });
    }

    const normalized = publicMember(member);
    const token = signToken({ role: "member", memberId: normalized.id, membershipId: normalized.membership_id, email: normalized.email });
    res.json({ token, member: normalized });
  } catch {
    res.status(500).json({ error: "Login failed." });
  }
});

app.get("/api/members/me", requireAuth, async (req, res) => {
  try {
    if (req.user?.role !== "member") {
      return res.status(403).json({ error: "Member access required." });
    }

    const rows = await sql`SELECT * FROM members WHERE id = ${req.user.memberId} LIMIT 1`;
    if (rows.length === 0) {
      return res.status(404).json({ error: "Member not found." });
    }

    res.json({ member: publicMember(rows[0]) });
  } catch {
    res.status(500).json({ error: "Failed to load member profile." });
  }
});

app.put("/api/members/me/certificate", requireAuth, async (req, res) => {
  try {
    if (req.user?.role !== "member") {
      return res.status(403).json({ error: "Member access required." });
    }

    const certificateDataUrl = String(req.body.certificate_data_url || "").trim();
    const templateVersion = Number(req.body.certificate_template_version);

    if (!certificateDataUrl.startsWith("data:image/png;base64,") && !certificateDataUrl.startsWith("data:image/jpeg;base64,")) {
      return res.status(400).json({ error: "A PNG or JPEG certificate image is required." });
    }

    if (!Number.isInteger(templateVersion) || templateVersion < 1) {
      return res.status(400).json({ error: "A valid certificate template version is required." });
    }

    const rows = await sql`
      UPDATE members
      SET
        certificate_data_url = ${certificateDataUrl},
        certificate_template_version = ${templateVersion}
      WHERE id = ${req.user.memberId}
      RETURNING *
    `;

    if (rows.length === 0) {
      return res.status(404).json({ error: "Member not found." });
    }

    res.json({
      saved: true,
      certificate_template_version: Number(rows[0].certificate_template_version || templateVersion),
    });
  } catch {
    res.status(500).json({ error: "Failed to save certificate." });
  }
});

app.post("/api/admin/login", async (req, res) => {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "");

  if (username !== adminUsername || password !== adminPassword) {
    return res.status(401).json({ error: "Invalid admin credentials." });
  }

  const token = signToken({ role: "admin", username });
  res.json({ token, admin: { username } });
});

app.get("/api/admin/members", requireAdmin, async (_req, res) => {
  try {
    const rows = await sql`SELECT * FROM members ORDER BY created_at DESC`;
    res.json({ members: rows.map(publicMember) });
  } catch {
    res.status(500).json({ error: "Failed to load members." });
  }
});

app.post("/api/admin/events", requireAdmin, async (req, res) => {
  try {
    assertRequired(req.body.title, "Title");
    assertRequired(req.body.date, "Date");
    assertRequired(req.body.location, "Location");
    assertRequired(req.body.type, "Type");
    assertRequired(req.body.description, "Description");

    const rows = await sql`
      INSERT INTO events (
        title,
        event_date,
        location,
        event_type,
        description,
        speakers,
        agenda,
        image_url,
        registration_url,
        is_featured,
        sort_order
      ) VALUES (
        ${String(req.body.title).trim()},
        ${String(req.body.date).trim()},
        ${String(req.body.location).trim()},
        ${String(req.body.type).trim()},
        ${String(req.body.description).trim()},
        ${JSON.stringify(normalizeJsonArray(req.body.speakers))}::jsonb,
        ${JSON.stringify(normalizeJsonArray(req.body.agenda))}::jsonb,
        ${String(req.body.image_url || "").trim() || null},
        ${String(req.body.registration_url || "").trim() || null},
        ${Boolean(req.body.is_featured)},
        ${Number(req.body.sort_order || 0)}
      )
      RETURNING *
    `;
    res.status(201).json({ event: normalizeEvent(rows[0]) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create event.";
    res.status(400).json({ error: message });
  }
});

app.put("/api/admin/events/:id", requireAdmin, async (req, res) => {
  try {
    assertRequired(req.body.title, "Title");
    assertRequired(req.body.date, "Date");
    assertRequired(req.body.location, "Location");
    assertRequired(req.body.type, "Type");
    assertRequired(req.body.description, "Description");

    const rows = await sql`
      UPDATE events
      SET
        title = ${String(req.body.title).trim()},
        event_date = ${String(req.body.date).trim()},
        location = ${String(req.body.location).trim()},
        event_type = ${String(req.body.type).trim()},
        description = ${String(req.body.description).trim()},
        speakers = ${JSON.stringify(normalizeJsonArray(req.body.speakers))}::jsonb,
        agenda = ${JSON.stringify(normalizeJsonArray(req.body.agenda))}::jsonb,
        image_url = ${String(req.body.image_url || "").trim() || null},
        registration_url = ${String(req.body.registration_url || "").trim() || null},
        is_featured = ${Boolean(req.body.is_featured)},
        sort_order = ${Number(req.body.sort_order || 0)},
        updated_at = NOW()
      WHERE id = ${req.params.id}
      RETURNING *
    `;

    if (rows.length === 0) {
      return res.status(404).json({ error: "Event not found." });
    }

    res.json({ event: normalizeEvent(rows[0]) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update event.";
    res.status(400).json({ error: message });
  }
});

app.delete("/api/admin/events/:id", requireAdmin, async (req, res) => {
  try {
    await sql`DELETE FROM events WHERE id = ${req.params.id}`;
    res.status(204).end();
  } catch {
    res.status(500).json({ error: "Failed to delete event." });
  }
});

app.put("/api/admin/content/:section", requireAdmin, async (req, res) => {
  try {
    const section = String(req.params.section || "").trim();
    if (!section) {
      return res.status(400).json({ error: "Section is required." });
    }

    const data = req.body?.data && typeof req.body.data === "object" ? req.body.data : req.body;
    for (const [key, value] of Object.entries(data)) {
      await sql`
        INSERT INTO site_content (section, key, value, updated_at)
        VALUES (${section}, ${String(key)}, ${String(value || "")}, NOW())
        ON CONFLICT (section, key)
        DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
      `;
    }

    const rows = await sql`SELECT section, key, value, updated_at FROM site_content WHERE section = ${section} ORDER BY key ASC`;
    res.json({ content: rows });
  } catch {
    res.status(500).json({ error: "Failed to save site content." });
  }
});

app.put("/api/admin/document-templates/:key", requireAdmin, async (req, res) => {
  try {
    const key = String(req.params.key || "").trim();
    if (!TEMPLATE_KEYS.has(key)) {
      return res.status(400).json({ error: "Invalid template key." });
    }

    const fieldMap = req.body.field_map && typeof req.body.field_map === "object" ? req.body.field_map : {};
    const rows = await sql`
      INSERT INTO document_templates (template_key, label, template_url, field_map, updated_at)
      VALUES (
        ${key},
        ${String(req.body.label || key).trim()},
        ${String(req.body.template_url || "").trim()},
        ${JSON.stringify(fieldMap)}::jsonb,
        NOW()
      )
      ON CONFLICT (template_key)
      DO UPDATE SET
        label = EXCLUDED.label,
        template_url = EXCLUDED.template_url,
        field_map = EXCLUDED.field_map,
        updated_at = NOW()
      RETURNING *
    `;
    res.json({ template: normalizeTemplate(rows[0]) });
  } catch {
    res.status(500).json({ error: "Failed to save document template." });
  }
});

app.get("/api/admin/members/:id", requireAdmin, async (req, res) => {
  try {
    const rows = await sql`SELECT * FROM members WHERE id = ${req.params.id} LIMIT 1`;
    if (rows.length === 0) {
      return res.status(404).json({ error: "Member not found." });
    }
    res.json({ member: publicMember(rows[0]) });
  } catch {
    res.status(500).json({ error: "Failed to load member." });
  }
});

app.patch("/api/admin/members/:id/status", requireAdmin, async (req, res) => {
  try {
    const status = String(req.body.status || "").trim();
    if (!MEMBER_STATUSES.has(status)) {
      return res.status(400).json({ error: "Invalid member status." });
    }

    const approvedAt = status === "approved" ? new Date().toISOString() : null;
    const rows = await sql`
      UPDATE members
      SET status = ${status}, approved_at = ${approvedAt}
      WHERE id = ${req.params.id}
      RETURNING *
    `;

    if (rows.length === 0) {
      return res.status(404).json({ error: "Member not found." });
    }

    res.json({ member: publicMember(rows[0]) });
  } catch {
    res.status(500).json({ error: "Failed to update member status." });
  }
});

app.delete("/api/admin/members/:id", requireAdmin, async (req, res) => {
  try {
    await sql`DELETE FROM members WHERE id = ${req.params.id}`;
    res.status(204).end();
  } catch {
    res.status(500).json({ error: "Failed to delete member." });
  }
});

ensureMemberDocumentColumns()
  .then(() => {
    app.listen(port, () => {
      console.log(`LIS Academy API listening on http://localhost:${port}`);
      console.log(`Life certificate template version: ${LIFE_CERTIFICATE_TEMPLATE_VERSION}`);
    });
  })
  .catch((error) => {
    console.error("Failed to prepare member document columns.", error);
    process.exit(1);
  });
