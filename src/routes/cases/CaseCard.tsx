import { GoabContainer, GoabText, GoabBlock } from "@abgov/react-components";
import {
  GoabxCheckbox,
  GoabxBadge,
  GoabxLink,
  GoabxButton,
  GoabxMenuButton,
  GoabxMenuAction,
} from "@abgov/react-components/experimental";
import { GoabMenuButtonOnActionDetail } from "@abgov/ui-components-common";
import { Case } from "../../types/Case";

const CATEGORY_LABELS: Record<string, string> = {
  todo: "To do",
  progress: "In progress",
  complete: "Complete",
};

const categoryLabel = (category: string): string =>
  CATEGORY_LABELS[category] || category || "—";

interface CaseCardProps {
  caseItem: Case;
  activeTab: string;
  commentCount?: number;
  onMenuAction: (action: string, caseId: string) => void;
  onSelectChange: (caseId: string, selected: boolean) => void;
}

export function CaseCard({
  caseItem,
  activeTab,
  commentCount = 0,
  onMenuAction,
  onSelectChange,
}: CaseCardProps) {
  return (
    <GoabContainer
      accent="thick"
      type="non-interactive"
      padding="compact"
      mb="none"
      data-grid="row"
      heading={
        <div className="data-card__title">
          {activeTab === "all" && (
            <GoabxCheckbox
              name={`select-card-${caseItem.id}`}
              checked={caseItem.selected}
              onChange={() => onSelectChange(caseItem.id, !caseItem.selected)}
              ariaLabel={`Select ${caseItem.name}`}
            />
          )}
          <GoabText size="heading-xs" mt={"none"} mb={"none"} data-grid={"cell-1"}>
            {caseItem.name}
          </GoabText>
          <GoabxBadge
            data-grid={"cell-2"}
            type={caseItem.status}
            content={caseItem.statusText}
            icon={true}
            emphasis="subtle"
          />
        </div>
      }
      actions={
        <div data-grid={"cell-3"} className="data-card__actions">
          {commentCount > 0 && (
            <GoabxLink leadingIcon="chatbox" size="small">
              <button
                className="link-button"
                onClick={() => onMenuAction("comments", caseItem.id)}
              >
                {commentCount} comment{commentCount === 1 ? "" : "s"}
              </button>
            </GoabxLink>
          )}
          {activeTab === "all" ? (
            <GoabxMenuButton
              leadingIcon="ellipsis-horizontal:filled"
              size="compact"
              onAction={(e: GoabMenuButtonOnActionDetail) =>
                onMenuAction(e.action, caseItem.id)
              }
            >
              <GoabxMenuAction text="View" action="view" />
              <GoabxMenuAction text="Assign me" action="assign" />
            </GoabxMenuButton>
          ) : activeTab === "todo" ? (
            <GoabxButton
              type="tertiary"
              size="compact"
              onClick={() => onMenuAction("start", caseItem.id)}
            >
              Start
            </GoabxButton>
          ) : (
            <GoabxMenuButton
              leadingIcon="ellipsis-horizontal:filled"
              size="compact"
              onAction={(e: GoabMenuButtonOnActionDetail) =>
                onMenuAction(e.action, caseItem.id)
              }
            >
              <GoabxMenuAction text="Continue" action="continue" />
              <GoabxMenuAction text="Unassign me" action="unassign" />
              <GoabxMenuAction text="Mark as complete" action="complete" />
            </GoabxMenuButton>
          )}
        </div>
      }
    >
      <div className="data-card__body">
        <div className="data-card__sections">
          <div className="data-card__section">
            <div className="data-card__section-heading">Identification</div>
            <div className="data-card__section-fields">
              <GoabBlock direction="column" gap="xs" data-grid="cell-4">
                <span className="data-card__label">File number</span>
                <span className="data-card__value">{caseItem.fileNumber || "—"}</span>
              </GoabBlock>
              <GoabBlock direction="column" gap="xs" data-grid="cell-5">
                <span className="data-card__label">Jurisdiction</span>
                <span className="data-card__value">{caseItem.jurisdiction || "—"}</span>
              </GoabBlock>
            </div>
          </div>
          <div className="data-card__section">
            <div className="data-card__section-heading">Assignment</div>
            <div className="data-card__section-fields">
              <GoabBlock direction="column" gap="xs" data-grid="cell-6">
                <span className="data-card__label">Assigned to</span>
                <span className="data-card__value">{caseItem.staff || "—"}</span>
              </GoabBlock>
              <GoabBlock direction="column" gap="xs" data-grid="cell-7">
                <span className="data-card__label">Due date</span>
                <span className="data-card__value">{caseItem.dueDate || "—"}</span>
              </GoabBlock>
              <GoabBlock direction="column" gap="xs" data-grid="cell-8">
                <span className="data-card__label">Category</span>
                <span className="data-card__value">
                  {categoryLabel(caseItem.category)}
                </span>
              </GoabBlock>
            </div>
          </div>
        </div>
      </div>
    </GoabContainer>
  );
}
