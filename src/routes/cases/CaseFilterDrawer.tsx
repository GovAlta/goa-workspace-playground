import { createPortal } from "react-dom";
import { GoabButtonGroup, GoabDivider, GoabPushDrawer } from "@abgov/react-components";
import {
  GoabxButton,
  GoabxFormItem,
  GoabxCheckbox,
} from "@abgov/react-components/experimental";
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
  const portalTarget = document.getElementById("page-push-drawer-portal");

  if (!portalTarget) return null;

  return createPortal(
    <div className={`push-drawer-container ${open ? "push-drawer-container--open" : ""}`}>
      <div className="push-drawer-clip">
        <GoabPushDrawer
          open={open}
          heading="Filter cases"
          onClose={onClose}
          actions={
            <GoabButtonGroup alignment="start" gap="compact">
              <GoabxButton type="primary" size="compact" onClick={onApply}>
                Apply filters
              </GoabxButton>
              <GoabxButton type="tertiary" size="compact" onClick={onClose}>
                Cancel
              </GoabxButton>
            </GoabButtonGroup>
          }
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--goa-space-l)",
            }}
          >
            <GoabxFormItem label="Status">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--goa-space-xs)",
                }}
              >
                {filterOptions.statuses.map((status) => (
                  <GoabxCheckbox
                    key={status}
                    name={`status-${status}`}
                    text={status}
                    checked={pendingFilters.status.includes(status)}
                    onChange={() => onToggleFilter("status", status)}
                  />
                ))}
              </div>
            </GoabxFormItem>

            <GoabxFormItem label="Priority">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--goa-space-xs)",
                }}
              >
                {filterOptions.priorities.map((priority) => (
                  <GoabxCheckbox
                    key={priority}
                    name={`priority-${priority}`}
                    text={priority.charAt(0).toUpperCase() + priority.slice(1)}
                    checked={pendingFilters.priority.includes(priority)}
                    onChange={() => onToggleFilter("priority", priority)}
                  />
                ))}
              </div>
            </GoabxFormItem>

            <GoabxFormItem label="Assigned to">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--goa-space-xs)",
                }}
              >
                {filterOptions.staffMembers.map((staff) => (
                  <GoabxCheckbox
                    key={staff}
                    name={`staff-${staff}`}
                    text={staff}
                    checked={pendingFilters.staff.includes(staff)}
                    onChange={() => onToggleFilter("staff", staff)}
                  />
                ))}
              </div>
            </GoabxFormItem>

            <GoabxFormItem label="Jurisdiction">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--goa-space-xs)",
                }}
              >
                {filterOptions.jurisdictions.map((jurisdiction) => (
                  <GoabxCheckbox
                    key={jurisdiction}
                    name={`jurisdiction-${jurisdiction}`}
                    text={jurisdiction}
                    checked={pendingFilters.jurisdiction.includes(jurisdiction)}
                    onChange={() => onToggleFilter("jurisdiction", jurisdiction)}
                  />
                ))}
              </div>
            </GoabxFormItem>

            {hasFilters && (
              <>
                <GoabDivider />
                <GoabxButton type="tertiary" size="compact" onClick={onClearAll}>
                  Clear all filters
                </GoabxButton>
              </>
            )}
          </div>
        </GoabPushDrawer>
      </div>
    </div>,
    portalTarget,
  );
}
