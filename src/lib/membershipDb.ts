import { apiRequest, clearMemberToken, getMemberToken, setMemberToken, getAdminToken, setAdminToken, clearAdminToken } from "./api";
import type { Member, MembershipTier, MemberStatus, LifeCertificateEditorState } from "./membershipTypes";
import { LIFE_CERTIFICATE_TEMPLATE_VERSION } from "./certificateGenerator";
export { MEMBERSHIP_TIERS, TIER_COLORS } from "./membershipTypes";

export interface CreateMemberInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  category: string;
  custom_detail: string;
  designation: string;
  institution: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  membership_tier: MembershipTier;
  photo_data_url?: string;
  certificate_editor_state?: LifeCertificateEditorState;
  certificate_draft_data_url?: string;
}

interface MemberAuthResponse {
  token: string;
  member: Member;
}

export async function registerMember(input: CreateMemberInput): Promise<Member> {
  const response = await apiRequest<MemberAuthResponse>("/api/members/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
  setMemberToken(response.token);
  return response.member;
}

export async function loginMember(identifier: string, password: string): Promise<Member> {
  const response = await apiRequest<MemberAuthResponse>("/api/members/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });
  setMemberToken(response.token);
  return response.member;
}

export function logoutMember() {
  clearMemberToken();
}

export async function getCurrentMember(): Promise<Member | null> {
  const token = getMemberToken();
  if (!token) return null;
  try {
    const response = await apiRequest<{ member: Member }>("/api/members/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.member;
  } catch {
    clearMemberToken();
    return null;
  }
}

export async function createMember(input: CreateMemberInput): Promise<Member> {
  return registerMember(input);
}

export async function adminLogin(username: string, password: string): Promise<void> {
  const response = await apiRequest<{ token: string }>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  setAdminToken(response.token);
}

export function adminLogout() {
  clearAdminToken();
}

export function hasAdminToken() {
  return Boolean(getAdminToken());
}

function adminHeaders() {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getAllMembers(): Promise<Member[]> {
  const response = await apiRequest<{ members: Member[] }>("/api/admin/members", {
    headers: adminHeaders(),
  });
  return response.members;
}

export async function getMemberById(id: string): Promise<Member | null> {
  try {
    const response = await apiRequest<{ member: Member }>(`/api/admin/members/${id}`, {
      headers: adminHeaders(),
    });
    return response.member;
  } catch {
    return null;
  }
}

export async function getMemberByMembershipId(membershipId: string): Promise<Member | null> {
  const member = await getCurrentMember();
  if (member?.membership_id === membershipId) {
    return member;
  }
  return null;
}

export async function updateMemberStatus(id: string, status: MemberStatus): Promise<void> {
  await apiRequest<{ member: Member }>(`/api/admin/members/${id}/status`, {
    method: "PATCH",
    headers: adminHeaders(),
    body: JSON.stringify({ status }),
  });
}

export async function updateMember(): Promise<void> {
  throw new Error("Member updates are not implemented in this flow yet.");
}

export async function deleteMember(id: string): Promise<void> {
  await apiRequest<void>(`/api/admin/members/${id}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });
}

export async function saveMemberCertificate(certificate_data_url: string): Promise<{ saved: true; certificate_template_version: number }> {
  const token = getMemberToken();
  if (!token) {
    throw new Error("Member authentication required.");
  }

  const response = await apiRequest<{ saved: true; certificate_template_version: number }>("/api/members/me/certificate", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      certificate_data_url,
      certificate_template_version: LIFE_CERTIFICATE_TEMPLATE_VERSION,
    }),
  });

  return response;
}

export async function saveMemberCertificateDraft(
  certificate_draft_data_url: string,
  certificate_editor_state: LifeCertificateEditorState,
  submit_for_review: boolean,
): Promise<{ saved: true; submitted_at?: string }> {
  const token = getMemberToken();
  if (!token) {
    throw new Error("Member authentication required.");
  }

  return apiRequest<{ saved: true; submitted_at?: string }>("/api/members/me/certificate-draft", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      certificate_draft_data_url,
      certificate_editor_state,
      submit_for_review,
    }),
  });
}
