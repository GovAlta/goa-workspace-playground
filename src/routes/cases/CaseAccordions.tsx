import React from "react";
import {
  GoabButton,
  GoabAccordion,
  GoabDivider,
  GoabText,
  GoabIconButton,
  GoabTooltip,
} from "@abgov/react-components";
import { GoabxBadge } from "@abgov/react-components/experimental";
import { PrimaryApplicationForm } from "./PrimaryApplicationForm";
import { Case } from "../../types/Case";

interface PrimaryFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  lastNameOnBirthCertificate: string;
  sin: string;
  sinVerified: boolean;
  verification: boolean;
  albertaHealthNumber: string;
  lisaFileNumber: string;
  hsId: string;
  pid: string;
}

interface Props {
  expandedAll: boolean;
  expandedList: number[];
  expandOrCollapseAll: () => void;
  primaryFormData: PrimaryFormData;
  caseData: Case | null;
  copiedField: string | null;
  onCopy: (value: string, fieldName: string) => void;
}

type BadgeType = "success" | "important" | "information" | "emergency" | "default";

interface BadgeConfig {
  type: BadgeType;
  content: string;
}

const getStatusBadge = (status: string | undefined): BadgeConfig => {
  switch (status) {
    case "complete":
      return { type: "success", content: "Complete" };
    case "missing":
      return { type: "important", content: "Missing information" };
    case "incomplete":
      return { type: "information", content: "Incomplete" };
    case "pending":
      return { type: "information", content: "Pending" };
    case "approved":
      return { type: "success", content: "Approved" };
    case "denied":
      return { type: "important", content: "Denied" };
    case "cancelled":
      return { type: "default", content: "Cancelled" };
    case "not applicable":
      return { type: "default", content: "Not applicable" };
    default:
      return { type: "default", content: "Unknown" };
  }
};

