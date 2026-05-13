CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SEQUENCE IF NOT EXISTS membership_number_seq START WITH 1;

CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_number BIGINT NOT NULL UNIQUE,
  membership_id TEXT NOT NULL UNIQUE,
  application_id TEXT UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  category TEXT NOT NULL,
  custom_detail TEXT NOT NULL,
  designation TEXT NOT NULL,
  institution TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  membership_tier TEXT NOT NULL CHECK (membership_tier IN ('student', 'life', 'institutional')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  photo_data_url TEXT,
  certificate_draft_data_url TEXT,
  certificate_editor_state JSONB,
  certificate_data_url TEXT,
  certificate_template_version INTEGER,
  volunteer_status TEXT NOT NULL DEFAULT 'not_applied',
  volunteer_applied_at TIMESTAMPTZ,
  issue_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  certificate_submitted_at TIMESTAMPTZ
);

ALTER TABLE members ADD COLUMN IF NOT EXISTS application_id TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS certificate_draft_data_url TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS certificate_editor_state JSONB;
ALTER TABLE members ADD COLUMN IF NOT EXISTS certificate_data_url TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS certificate_template_version INTEGER;
ALTER TABLE members ADD COLUMN IF NOT EXISTS certificate_submitted_at TIMESTAMPTZ;
ALTER TABLE members ADD COLUMN IF NOT EXISTS volunteer_status TEXT DEFAULT 'not_applied';
ALTER TABLE members ADD COLUMN IF NOT EXISTS volunteer_applied_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_members_created_at ON members (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_members_membership_id ON members (membership_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_members_application_id ON members (application_id);

UPDATE members
SET
  application_id = COALESCE(application_id, CONCAT('APP/', membership_number::text)),
  status = COALESCE(status, 'pending')
WHERE application_id IS NULL OR status IS NULL;

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  event_date TEXT NOT NULL,
  location TEXT NOT NULL,
  event_type TEXT NOT NULL,
  description TEXT NOT NULL,
  speakers JSONB NOT NULL DEFAULT '[]'::jsonb,
  agenda JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_url TEXT,
  registration_url TEXT,
  brochure_url TEXT,
  gallery_url TEXT,
  report_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE events ADD COLUMN IF NOT EXISTS brochure_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS gallery_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS report_url TEXT;

CREATE INDEX IF NOT EXISTS idx_events_sort ON events (sort_order ASC, created_at DESC);

DELETE FROM events a
USING events b
WHERE a.ctid < b.ctid
  AND a.title = b.title
  AND a.event_date = b.event_date
  AND a.location = b.location;

CREATE UNIQUE INDEX IF NOT EXISTS idx_events_unique_identity ON events (title, event_date, location);

CREATE TABLE IF NOT EXISTS site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (section, key)
);

CREATE TABLE IF NOT EXISTS document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  template_url TEXT NOT NULL DEFAULT '',
  field_map JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO site_content (section, key, value) VALUES
  ('hero', 'headline', 'Learn. Inspire. Serve.'),
  ('hero', 'subtitle', 'A professional Public Charitable Trust advancing the Library & Information Science profession through world-class training, technology implementation, and research across India.'),
  ('about', 'description', 'LIS Academy is India''s Premier Library & Information Science Platform.'),
  ('contact', 'email', 'info@lisacademy.org'),
  ('contact', 'phone', '080-35006965'),
  ('contact', 'address', '7/29, Vijayalakshmi Complex, 1st Main Road, Gokul, Bengaluru - 560054'),
  ('social', 'facebook', 'https://facebook.com/lisacademy'),
  ('social', 'twitter', 'https://twitter.com/lisacademy'),
  ('social', 'linkedin', 'https://linkedin.com/company/lisacademy'),
  ('social', 'youtube', 'https://youtube.com/@lisacademy'),
  ('social', 'instagram', 'https://instagram.com/lisacademy'),
  ('topbar', 'tagline', 'LEARN | INSPIRE | SERVE'),
  ('donate', 'headline', 'Support LIS Academy'),
  ('donate', 'intro', 'Your contribution helps LIS Academy expand professional development, research, and community initiatives for library and information science.'),
  ('donate', 'note', 'Contributions are accepted in multiples of Rs. 100. Please choose an amount and continue to the payment gateway.')
ON CONFLICT (section, key) DO NOTHING;

INSERT INTO document_templates (template_key, label, template_url, field_map) VALUES
  ('certificate', 'Membership Certificate', '', '{}'::jsonb),
  ('id_front', 'ID Card Front', '', '{}'::jsonb),
  ('id_back', 'ID Card Back', '', '{}'::jsonb)
ON CONFLICT (template_key) DO NOTHING;

INSERT INTO events (title, event_date, location, event_type, description, speakers, agenda, sort_order, is_featured) VALUES
  (
    '1st LIS Academy Conference',
    'December 21-23, 2017',
    'Gandhi Bhavan, Kumara Park, Bengaluru',
    'Conference',
    'The inaugural LIS Academy conference was organized with public library and scientometrics partners around the larger idea of information for all and the public role of libraries.',
    '["Department of Public Libraries", "Raja Rammohun Roy Library Foundation", "Institute of Scientometrics"]'::jsonb,
    '["Inaugural conference sessions", "Public library themes", "Infographics and scientometrics discussions", "Technical presentations"]'::jsonb,
    10,
    TRUE
  ),
  (
    '2nd LIS Academy Conference on Innovations in Libraries',
    'June 6-8, 2019',
    'Visvesvaraya Technological University, Belagavi',
    'Conference',
    'This edition focused on how innovation and emerging technologies are reshaping libraries, information access, LIS education, and service delivery.',
    '["Prof. Kavi Mahesh", "Dr. S. M. Pujar", "Dr. Buddhi Prakash Chauhan", "Delegates from India and Bangladesh"]'::jsonb,
    '["Conference theme sessions", "Library technology trends", "Innovations in library technologies", "Technology-based library services"]'::jsonb,
    20,
    TRUE
  ),
  (
    'LISA Distinguished Lecture Series',
    'Launched on November 14, 2020',
    'Online',
    'Lecture Series',
    'A recurring lecture forum created to expose LIS professionals to contemporary trends, leadership perspectives, and emerging technologies in librarianship.',
    '["Prof. P. Balaram", "Invited academic and research leaders"]'::jsonb,
    '["Distinguished keynote lecture", "Contemporary LIS issues", "Leadership and management perspectives", "Best-practice sharing"]'::jsonb,
    30,
    TRUE
  )
ON CONFLICT (title, event_date, location) DO NOTHING;
