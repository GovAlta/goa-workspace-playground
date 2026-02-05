import React from "react";
import { GoabButtonGroup, GoabText } from "@abgov/react-components";
import { GoabxModal, GoabxButton } from "@abgov/react-components/experimental";

interface CaseDeleteModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CaseDeleteModal({ open, onConfirm, onCancel }: CaseDeleteModalProps) {
  return (
    <GoabxModal
      heading="Delete case record"
      open={open}
      calloutVariant="emergency"
      actions={
        <GoabButtonGroup alignment="end">
          <GoabxButton type="tertiary" size="compact" onClick={onCancel}>
            Cancel
          </GoabxButton>
          <GoabxButton
            type="primary"
            size="compact"
            variant="destructive"
            onClick={onConfirm}
          >
            Delete
          </GoabxButton>
        </GoabButtonGroup>
      }
    >
      <GoabText mt="none" mb="none">
        Are you sure you want to delete this case record? This action cannot be undone.
      </GoabText>
    </GoabxModal>
  );
}
