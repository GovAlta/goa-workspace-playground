import { ReactNode, useCallback } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { GoabButton, GoabText } from "@abgov/react-components";
import { ErrorLayout } from "./ErrorLayout";

interface ErrorBoundaryProps {
  children: ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const handleError = useCallback(
    (error: Error, info: { componentStack?: string | null }) => {
      console.error("ErrorBoundary caught an error:", error, info);
    },
    [],
  );

  return (
    <ReactErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorLayout
          icon="warning"
          label="Application error"
          heading="Something went wrong"
          description="An unexpected error occurred. Please try again or contact support if the problem persists."
          action={
            <>
              {error && (
                <div className="error-page-description">
                  <GoabText size="body-xs" mt="m" mb="none" color="secondary">
                    {error.message}
                  </GoabText>
                </div>
              )}
              <GoabButton
                type="primary"
                size="compact"
                mt="xl"
                onClick={() => resetErrorBoundary()}
              >
                Try again
              </GoabButton>
            </>
          }
        />
      )}
      onError={handleError}
    >
      {children}
    </ReactErrorBoundary>
  );
}
