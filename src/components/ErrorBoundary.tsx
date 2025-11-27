import { ReactNode, useState, useCallback } from "react";
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from "react-error-boundary";
import { GoabButton, GoabText, GoabBlock } from "@abgov/react-components";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

/**
 * Default fallback component shown when an error occurs.
 */
function DefaultFallback({ error, resetErrorBoundary }: FallbackProps) {
    return (
        <GoabBlock gap="l" mt="3xl" mb="3xl" alignment="center">
            <GoabText tag="h2" size="heading-m">
                Something went wrong
            </GoabText>
            <GoabText>
                An unexpected error occurred. Please try again or contact support if the problem persists.
            </GoabText>
            {error && (
                <GoabText size="body-s" mt="m">
                    Error: {error.message}
                </GoabText>
            )}
            <GoabButton type="primary" onClick={resetErrorBoundary}>
                Try again
            </GoabButton>
        </GoabBlock>
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
