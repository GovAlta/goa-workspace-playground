import { Case } from "../../types/Case";

/**
 * State for filter drawer - stores selected filter values
 */
export interface FilterState {
  status: string[];
  priority: string[];
  jurisdiction: string[];
  staff: string[];
}

/**
 * A group of cases organized by a common field (status, priority, etc.)
 */
export interface GroupedCase {
  key: string;
  label: string;
  cases: Case[];
}

/**
 * Filter chip with metadata for display and removal
 */
export interface FilterChip {
  category: keyof FilterState;
  value: string;
  label: string;
}

/**
 * Available filter options derived from case data
 */
export interface FilterOptions {
  statuses: string[];
  priorities: string[];
  jurisdictions: string[];
  staffMembers: string[];
}

/**
 * Sort field labels for display
 */
export const SORT_FIELD_LABELS: Record<string, string> = {
  status: "Status",
  dueDate: "Due date",
  jurisdiction: "Jurisdiction",
  priority: "Priority",
};
