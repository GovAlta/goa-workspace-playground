import { GoabFilterChip, GoabIcon, GoabLink } from "@abgov/react-components";
import { SearchFilters } from "./types";

interface SearchFilterChipsProps {
  filters: SearchFilters;
  searchChips: string[];
  onEntityClear: () => void;
  onStatusClear: () => void;
  onRemoveChip: (chip: string) => void;
  onClearAll: () => void;
}

export function SearchFilterChips({
  filters,
  searchChips,
  onEntityClear,
  onStatusClear,
  onRemoveChip,
  onClearAll,
}: SearchFilterChipsProps) {
  const hasActiveFilters =
    searchChips.length > 0 || filters.entity !== "all" || filters.status !== "all";

  if (!hasActiveFilters) return null;

  return (
    <div className="chips-container">
      <GoabIcon
        type="filter-lines"
        size="small"
        fillColor="var(--goa-color-text-secondary)"
        mr="2xs"
      />
      {filters.entity !== "all" && (
        <GoabFilterChip
          content={
            filters.entity === "client"
              ? "Clients"
              : filters.entity === "case"
                ? "Cases"
                : filters.entity === "application"
                  ? "Applications"
                  : "Documents"
          }
          onClick={onEntityClear}
        />
      )}
      {filters.status !== "all" && (
        <GoabFilterChip content={filters.status} onClick={onStatusClear} />
      )}
      {searchChips.map((chip) => (
        <GoabFilterChip key={chip} content={chip} onClick={() => onRemoveChip(chip)} />
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
