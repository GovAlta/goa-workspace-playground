import {
  GoabContainer,
  GoabText,
  GoabMenuButton,
  GoabMenuAction,
  GoabBlock,
} from "@abgov/react-components";
import {
  GoabxCheckbox,
  GoabxBadge,
  GoabxLink,
  GoabxButton,
} from "@abgov/react-components/experimental";
import { GoabMenuButtonOnActionDetail } from "@abgov/ui-components-common";
import { Case } from "../../types/Case";

interface CaseCardProps {
  caseItem: Case;
  activeTab: string;
  onMenuAction: (action: string, caseId: string) => void;
  onSelectChange: (caseId: string, selected: boolean) => void;
}

export function CaseCard({
  caseItem,
  activeTab,
  onMenuAction,
  onSelectChange,
}: CaseCardProps) {
  return (
    <GoabContainer
      key={caseItem.id}
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
          />
        </div>
      }
      actions={
        <div data-grid={"cell-3"} className="data-card__actions">
          {caseItem.comments > 0 && (
            <GoabxLink leadingIcon="chatbox" size="small">
              <a href="#">
                {caseItem.comments} comment{caseItem.comments === 1 ? "" : "s"}
              </a>
            </GoabxLink>
          )}
          {activeTab === "all" ? (
            <GoabMenuButton
              leadingIcon="ellipsis-horizontal"
              leadingIconTheme="filled"
              size="compact"
              onAction={(e: GoabMenuButtonOnActionDetail) =>
                onMenuAction(e.action, caseItem.id)
              }
            >
              <GoabMenuAction text="View" action="view" />
              <GoabMenuAction text="Assign me" action="assign" />
            </GoabMenuButton>
          ) : activeTab === "todo" ? (
            <GoabxButton
              type="tertiary"
              size="compact"
              onClick={() => onMenuAction("start", caseItem.id)}
            >
              Start
            </GoabxButton>
          ) : (
            <GoabMenuButton
              leadingIcon="ellipsis-horizontal"
              leadingIconTheme="filled"
              size="compact"
              onAction={(e: GoabMenuButtonOnActionDetail) =>
                onMenuAction(e.action, caseItem.id)
              }
            >
              <GoabMenuAction text="Continue" action="continue" />
              <GoabMenuAction text="Unassign me" action="unassign" />
              <GoabMenuAction text="Mark as complete" action="complete" />
            </GoabMenuButton>
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
                  {caseItem.category === "todo"
                    ? "To do"
                    : caseItem.category === "progress"
                      ? "In progress"
                      : caseItem.category === "complete"
                        ? "Complete"
                        : caseItem.category || "—"}
                </span>
              </GoabBlock>
            </div>
          </div>
        </div>
      </div>
    </GoabContainer>
  );
}
