import {
  GoabDrawer,
  GoabButtonGroup,
  GoabButton,
  GoabFormItem,
  GoabCheckbox,
  GoabDivider,
} from "@abgov/react-components";
import { FilterState, FilterOptions } from "./types";

interface CaseFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  pendingFilters: FilterState;
  filterOptions: FilterOptions;
  onToggleFilter: (category: keyof FilterState, value: string) => void;
  onApply: () => void;
  onClearAll: () => void;
}

export function CaseFilterDrawer({
  open,
  onClose,
  pendingFilters,
  filterOptions,
  onToggleFilter,
  onApply,
  onClearAll,
}: CaseFilterDrawerProps) {
  const hasFilters = Object.values(pendingFilters).some((arr) => arr.length > 0);

  return (
    <GoabDrawer
      heading="Filter cases"
      position="right"
      open={open}
      maxSize="300px"
      onClose={onClose}
      actions={
        <GoabButtonGroup alignment="start" gap="compact">
          <GoabButton type="primary" size="compact" onClick={onApply}>
            Apply filters
          </GoabButton>
          <GoabButton type="tertiary" size="compact" onClick={onClose}>
            Cancel
          </GoabButton>
        </GoabButtonGroup>
      }
    >
      <div
        style={{ display: "flex", flexDirection: "column", gap: "var(--goa-space-l)" }}
      >
        <GoabFormItem label="Status">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--goa-space-xs)",
            }}
          >
            {filterOptions.statuses.map((status) => (
              <GoabCheckbox
                key={status}
                name={`status-${status}`}
                text={status}
                checked={pendingFilters.status.includes(status)}
                onChange={() => onToggleFilter("status", status)}
              />
            ))}
          </div>
        </GoabFormItem>

        <GoabFormItem label="Priority">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--goa-space-xs)",
            }}
          >
            {filterOptions.priorities.map((priority) => (
              <GoabCheckbox
                key={priority}
                name={`priority-${priority}`}
                text={priority.charAt(0).toUpperCase() + priority.slice(1)}
                checked={pendingFilters.priority.includes(priority)}
                onChange={() => onToggleFilter("priority", priority)}
              />
            ))}
          </div>
        </GoabFormItem>

        <GoabFormItem label="Assigned to">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--goa-space-xs)",
            }}
          >
            {filterOptions.staffMembers.map((staff) => (
              <GoabCheckbox
                key={staff}
                name={`staff-${staff}`}
                text={staff}
                checked={pendingFilters.staff.includes(staff)}
                onChange={() => onToggleFilter("staff", staff)}
              />
            ))}
          </div>
        </GoabFormItem>

        <GoabFormItem label="Jurisdiction">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--goa-space-xs)",
            }}
          >
            {filterOptions.jurisdictions.map((jurisdiction) => (
              <GoabCheckbox
                key={jurisdiction}
                name={`jurisdiction-${jurisdiction}`}
                text={jurisdiction}
                checked={pendingFilters.jurisdiction.includes(jurisdiction)}
                onChange={() => onToggleFilter("jurisdiction", jurisdiction)}
              />
            ))}
          </div>
        </GoabFormItem>

        {hasFilters && (
          <>
            <GoabDivider />
            <GoabButton type="tertiary" size="compact" onClick={onClearAll}>
              Clear all filters
            </GoabButton>
          </>
        )}
      </div>
    </GoabDrawer>
  );
}
