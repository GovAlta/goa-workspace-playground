import { useState, useEffect } from "react";
import {
  GoabCheckbox,
  GoabDivider,
  GoabIconButton,
  GoabText,
  GoabTooltip,
  GoabFormItem,
  GoabInput,
} from "@abgov/react-components";
import {
  GoabInputOnChangeDetail,
  GoabCheckboxOnChangeDetail,
} from "@abgov/ui-components-common";
import { PrimaryFormData } from "../../types/PrimaryFormData";

interface PrimaryApplicationFormProps {
  formData?: PrimaryFormData;
}

export function PrimaryApplicationForm({
  formData: initialFormData,
}: PrimaryApplicationFormProps) {
  const [formData, setFormData] = useState<PrimaryFormData>(
    initialFormData || ({} as PrimaryFormData),
  );
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (initialFormData) {
      setFormData(initialFormData);
    }
  }, [initialFormData]);

  const handleInputChange = (field: keyof PrimaryFormData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCopy = (value: string, fieldName: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 1000);
    });
  };

  return (
    <div>
      {/* Name Section */}
      <div>
        <GoabText size="heading-xs" mb="s" mt="l" color="secondary">
          Name
        </GoabText>

        <GoabDivider mb="xl" />

        <div className="case-detail_form_double">
          <GoabFormItem label="First name" mb="l">
            <GoabInput
              name="firstName"
              value={formData.firstName}
              size="compact"
              onChange={(event: GoabInputOnChangeDetail) => {
                handleInputChange("firstName", event.value);
              }}
            />
          </GoabFormItem>

          <GoabFormItem label="Middle name" mb="l">
            <GoabInput
              name="middleName"
              value={formData.middleName}
              size="compact"
              onChange={(event: GoabInputOnChangeDetail) => {
                handleInputChange("middleName", event.value);
              }}
            />
          </GoabFormItem>
        </div>

        <GoabFormItem label="Last name" mb="l">
          <GoabInput
            name="lastName"
            value={formData.lastName}
            size="compact"
            onChange={(event: GoabInputOnChangeDetail) => {
              handleInputChange("lastName", event.value);
            }}
          />
        </GoabFormItem>
      </div>

      {/* Identifiers Section */}
      <div>
        <GoabText size="heading-xs" mb="s" mt="3xl" color="secondary">
          Identifiers
        </GoabText>
        <GoabDivider mb="xl" />

        <GoabFormItem label="Last name on birth certificate" mb="l">
          <GoabInput
            name="lastNameOnBirthCertificate"
            value={formData.lastNameOnBirthCertificate}
            size="compact"
            onChange={(event: GoabInputOnChangeDetail) => {
              handleInputChange("lastNameOnBirthCertificate", event.value);
            }}
          />
        </GoabFormItem>

        <GoabFormItem label="Social Insurance Number (SIN)">
          <div className="case-detail_form_double">
            <GoabInput
              name="sin"
              value={formData.sin}
              size="compact"
              mb="l"
              onChange={(event: GoabInputOnChangeDetail) => {
                handleInputChange("sin", event.value);
              }}
            />
            <GoabCheckbox
              mb="l"
              name="verification"
              text="Verified"
              onChange={(event: GoabCheckboxOnChangeDetail) => {
                handleInputChange("verification", event.value || "");
              }}
            />
          </div>
        </GoabFormItem>

        <div className="case-detail_form_double">
          <GoabFormItem label="LISA file number (optional)" mb="l">
            <GoabInput
              name="lisaFileNumber"
              value={formData.lisaFileNumber}
              size="compact"
              onChange={(event: GoabInputOnChangeDetail) => {
                handleInputChange("lisaFileNumber", event.value);
              }}
            />
          </GoabFormItem>

          <GoabFormItem label="HS ID (Mobius ID)" mb="l">
            <div style={{ display: "flex", alignItems: "center" }}>
              <GoabText mb="none" mt="none">
                {formData.hsId}
              </GoabText>
              <GoabTooltip content={copiedField === "hsId" ? "Copied" : "Copy"}>
                <GoabIconButton
                  icon="copy"
                  ariaLabel="Copy HS ID"
                  variant="dark"
                  size="small"
                  onClick={() => handleCopy(formData.hsId, "hsId")}
                />
              </GoabTooltip>
            </div>
          </GoabFormItem>
        </div>

        <GoabFormItem label="PID" mb="l">
          <GoabInput
            name="pid"
            value={formData.pid}
            size="compact"
            onChange={(event: GoabInputOnChangeDetail) => {
              handleInputChange("pid", event.value);
            }}
          />
        </GoabFormItem>
      </div>
    </div>
  );
}
