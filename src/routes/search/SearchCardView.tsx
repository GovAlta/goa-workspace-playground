import React from "react";
import {
  GoabText,
  GoabBlock,
  GoabContainer,
  GoabSkeleton,
  GoabDataGrid,
} from "@abgov/react-components";
import { GoabxButton, GoabxBadge } from "@abgov/react-components/experimental";
import { SearchResult } from "../../types/SearchResult";
import { getTypeBadgeProps } from "../../utils/badgeUtils";

interface SearchCardViewProps {
  results: SearchResult[];
  isLoading: boolean;
  emptyState?: React.ReactNode;
}

export function SearchCardView({ results, isLoading, emptyState }: SearchCardViewProps) {
  return (
    <div className="content-padding">
      <GoabDataGrid keyboardNav="layout" keyboardIconPosition="right">
        {isLoading ? (
          <div className="card-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} data-grid="row">
                <GoabContainer
                  accent="thick"
                  type="non-interactive"
                  padding="compact"
                  mb="none"
                  heading={
                    <div className="data-card__title">
                      <GoabSkeleton type="title" maxWidth="200px" />
                      <GoabSkeleton type="text" maxWidth="80px" />
                    </div>
                  }
                  actions={<GoabSkeleton type="text" maxWidth="40px" />}
                >
                  <div className="data-card__body">
                    <div className="data-card__sections">
                      <div className="data-card__section">
                        <GoabSkeleton type="text-small" maxWidth="100px" />
                        <div className="data-card__section-fields">
                          <GoabSkeleton type="text" maxWidth="80px" />
                          <GoabSkeleton type="text" maxWidth="100px" />
                        </div>
                      </div>
                    </div>
                  </div>
                </GoabContainer>
              </div>
            ))}
          </div>
        ) : results.length === 0 && emptyState ? (
          emptyState
        ) : (
          <div className="card-grid">
            {results.map((result) => (
              <div key={result.id} data-grid="row">
                <GoabContainer
                  accent="thick"
                  type="non-interactive"
                  padding="compact"
                  mb="none"
                  heading={
                    <div className="data-card__title">
                      <GoabText size="heading-xs" mt="none" mb="none" data-grid="cell-1">
                        {result.name}
                      </GoabText>
                      <GoabxBadge
                        data-grid="cell-2"
                        type={result.status}
                        content={result.statusText}
                        emphasis="subtle"
                        icon={true}
                      />
                    </div>
                  }
                  actions={
                    <div data-grid="cell-3">
                      <GoabxButton
                        type="tertiary"
                        size="compact"
                        onClick={() => {
                          // TODO: Navigate to result detail
                        }}
                      >
                        View
                      </GoabxButton>
                    </div>
                  }
                >
                  <div className="data-card__body">
                    <div className="data-card__section-fields">
                      <GoabBlock direction="column" gap="xs" data-grid="cell-4">
                        <span className="data-card__label">Staff</span>
                        <span className="data-card__value">{result.staff || "—"}</span>
                      </GoabBlock>
                      <GoabBlock direction="column" gap="xs" data-grid="cell-5">
                        <span className="data-card__label">Due date</span>
                        <span className="data-card__value">{result.dueDate || "—"}</span>
                      </GoabBlock>
                      <GoabBlock direction="column" gap="xs" data-grid="cell-6">
                        <span className="data-card__label">File number</span>
                        <span className="data-card__value">
                          {result.fileNumber || "—"}
                        </span>
                      </GoabBlock>
                      <GoabBlock direction="column" gap="xs" data-grid="cell-7">
                        <span className="data-card__label">Type</span>
                        <span className="data-card__value">
                          <GoabxBadge
                            {...getTypeBadgeProps(result.type)}
                            emphasis="subtle"
                            icon={true}
                          />
                        </span>
                      </GoabBlock>
                    </div>
                  </div>
                </GoabContainer>
              </div>
            ))}
          </div>
        )}
      </GoabDataGrid>
    </div>
  );
}
