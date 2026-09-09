export type RelationshipType =
  | 'primary'
  | 'normative'
  | 'testing'
  | 'safety'
  | 'installation'
  | 'related';

export type CertificationStatus = 'APPLICABLE' | 'NOT APPLICABLE' | 'CHECK REQUIRED';

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

export interface Standard {
  id: string;
  number: string;
  title: string;
  edition: string;
  status: 'active' | 'superseded';
  relevance?: number;
  relationship: RelationshipType;
  description: string;
  amendments?: AmendmentEntry[];
  certifications?: {
    name: string;
    status: CertificationStatus;
  }[];
  missingParams?: string[];
  gazetteDocuments?: GazetteEntry[];
  productManuals?: ProductManualEntry[];
}

export interface RecommendationResponse {
  queryAnalysis: {
    originalQuery: string;
    parsedProduct: string;
    productCategory: string;
    ambiguityFlag: boolean;
    ambiguityNote: string | null;
  };
  standards: Standard[];
}

export interface BisStandard {
  standardId: number;
  standardNumber: string;
  standardName: string;
  standardNameInHindi: string;
  departmentId: number;
  committeeId: number;
  publishedOn: string;
  validUpto: string;
  withdrawStatus: number;
  withdrawOn: string | null;
  isStatus: number;
  matched_standard: string;
  standardEncId: string;
}

export interface BisSearchResponse {
  status: string;
  statusCode: number;
  msg: string;
  data: BisStandard[];
}

export interface RecommendRequest {
  query: string;
}

export interface ApiError {
  error: string;
  details?: string;
}
