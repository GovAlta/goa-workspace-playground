import { useState, useEffect } from "react";
import {
  GoabCheckbox,
  GoabDivider,
  GoabIconButton,
  GoabText,
  GoabTooltip,
} from "@abgov/react-components";
import { GoabxFormItem, GoabxInput } from "@abgov/react-components/experimental";
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
          <GoabxFormItem label="First name" mb="l">
            <GoabxInput
              name="firstName"
              value={formData.firstName}
              size="compact"
              onChange={(event: GoabInputOnChangeDetail) => {
                handleInputChange("firstName", event.value);
              }}
            />
          </GoabxFormItem>

          <GoabxFormItem label="Middle name" mb="l">
            <GoabxInput
              name="middleName"
              value={formData.middleName}
              size="compact"
              onChange={(event: GoabInputOnChangeDetail) => {
                handleInputChange("middleName", event.value);
              }}
            />
          </GoabxFormItem>
        </div>

        <GoabxFormItem label="Last name" mb="l">
          <GoabxInput
            name="lastName"
            value={formData.lastName}
            size="compact"
            onChange={(event: GoabInputOnChangeDetail) => {
              handleInputChange("lastName", event.value);
            }}
          />
        </GoabxFormItem>
      </div>

      {/* Identifiers Section */}
      <div>
        <GoabText size="heading-xs" mb="s" mt="3xl" color="secondary">
          Identifiers
        </GoabText>
        <GoabDivider mb="xl" />

        <GoabxFormItem label="Last name on birth certificate" mb="l">
          <GoabxInput
            name="lastNameOnBirthCertificate"
            value={formData.lastNameOnBirthCertificate}
            size="compact"
            onChange={(event: GoabInputOnChangeDetail) => {
              handleInputChange("lastNameOnBirthCertificate", event.value);
            }}
          />
        </GoabxFormItem>

        <GoabxFormItem label="Social Insurance Number (SIN)">
          <div className="case-detail_form_double">
            <GoabxInput
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
                handleInputChange("verification", event.value);
              }}
            />
          </div>
        </GoabxFormItem>

        <div className="case-detail_form_double">
          <GoabxFormItem label="LISA file number (optional)" mb="l">
            <GoabxInput
              name="lisaFileNumber"
              value={formData.lisaFileNumber}
              size="compact"
              onChange={(event: GoabInputOnChangeDetail) => {
                handleInputChange("lisaFileNumber", event.value);
              }}
            />
          </GoabxFormItem>

          <GoabxFormItem label="HS ID (Mobius ID)" mb="l">
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
          </GoabxFormItem>
        </div>

        <GoabxFormItem label="PID" mb="l">
          <GoabxInput
            name="pid"
            value={formData.pid}
            size="compact"
            onChange={(event: GoabInputOnChangeDetail) => {
              handleInputChange("pid", event.value);
            }}
          />
        </GoabxFormItem>
      </div>
    </div>
  );
}
