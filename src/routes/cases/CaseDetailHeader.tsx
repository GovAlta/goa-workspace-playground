import { useState } from "react";
import {
  GoabIconButton,
  GoabText,
  GoabSkeleton,
  GoabTooltip,
} from "@abgov/react-components";
import { GoabxBadge } from "@abgov/react-components/experimental";
import { GoabBadgeEmphasis, GoabxBadgeType } from "@abgov/ui-components-common";

interface CaseDetailHeaderProps {
  phoneNumber?: string;
  statuses?: Array<{
    label: string;
    type?: GoabxBadgeType;
    emphasis?: GoabBadgeEmphasis;
  }>;
  isLoading?: boolean;
}

export function CaseDetailHeader({
  phoneNumber = "456 789 0123",
  statuses = [
    { label: "Overdue", type: "emergency" },
    { label: "Approach with caution", type: "important" },
  ],
  isLoading = false,
}: CaseDetailHeaderProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (value: string, fieldName: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 1000);
    });
  };

  return (
    <>
      <div className="case-detail-header__tombstone">
        {/* Status Badges */}
        <div className="case-detail-header__badges">
          {isLoading ? (
            <div
              style={{ display: "flex", gap: "var(--goa-space-s)", alignItems: "center" }}
            >
              <div style={{ minWidth: "70px" }}>
                <GoabSkeleton type="text" maxWidth="70px" />
              </div>
              <div style={{ minWidth: "70px" }}>
                <GoabSkeleton type="text" maxWidth="70px" />
              </div>
            </div>
          ) : (
            statuses.map((status, index) => (
              <GoabxBadge
                key={index}
                content={status.label}
                type={status.type as GoabxBadgeType}
                emphasis={status.emphasis as GoabBadgeEmphasis}
              />
            ))
          )}
        </div>

        {/* Phone Number Section */}
        <div className="case-detail-header__id">
          {isLoading ? (
            <div style={{ minWidth: "140px" }}>
              <GoabSkeleton type="text" maxWidth="140px" />
            </div>
          ) : (
            <>
              <GoabText mb="none" mt="none">
                {phoneNumber}
              </GoabText>
              <GoabTooltip content={copiedField === "phoneNumber" ? "Copied" : "Copy"}>
                <GoabIconButton
                  icon="copy"
                  ariaLabel="Copy Phone Number"
                  variant="dark"
                  size="small"
                  onClick={() => handleCopy(phoneNumber, "phoneNumber")}
                />
              </GoabTooltip>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
    </>
  );
}
