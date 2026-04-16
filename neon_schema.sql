CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SEQUENCE IF NOT EXISTS membership_number_seq START WITH 1601;

CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_number BIGINT NOT NULL UNIQUE,
  membership_id TEXT NOT NULL UNIQUE,
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
  membership_tier TEXT NOT NULL CHECK (membership_tier IN ('student', 'professional', 'life', 'institutional')),
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  photo_data_url TEXT,
  issue_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_members_created_at ON members (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_members_membership_id ON members (membership_id);
