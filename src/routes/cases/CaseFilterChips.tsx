import { GoabIcon, GoabFilterChip, GoabLink } from "@abgov/react-components";
import { FilterChip } from "./types";

interface CaseFilterChipsProps {
  searchChips: string[];
  filterChips: FilterChip[];
  onRemoveSearchChip: (chip: string) => void;
  onRemoveFilter: (category: string, value: string) => void;
  onClearAll: () => void;
}

export function CaseFilterChips({
  searchChips,
  filterChips,
  onRemoveSearchChip,
  onRemoveFilter,
  onClearAll,
}: CaseFilterChipsProps) {
  const hasChips = searchChips.length > 0 || filterChips.length > 0;

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
