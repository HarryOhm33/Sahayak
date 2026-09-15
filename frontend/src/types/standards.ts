export type RelationshipType =
  | "primary"
  | "normative"
  | "testing"
  | "safety"
  | "installation"
  | "related";

export interface AmendmentEntry {
  label: string;
  downloadUrl?: string;
}

export interface GazetteEntry {
  label: string;
  downloadUrls?: string[];
}

export interface ProductManualEntry {
  label: string;
  downloadUrl?: string;
}

export type Standard = {
  id: string;
  number: string;
  title: string;
  edition: string;
  status: "active" | "superseded";
  relevance?: number;
  relationship: RelationshipType;
  description: string;
  amendments?: AmendmentEntry[];
  certifications?: {
    name: string;
    status: "APPLICABLE" | "NOT APPLICABLE" | "CHECK REQUIRED";
  }[];
  missingParams?: string[];
  gazetteDocuments?: GazetteEntry[];
  productManuals?: ProductManualEntry[];
  url?: string;
};
