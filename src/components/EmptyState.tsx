import { GoabButton } from "@abgov/react-components";
import emptyStateIllustration from "../assets/empty-state-illustration.svg";
import "./EmptyState.css";

interface EmptyStateProps {
  onButtonClick?: () => void;
}

export function EmptyState({ onButtonClick }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <img
        src={emptyStateIllustration}
        alt="No results found"
        className="empty-state__illustration"
      />
      <span className="empty-state__heading">No results found</span>
      <span className="empty-state__subline">Try adjusting your search or filters.</span>
      {onButtonClick && (
        <GoabButton type="tertiary" size="compact" onClick={onButtonClick}>
          Clear filters
        </GoabButton>
      )}
    </div>
  );
}
