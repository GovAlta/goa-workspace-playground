import {GoabText} from "@abgov/react-components";

interface EmptyStateProps {
    message: string;
}

export const EmptyState = ({message}: EmptyStateProps) => (
    <div style={{textAlign: "center", padding: "var(--goa-space-xl)"}}>
        <GoabText size="body-m" color="secondary">{message}</GoabText>
    </div>
);
