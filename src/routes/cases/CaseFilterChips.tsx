import { GoabIcon } from "@abgov/react-components";
import { GoabxFilterChip, GoabxLink } from "@abgov/react-components/experimental";
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
        <GoabxFilterChip
          key={`search-${chip}`}
          content={chip}
          onClick={() => onRemoveSearchChip(chip)}
        />
      ))}

      {filterChips.map((chip) => (
        <GoabxFilterChip
          key={`${chip.category}-${chip.value}`}
          content={chip.label}
          onClick={() => onRemoveFilter(chip.category, chip.value)}
        />
      ))}

      <GoabxLink color="dark" size="small">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onClearAll();
          }}
        >
          Clear all
        </a>
      </GoabxLink>
    </div>
  );
}
