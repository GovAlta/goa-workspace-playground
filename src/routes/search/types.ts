export interface SearchFilters {
  entity: string; // 'all' | 'case' | 'application' | 'document'
  status: string; // 'all' | specific status values
  searchText: string; // Free text search
}

export type ViewMode = "table" | "card" | "list";
