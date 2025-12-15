export interface SearchResult {
  [key: string]: unknown;
  id: string;
  name: string;
  staff: string;
  dueDate: string;
  fileNumber: string;
  status: 'information' | 'success' | 'important' | 'emergency';
  statusText: string;
  type: 'client' | 'case' | 'application' | 'document';
  selected: boolean;
}

export type SortDirection = 'asc' | 'desc' | 'none';

export interface SortConfig {
  key: keyof SearchResult | '';
  direction: SortDirection;
}

export type BadgeType = 'information' | 'success' | 'important' | 'emergency' | 'midtone' | 'sky' | 'prairie' | 'lilac' | 'pasture' | 'sunset' | 'dawn';

export interface TypeBadgeProps {
  type: BadgeType;
  content: string;
}
