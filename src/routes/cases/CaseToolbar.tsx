import {
  GoabTabs,
  GoabTab,
  GoabBadge,
  GoabFormItem,
  GoabInput,
  GoabMenuButton,
  GoabMenuAction,
  GoabIconButton,
  GoabButton,
} from "@abgov/react-components";
import {
  GoabInputOnChangeDetail,
  GoabInputOnKeyPressDetail,
  GoabMenuButtonOnActionDetail,
} from "@abgov/ui-components-common";
import {
  DisplaySettings,
  ViewSettings,
  LayoutType,
} from "../../components/DisplaySettings";
import { SortConfig } from "../../utils/searchUtils";
import { SORT_FIELD_LABELS } from "./types";

interface CaseToolbarProps {
  activeTab: string;
  myCasesCount: number;
  inProgressCount: number;
  onTabChange: (event: any) => void;
  inputValue: string;
  inputError: string;
  onInputChange: (value: string) => void;
  onInputKeyPress: (event: GoabInputOnKeyPressDetail) => void;
  sortConfig: SortConfig;
  onSortAction: (action: string) => void;
  viewSettings: ViewSettings;
  onSettingsChange: (settings: ViewSettings) => void;
  defaultLayout: LayoutType;
  isMobile: boolean;
  isCompactToolbar: boolean;
  onFilterOpen: () => void;
}

export function CaseToolbar({
  myCasesCount,
  inProgressCount,
  onTabChange,
  inputValue,
  inputError,
  onInputChange,
  onInputKeyPress,
  sortConfig,
  onSortAction,
  viewSettings,
  onSettingsChange,
  defaultLayout,
  isMobile,
  isCompactToolbar,
  onFilterOpen,
}: CaseToolbarProps) {
  const getSortIndicator = (key: string): string => {
    if (sortConfig.primary?.key === key) {
      const arrow = sortConfig.primary.direction === "asc" ? "↑" : "↓";
      return sortConfig.secondary ? ` (1st ${arrow})` : ` ${arrow}`;
    }
    if (sortConfig.secondary?.key === key) {
      const arrow = sortConfig.secondary.direction === "asc" ? "↑" : "↓";
      return ` (2nd ${arrow})`;
    }
    return "";
  };

  const getSortIcon = (key: string): "checkmark" | undefined => {
    if (sortConfig.primary?.key === key && !sortConfig.secondary) {
      return "checkmark";
    }
    return undefined;
  };

  return (
    <div className="cases-toolbar-row">
      <div className="cases-toolbar-tabs">
        <GoabTabs
          initialTab={1}
          onChange={onTabChange}
          stackOnMobile={false}
          variant="segmented"
        >
          <GoabTab heading="Unassigned" />
          <GoabTab
            heading={
              <>
                Assigned to me{" "}
                <GoabBadge type="information" content={String(myCasesCount)} />
              </>
            }
          />
          <GoabTab
            heading={
              <>
                In progress{" "}
                <GoabBadge type="important" content={String(inProgressCount)} />
              </>
            }
          />
          <GoabTab heading="Complete" />
        </GoabTabs>
        <div className="cases-toolbar-tabs__spacer" aria-hidden="true" />
      </div>
      <div className="cases-search-row">
        <div className="cases-search-group">
          <GoabFormItem id="filterInput" error={inputError} labelSize="compact">
            <GoabInput
              name="filterInput"
              value={inputValue}
              leadingIcon="search"
              width="100%"
              size="compact"
              placeholder="Search..."
              onChange={(event: GoabInputOnChangeDetail) => {
                onInputChange(event.value);
              }}
              onKeyPress={onInputKeyPress}
            />
          </GoabFormItem>
        </div>
        <div className="cases-actions-group">
          <GoabMenuButton
            size="compact"
            type="tertiary"
            leadingIcon={isCompactToolbar ? "swap-vertical" : undefined}
            text={isCompactToolbar ? undefined : "Sort"}
            onAction={(e: GoabMenuButtonOnActionDetail) => onSortAction(e.action)}
          >
            {Object.entries(SORT_FIELD_LABELS).map(([key, label]) => (
              <GoabMenuAction
                key={key}
                text={`${label}${getSortIndicator(key)}`}
                action={`sort-${key}`}
                icon={getSortIcon(key)}
              />
            ))}
            {sortConfig.primary && (
              <GoabMenuAction
                text="Clear sort"
                action="clear-sort"
                variant="destructive"
              />
            )}
          </GoabMenuButton>
          {isCompactToolbar ? (
            <GoabIconButton
              icon="filter-lines"
              size="medium"
              variant="dark"
              ariaLabel="Filter"
              onClick={onFilterOpen}
            />
          ) : (
            <GoabButton
              type="tertiary"
              leadingIcon="filter-lines"
              size="compact"
              onClick={onFilterOpen}
            >
              Filter
            </GoabButton>
          )}
          <DisplaySettings
            settings={viewSettings}
            onSettingsChange={onSettingsChange}
            defaultLayout={defaultLayout}
            isMobile={isMobile}
            isCompact={isCompactToolbar}
          />
        </div>
      </div>
    </div>
  );
}
