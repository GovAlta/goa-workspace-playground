import { ReactNode, useCallback } from "react";
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from "react-error-boundary";
import { GoabButton, GoabText, GoabIcon } from "@abgov/react-components";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

/**
 * Default fallback component shown when an error occurs.
 * Uses the same styling as ErrorPage for consistency.
 */
function DefaultFallback({ error, resetErrorBoundary }: FallbackProps) {
    return (
        <div className="error-page">
            <div className="error-page-content">
                {/* Icon with circular background */}
                <div className="error-page-icon-wrapper">
                    <GoabIcon type="warning" size="xlarge" />
                </div>

                {/* Error label */}
                <GoabText size="body-m" mt="m" mb="none" color="secondary">
                    Application error
                </GoabText>

                {/* Blue underline */}
                <div className="error-page-underline" />

                {/* Main heading */}
                <GoabText tag="h1" size="heading-l" mt="xl" mb="none">
                    Something went wrong
                </GoabText>

                {/* Description */}
                <GoabText size="body-m" mt="l" mb="none" style={{ maxWidth: '500px', textAlign: 'center' }}>
                    An unexpected error occurred. Please try again or contact support if the problem persists.
                </GoabText>

                {/* Error details (development only) */}
                {error && (
                    <GoabText size="body-xs" mt="m" mb="none" color="secondary" style={{ maxWidth: '500px', textAlign: 'center' }}>
                        {error.message}
                    </GoabText>
                )}

                {/* Action button */}
                <GoabButton type="primary" size="compact" mt="xl" onClick={resetErrorBoundary}>
                    Try again
                </GoabButton>
            </div>
        </div>
    );
}

/**
 * Error Boundary component to catch JavaScript errors in child components.
 * Displays a fallback UI instead of crashing the entire application.
 *
 * Uses react-error-boundary for a modern, hooks-compatible approach.
 */
export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
    const handleError = useCallback((error: Error, info: { componentStack?: string | null }) => {
        console.error("ErrorBoundary caught an error:", error, info);
    }, []);

    return (
        <ReactErrorBoundary
            FallbackComponent={fallback ? () => <>{fallback}</> : DefaultFallback}
            onError={handleError}
        >
            {children}
        </ReactErrorBoundary>
    );
}
