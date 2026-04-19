import { apiRequest, getAdminToken } from "./api";

export type DocumentTemplateKey = "certificate" | "id_front" | "id_back";

export interface DocumentTemplate {
  key: DocumentTemplateKey;
  label: string;
  template_url: string;
  field_map: Record<string, unknown>;
  updated_at?: string;
}

const defaultTemplates: DocumentTemplate[] = [
  { key: "certificate", label: "Membership Certificate", template_url: "", field_map: {} },
  { key: "id_front", label: "ID Card Front", template_url: "", field_map: {} },
  { key: "id_back", label: "ID Card Back", template_url: "", field_map: {} },
];

function adminHeaders() {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchDocumentTemplates(): Promise<DocumentTemplate[]> {
  try {
    const response = await apiRequest<{ templates: DocumentTemplate[] }>("/api/document-templates");
    return response.templates;
  } catch {
    return defaultTemplates;
  }
}

export async function saveDocumentTemplate(template: DocumentTemplate): Promise<DocumentTemplate> {
  const response = await apiRequest<{ template: DocumentTemplate }>(`/api/admin/document-templates/${template.key}`, {
    method: "PUT",
    headers: adminHeaders(),
    body: JSON.stringify(template),
  });
  return response.template;
}
