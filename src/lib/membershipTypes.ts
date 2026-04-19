export type MembershipTier = "student" | "professional" | "life" | "institutional";
export type MemberStatus = "pending" | "approved" | "rejected";

export interface Member {
  id: string;
  membership_id: string;
  membership_number?: number;
  name: string;
  email: string;
  phone: string;
  category?: string;
  custom_detail?: string;
  designation: string;
  institution: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  membership_tier: MembershipTier;
  status: MemberStatus;
  photo_data_url?: string;
  photo_url?: string;
  certificate_data_url?: string;
  certificate_template_version?: number;
  created_at: string;
  approved_at?: string;
  issue_date?: string;
}

export interface SiteContent {
  id: string;
  section: string;
  key: string;
  value: string;
  updated_at: string;
}

export const MEMBERSHIP_TIERS: { value: MembershipTier; label: string; fee: string }[] = [
  { value: "student", label: "Student Member", fee: "Rs. 500 / year" },
  { value: "professional", label: "Professional Member", fee: "Rs. 1,500 / year" },
  { value: "life", label: "Life Member", fee: "Rs. 10,000 one-time" },
  { value: "institutional", label: "Institutional Member", fee: "Rs. 5,000 / year" },
];

export const TIER_COLORS: Record<MembershipTier, string> = {
  student: "#3b82f6",
  professional: "#c9a84c",
  life: "#9333ea",
  institutional: "#16a34a",
};
