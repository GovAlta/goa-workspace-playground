import { GoabFilterChip, GoabIcon, GoabLink } from "@abgov/react-components";
import { FilterChip, SORT_FIELD_LABELS } from "./types";
import { SortConfig } from "../../utils/searchUtils";

interface CaseFilterChipsProps {
  searchChips: string[];
  filterChips: FilterChip[];
  sortConfig: SortConfig;
  onRemoveSearchChip: (chip: string) => void;
  onRemoveFilter: (category: string, value: string) => void;
  onRemoveSort: (level: "primary" | "secondary") => void;
  onClearAll: () => void;
}

export function CaseFilterChips({
  searchChips,
  filterChips,
  sortConfig,
  onRemoveSearchChip,
  onRemoveFilter,
  onRemoveSort,
  onClearAll,
}: CaseFilterChipsProps) {
  const hasChips = searchChips.length > 0 || filterChips.length > 0 || sortConfig.primary;

  if (!hasChips) {
    return null;
  }

  return (
    <div className="chips-container">
      <GoabIcon
        type="filter-lines"
        size="small"
        fillColor="var(--goa-color-text-secondary)"
        mr="2xs"
      />

      {sortConfig.primary && (
        <GoabFilterChip
          key={`sort-primary-${sortConfig.primary.key}`}
          content={SORT_FIELD_LABELS[sortConfig.primary.key]}
          leadingIcon={sortConfig.primary.direction === "asc" ? "arrow-up" : "arrow-down"}
          secondaryText={sortConfig.secondary ? "1st" : undefined}
          onClick={() => onRemoveSort("primary")}
        />
      )}
      {sortConfig.secondary && (
        <GoabFilterChip
          key={`sort-secondary-${sortConfig.secondary.key}`}
          content={SORT_FIELD_LABELS[sortConfig.secondary.key]}
          leadingIcon={
            sortConfig.secondary.direction === "asc" ? "arrow-up" : "arrow-down"
          }
          secondaryText="2nd"
          onClick={() => onRemoveSort("secondary")}
        />
      )}

      {searchChips.map((chip) => (
        <GoabFilterChip
          key={`search-${chip}`}
          content={chip}
          onClick={() => onRemoveSearchChip(chip)}
        />
      ))}

      {filterChips.map((chip) => (
        <GoabFilterChip
          key={`${chip.category}-${chip.value}`}
          content={chip.label}
          onClick={() => onRemoveFilter(chip.category, chip.value)}
        />
      ))}

      <GoabLink color="dark" size="small">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onClearAll();
          }}
        >
          Clear all
        </a>
      </GoabLink>
    </div>
  );
}