export const CaseAccordions: React.FC<Props> = ({
  expandedAll,
  expandedList,
  expandOrCollapseAll,
  primaryFormData,
  caseData,
  copiedField,
  onCopy,
}) => {
  const accordionStatuses = (caseData?.accordionStatuses as Record<string, string>) || {};
  const primaryApplicantBadge = getStatusBadge(accordionStatuses.primaryApplicant);
  const personalBadge = getStatusBadge(accordionStatuses.personal);
  const spousePartnerBadge = getStatusBadge(accordionStatuses.spousePartner);
  const dependantBadge = getStatusBadge(accordionStatuses.dependant);
  const educationBadge = getStatusBadge(accordionStatuses.education);
  const employmentBadge = getStatusBadge(accordionStatuses.employment);
  const healthBadge = getStatusBadge(accordionStatuses.health);
  const identifiedNeedsBadge = getStatusBadge(accordionStatuses.identifiedNeeds);
  const labourMarketBadge = getStatusBadge(accordionStatuses.labourMarket);
  const decisionBadge = getStatusBadge(accordionStatuses.decision);

  return (
    <>
      <GoabButton type="tertiary" size="compact" mb="m" onClick={expandOrCollapseAll}>
        {expandedAll ? "Hide all sections" : "Show all sections"}
      </GoabButton>

      <GoabAccordion
        open={expandedList.includes(1)}
        headingSize="medium"
        heading="Primary applicant"
        headingContent={<GoabxBadge type={primaryApplicantBadge.type} emphasis="subtle" content={primaryApplicantBadge.content} />}
        mb="m"
      >
        <PrimaryApplicationForm formData={primaryFormData} />
      </GoabAccordion>

      <GoabAccordion                           
        open={expandedList.includes(2)}
        headingSize="medium"
        heading="Personal"
        headingContent={<GoabxBadge type={personalBadge.type} emphasis="subtle" content={personalBadge.content} />}
        mb="m"
      >
        <div>
          <GoabText size="heading-xs" color="secondary" mb="s">
            ID numbers
          </GoabText>
          <GoabDivider mb="xl" />

          <div className="data-card" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <div className="data-card_info">
              <span className="data-card__label">HS ID (Mobius ID)</span>
              <span className="data-card__value case-detail-header__id">
                {(caseData?.hsId as string) || "-"}
                <GoabTooltip content={copiedField === "hsId" ? "Copied" : "Copy"}>
                  <GoabIconButton
                    icon="copy"
                    ariaLabel="Copy HS ID"
                    variant="dark"
                    size="small"
                    onClick={() => onCopy((caseData?.hsId as string), "hsId")}
                  />
                </GoabTooltip>
              </span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">PID</span>
              <span className="data-card__value case-detail-header__id">
                {(caseData?.pid as string) || "-"}
                <GoabTooltip content={copiedField === "pid" ? "Copied" : "Copy"}>
                  <GoabIconButton
                    icon="copy"
                    ariaLabel="Copy PID"
                    variant="dark"
                    size="small"
                    onClick={() => onCopy((caseData?.pid as string), "pid")}
                  />
                </GoabTooltip>
              </span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">SIN</span>
              <span className="data-card__value case-detail-header__id">
                {(caseData?.sin as string) || "-"}
                <GoabTooltip content={copiedField === "sin" ? "Copied" : "Copy"}>
                  <GoabIconButton
                    icon="copy"
                    ariaLabel="Copy SIN"
                    variant="dark"
                    size="small"
                    onClick={() => onCopy((caseData?.sin as string), "sin")}
                  />
                </GoabTooltip>
              </span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Application date</span>
              <span className="data-card__value">
                {(caseData?.applicationDate as string) || "-"}
              </span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Status date</span>
              <span className="data-card__value">
                {(caseData?.statusDate as string) || "-"}
              </span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Assignment date</span>
              <span className="data-card__value">
                {(caseData?.assignmentDate as string) || "-"}
              </span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Due date</span>
              <span className="data-card__value">{"-"}</span>
            </div>
          </div>

          <GoabText size="heading-xs" color="secondary" mb="s" mt="2xl">
            Other
          </GoabText>
          <GoabDivider mb="xl" />

          <div className="data-card" style={{ gridTemplateColumns: "1fr 2fr 0fr" }}>
            <div className="data-card_info">
              <span className="data-card__label">Municipality</span>
              <span className="data-card__value">
                {(caseData?.municipality as string) || "-"}
              </span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Staff note</span>
              <span className="data-card__value">
                {(caseData?.staffNote as string) || "-"}
              </span>
            </div>
          </div>
        </div>
      </GoabAccordion>

      <GoabAccordion
        open={expandedList.includes(3)}
        headingSize="medium"
        heading="Spouse/Partner"
        headingContent={<GoabxBadge type={spousePartnerBadge.type} emphasis="subtle" content={spousePartnerBadge.content} />}
        mb="m"
      >
        <div>
          <GoabText size="heading-xs" color="secondary" mb="s">
            Personal information
          </GoabText>
          <GoabDivider mb="xl" />

          <div className="data-card" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <div className="data-card_info">
              <span className="data-card__label">Full name</span>
              <span className="data-card__value case-detail-header__id">
                {(caseData?.spouseFullName as string) || "-"}
                {caseData?.spouseFullName && (
                <GoabTooltip content={copiedField === "spouseFullName" ? "Copied" : "Copy"}>
                  <GoabIconButton
                    icon="copy"
                    ariaLabel="Copy spouse full name"
                    variant="dark"
                    size="small"
                    onClick={() => onCopy((caseData?.spouseFullName as string), "spouseFullName")}
                  />
                </GoabTooltip>
                )}
              </span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Relationship status</span>
              <span className="data-card__value">{(caseData?.relationshipStatus as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Marriage date</span>
              <span className="data-card__value">{(caseData?.marriageDate as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Contact phone</span>
              <span className="data-card__value">{(caseData?.spouseContactPhone as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Email address</span>
              <span className="data-card__value">{(caseData?.spouseEmail as string) || "-"}</span>
            </div>
          </div>

          <GoabText size="heading-xs" color="secondary" mb="s" mt="2xl">
            ID information
          </GoabText>
          <GoabDivider mb="xl" />

          <div className="data-card" style={{ gridTemplateColumns: "1fr 2fr 0fr" }}>
            <div className="data-card_info">
              <span className="data-card__label">SIN</span>
              <span className="data-card__value case-detail-header__id">
                {(caseData?.spouseSIN as string) || "-"}
                {caseData?.spouseSIN && (
                <GoabTooltip content={copiedField === "spouseSIN" ? "Copied" : "Copy"}>
                  <GoabIconButton
                    icon="copy"
                    ariaLabel="Copy spouse SIN"
                    variant="dark"
                    size="small"
                    onClick={() => onCopy((caseData?.spouseSIN as string), "spouseSIN")}
                  />
                </GoabTooltip>
                )}
              </span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Alberta Health Number</span>
              <span className="data-card__value">
                {(caseData?.spouseAlbertaHealthNumber as string) || "-"}
                {caseData?.spouseAlbertaHealthNumber && (
                    <GoabTooltip content={copiedField === "spouseAlbertaHealthNumber" ? "Copied" : "Copy"}>
                    <GoabIconButton
                        icon="copy"
                        ariaLabel="Copy spouse Alberta Health Number"
                        variant="dark"
                        size="small"
                        onClick={() => onCopy((caseData?.spouseAlbertaHealthNumber as string), "spouseAlbertaHealthNumber")}
                    />
                    </GoabTooltip>
                )}
              </span>
            </div>
          </div>
        </div>
      </GoabAccordion>

      <GoabAccordion
        open={expandedList.includes(4)}
        headingSize="medium"
        heading="Dependant"
        headingContent={<GoabxBadge type={dependantBadge.type} emphasis="subtle" content={dependantBadge.content} />}
        mb="m"
      >
        <div>
          <GoabText size="heading-xs" color="secondary" mb="s">
            Dependant 1
          </GoabText>
          <GoabDivider mb="xl" />

          <div className="data-card" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <div className="data-card_info">
              <span className="data-card__label">Full name</span>
              <span className="data-card__value">{(caseData?.dependent1FullName as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Relationship</span>
              <span className="data-card__value">{(caseData?.dependent1Relationship as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Date of birth</span>
              <span className="data-card__value">{(caseData?.dependent1DateOfBirth as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Age</span>
              <span className="data-card__value">{(caseData?.dependent1Age as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Status</span>
              <span className="data-card__value">{(caseData?.dependent1Status as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">School/Institution</span>
              <span className="data-card__value">{(caseData?.dependent1School as string) || "-"}</span>
            </div>
          </div>

          <GoabText size="heading-xs" color="secondary" mb="s" mt="2xl">
            Dependant 2
          </GoabText>
          <GoabDivider mb="xl" />

          <div className="data-card" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <div className="data-card_info">
              <span className="data-card__label">Full name</span>
              <span className="data-card__value">{(caseData?.dependent2FullName as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Relationship</span>
              <span className="data-card__value">{(caseData?.dependent2Relationship as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Date of birth</span>
              <span className="data-card__value">{(caseData?.dependent2DateOfBirth as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Age</span>
              <span className="data-card__value">{(caseData?.dependent2Age as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Status</span>
              <span className="data-card__value">{(caseData?.dependent2Status as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">School/Institution</span>
              <span className="data-card__value">{(caseData?.dependent2School as string) || "-"}</span>
            </div>
          </div>
        </div>
      </GoabAccordion>

      <GoabAccordion
        open={expandedList.includes(5)}
        headingSize="medium"
        heading="Education"
        headingContent={<GoabxBadge type={educationBadge.type} emphasis="subtle" content={educationBadge.content} />}
        mb="m"
      >
        <div>
          <GoabText size="heading-xs" color="secondary" mb="s">
            Applicant education
          </GoabText>
          <GoabDivider mb="xl" />

          <div className="data-card" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <div className="data-card_info">
              <span className="data-card__label">Highest qualification</span>
              <span className="data-card__value">{(caseData?.highestQualification as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Field of study</span>
              <span className="data-card__value">{(caseData?.fieldOfStudy as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Institution</span>
              <span className="data-card__value">{(caseData?.educationInstitution as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Completion year</span>
              <span className="data-card__value">{(caseData?.educationCompletionYear as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Currently studying</span>
              <span className="data-card__value">{(caseData?.currentlyStudying as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Additional certifications</span>
              <span className="data-card__value">{(caseData?.additionalCertifications as string) || "-"}</span>
            </div>
          </div>
        </div>
      </GoabAccordion>

      <GoabAccordion
        open={expandedList.includes(6)}
        headingSize="medium"
        heading="Employment"
        headingContent={<GoabxBadge type={employmentBadge.type} emphasis="subtle" content={employmentBadge.content} />}
        mb="m"
      >
        <div>
          <GoabText size="heading-xs" color="secondary" mb="s">
            Current employment
          </GoabText>
          <GoabDivider mb="xl" />

          <div className="data-card" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <div className="data-card_info">
              <span className="data-card__label">Employer name</span>
              <span className="data-card__value">{(caseData?.employerName as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Job title</span>
              <span className="data-card__value">{(caseData?.jobTitle as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Employment type</span>
              <span className="data-card__value">{(caseData?.employmentType as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Start date</span>
              <span className="data-card__value">{(caseData?.employmentStartDate as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Annual income</span>
              <span className="data-card__value">{(caseData?.annualIncome as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Work hours per week</span>
              <span className="data-card__value">{(caseData?.workHoursPerWeek as string) || "-"}</span>
            </div>
          </div>

          <GoabText size="heading-xs" color="secondary" mb="s" mt="2xl">
            Employment contact
          </GoabText>
          <GoabDivider mb="xl" />

          <div className="data-card" style={{ gridTemplateColumns: "1fr 2fr 0fr" }}>
            <div className="data-card_info">
              <span className="data-card__label">Work phone</span>
              <span className="data-card__value">{(caseData?.workPhone as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Work email</span>
              <span className="data-card__value">{(caseData?.workEmail as string) || "-"}</span>
            </div>
          </div>
        </div>
      </GoabAccordion>

      <GoabAccordion
        open={expandedList.includes(7)}
        headingSize="medium"
        heading="Health"
        headingContent={<GoabxBadge type={healthBadge.type} emphasis="subtle" content={healthBadge.content} />}
        mb="m"
      >
        <div>
          <GoabText size="heading-xs" color="secondary" mb="s">
            Health information
          </GoabText>
          <GoabDivider mb="xl" />

          <div className="data-card" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <div className="data-card_info">
              <span className="data-card__label">Health coverage status</span>
              <span className="data-card__value">{(caseData?.healthCoverageStatus as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Current health issues</span>
              <span className="data-card__value">{(caseData?.currentHealthIssues as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Disabilities</span>
              <span className="data-card__value">{(caseData?.disabilities as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Medication needs</span>
              <span className="data-card__value">{(caseData?.medicationNeeds as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Family doctor name</span>
              <span className="data-card__value">{(caseData?.familyDoctorName as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Last health exam</span>
              <span className="data-card__value">{(caseData?.lastHealthExam as string) || "-"}</span>
            </div>
          </div>
        </div>
      </GoabAccordion>

      <GoabAccordion
        open={expandedList.includes(8)}
        headingSize="medium"
        heading="Identified needs"
        headingContent={<GoabxBadge type={identifiedNeedsBadge.type} emphasis="subtle" content={identifiedNeedsBadge.content} />}
        mb="m"
      >
        <div>
          <GoabText size="heading-xs" color="secondary" mb="s">
            Identified needs
          </GoabText>
          <GoabDivider mb="xl" />

          <div className="data-card" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <div className="data-card_info">
              <span className="data-card__label">Primary need</span>
              <span className="data-card__value">{(caseData?.primaryNeed as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Secondary need</span>
              <span className="data-card__value">{(caseData?.secondaryNeed as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Child care support</span>
              <span className="data-card__value">{(caseData?.childCareSupport as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Training interests</span>
              <span className="data-card__value">{(caseData?.trainingInterests as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Housing stability</span>
              <span className="data-card__value">{(caseData?.housingStability as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Transportation access</span>
              <span className="data-card__value">{(caseData?.transportationAccess as string) || "-"}</span>
            </div>
          </div>

          <GoabText size="heading-xs" color="secondary" mb="s" mt="2xl">
            Support plan
          </GoabText>
          <GoabDivider mb="xl" />

          <div className="data-card" style={{ gridTemplateColumns: "1fr 2fr 0fr" }}>
            <div className="data-card_info">
              <span className="data-card__label">Case manager</span>
              <span className="data-card__value">{(caseData?.caseManager as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Support plan notes</span>
              <span className="data-card__value">{(caseData?.supportPlanNotes as string) || "-"}</span>
            </div>
          </div>
        </div>
      </GoabAccordion>

      <GoabAccordion
        open={expandedList.includes(9)}
        headingSize="medium"
        heading="Labour market"
        headingContent={<GoabxBadge type={labourMarketBadge.type} emphasis="subtle" content={labourMarketBadge.content} />}
        mb="m"
      >
        <div>
          <GoabText size="heading-xs" color="secondary" mb="s">
            Labour market assessment
          </GoabText>
          <GoabDivider mb="xl" />

          <div className="data-card" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <div className="data-card_info">
              <span className="data-card__label">Job search status</span>
              <span className="data-card__value">{(caseData?.jobSearchStatus as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Career goal</span>
              <span className="data-card__value">{(caseData?.careerGoal as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Industry preference</span>
              <span className="data-card__value">{(caseData?.industryPreference as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Job search length</span>
              <span className="data-card__value">{(caseData?.jobSearchLength as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Interview experience</span>
              <span className="data-card__value">{(caseData?.interviewExperience as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Key skill gaps</span>
              <span className="data-card__value">{(caseData?.keySkillGaps as string) || "-"}</span>
            </div>
          </div>

          <GoabText size="heading-xs" color="secondary" mb="s" mt="2xl">
            Job targeting
          </GoabText>
          <GoabDivider mb="xl" />

          <div className="data-card" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <div className="data-card_info">
              <span className="data-card__label">Target salary range</span>
              <span className="data-card__value">{(caseData?.targetSalaryRange as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Preferred location</span>
              <span className="data-card__value">{(caseData?.preferredLocation as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Remote work preference</span>
              <span className="data-card__value">{(caseData?.remoteWorkPreference as string) || "-"}</span>
            </div>
          </div>
        </div>
      </GoabAccordion>

      <GoabAccordion
        open={expandedList.includes(10)}
        headingSize="medium"
        heading="Decision"
        headingContent={<GoabxBadge type={decisionBadge.type} emphasis="subtle" content={decisionBadge.content} />}
        mb="m"
      >
        <div>
          <GoabText size="heading-xs" color="secondary" mb="s">
            Final decision
          </GoabText>
          <GoabDivider mb="xl" />

          <div className="data-card" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <div className="data-card_info">
              <span className="data-card__label">Decision status</span>
              <span className="data-card__value">
                <GoabxBadge type="default" emphasis="subtle" content={(caseData?.decisionStatus as string) || "Pending"} />
              </span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Decision date</span>
              <span className="data-card__value">{(caseData?.decisionDate as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Approved by</span>
              <span className="data-card__value">{(caseData?.approvedBy as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Approval reference</span>
              <span className="data-card__value">{(caseData?.approvalReference as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Funding approved</span>
              <span className="data-card__value">{(caseData?.fundingApproved as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Approved category</span>
              <span className="data-card__value">{(caseData?.approvedCategory as string) || "-"}</span>
            </div>
          </div>

          <GoabText size="heading-xs" color="secondary" mb="s" mt="2xl">
            Conditions
          </GoabText>
          <GoabDivider mb="xl" />

          <div className="data-card" style={{ gridTemplateColumns: "1fr 2fr 0fr" }}>
            <div className="data-card_info">
              <span className="data-card__label">Number of conditions</span>
              <span className="data-card__value">{(caseData?.numberOfConditions as string) || "-"}</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Decision notes</span>
              <span className="data-card__value">{(caseData?.decisionNotes as string) || "-"}</span>
            </div>
          </div>
        </div>
      </GoabAccordion>
    </>
  );
};
