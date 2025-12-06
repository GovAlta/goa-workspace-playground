import emptyStateIllustration from "../assets/empty-state-illustration.svg";

interface EmptyStateProps {
    heading: string;
    subline: string;
}

export const EmptyState = ({heading, subline}: EmptyStateProps) => (
    <div className="notification-empty-state">
        <img src={emptyStateIllustration} alt="" className="notification-empty-state__illustration" />
        <span className="notification-empty-state__heading">{heading}</span>
        <span className="notification-empty-state__subline">{subline}</span>
    </div>
);
