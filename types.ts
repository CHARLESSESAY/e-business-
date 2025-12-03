
export enum LegalForm {
  PLC = 'Public Limited Company',
  LTD = 'Private Limited Company',
  PARTNERSHIP = 'Partnership',
  SOLE = 'Sole Proprietorship',
  NGO = 'Non-Governmental Organization',
  GOV = 'Public Authority / Local Gov'
}

export enum ReportStatus {
  MISSING = 'Missing',
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  previousHash: string;
  hash: string; // Blockchain simulation
  actor: string;
}

export interface AnnualReport {
  year: number;
  status: ReportStatus;
  submissionDate?: string;
  revenue?: number;
  transactionVolume?: number; // Proven transaction numbers
  notes?: string;
  filedBy?: string;
}

export interface Company {
  id: string;
  registryCode: string;
  name: string;
  legalForm: LegalForm;
  registrationDate: string;
  capital: number;
  address: string;
  website?: string; // New Website Field
  status: 'Active' | 'Liquidated' | 'Bankruptcy' | 'Inactive';
  reports: AnnualReport[];
  history: AuditLog[];
  
  // New Enhanced Fields
  managementBoard: string[]; // Top Administrative Members
  contactEmail: string;
  contactPhone: string;
  beneficialOwners: string[];
  taxDebt: number; // Amount in SLE, 0 means clean
  commercialPledges: number; // Number of active pledges
  relationships: { entity: string; type: 'Subsidiary' | 'Parent' | 'Partner' | 'Shareholder' }[];
}

export type ViewState = 'SEARCH' | 'COMPANY_DETAIL' | 'ADMIN_DASHBOARD' | 'USER_DASHBOARD' | 'NAME_CHECK' | 'OPEN_DATA';
