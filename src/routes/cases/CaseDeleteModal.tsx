import React from "react";
import {
  GoabModal,
  GoabButtonGroup,
  GoabButton,
  GoabText,
} from "@abgov/react-components";

interface CaseDeleteModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CaseDeleteModal({ open, onConfirm, onCancel }: CaseDeleteModalProps) {
  return (
    <GoabModal
      heading="Delete case record"
      open={open}
      calloutVariant="emergency"
      actions={
        <GoabButtonGroup alignment="end">
          <GoabButton type="tertiary" size="compact" onClick={onCancel}>
            Cancel
          </GoabButton>
          <GoabButton
            type="primary"
            size="compact"
            variant="destructive"
            onClick={onConfirm}
          >
            Delete
          </GoabButton>
        </GoabButtonGroup>
      }
    >
      <GoabText mt="none" mb="none">
        Are you sure you want to delete this case record? This action cannot be undone.
      </GoabText>
    </GoabModal>
  );
}
