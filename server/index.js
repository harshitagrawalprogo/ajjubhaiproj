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

app.use(express.json({ limit: "10mb" }));

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
    created_at: row.created_at,
    approved_at: row.approved_at || undefined,
    issue_date: row.issue_date || undefined,
  };
}

function publicMember(row) {
  return normalizeMember(row);
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

app.listen(port, () => {
  console.log(`LIS Academy API listening on http://localhost:${port}`);
});
