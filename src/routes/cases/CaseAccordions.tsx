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

interface Props {
  expandedAll: boolean;
  expandedList: number[];
  expandOrCollapseAll: () => void;
  primaryFormData: any;
  caseData: Case | null;
  copiedField: string | null;
  onCopy: (value: string, fieldName: string) => void;
}

export const CaseAccordions: React.FC<Props> = ({
  expandedAll,
  expandedList,
  expandOrCollapseAll,
  primaryFormData,
  caseData,
  copiedField,
  onCopy,
}) => {

  return (
    <>
      <GoabButton type="tertiary" size="compact" mb="m" onClick={expandOrCollapseAll}>
        {expandedAll ? "Hide all sections" : "Show all sections"}
      </GoabButton>

      <GoabAccordion
        open={expandedList.includes(1)}
        headingSize="medium"
        heading="Primary applicant"
        headingContent={<GoabxBadge type="success" emphasis="subtle" content="Complete" />}
        mb="m"
      >
        <PrimaryApplicationForm formData={primaryFormData} />
      </GoabAccordion>

      <GoabAccordion                           
        open={expandedList.includes(2)}
        headingSize="medium"
        heading="Personal"
        headingContent={<GoabxBadge type="important" emphasis="subtle" content="Missing information" />}
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
        headingContent={<GoabxBadge type="important" emphasis="subtle" content="Missing information" />}
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
                {"Sarah M. Johnson"}
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
              <span className="data-card__label">Relationship status</span>
              <span className="data-card__value">Married</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Marriage date</span>
              <span className="data-card__value">June 15, 2018</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Contact phone</span>
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Email address</span>
              <span className="data-card__value">-</span>
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
                {"654 321 987"}
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
              <span className="data-card__label">Alberta Health Number</span>
              <span className="data-card__value">
                {"4402 98234 AB"}
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
          </div>
        </div>
      </GoabAccordion>

      <GoabAccordion
        open={expandedList.includes(4)}
        headingSize="medium"
        heading="Dependant"
        headingContent={<GoabxBadge type="important" emphasis="subtle" content="Missing information" />}
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
              <span className="data-card__value">Emily Johnson</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Relationship</span>
              <span className="data-card__value">Child</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Date of birth</span>
              <span className="data-card__value">March 22, 2015</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Age</span>
              <span className="data-card__value">8 years</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Status</span>
              <span className="data-card__value">Active</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">School/Institution</span>
              <span className="data-card__value">Lincoln Park Elementary</span>
            </div>
          </div>

          <GoabText size="heading-xs" color="secondary" mb="s" mt="2xl">
            Dependant 2
          </GoabText>
          <GoabDivider mb="xl" />

          <div className="data-card" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <div className="data-card_info">
              <span className="data-card__label">Full name</span>
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Relationship</span>
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Date of birth</span>
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Age</span>
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Status</span>
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">School/Institution</span>
              <span className="data-card__value">-</span>
            </div>
          </div>
        </div>
      </GoabAccordion>

      <GoabAccordion
        open={expandedList.includes(5)}
        headingSize="medium"
        heading="Education"
        headingContent={<GoabxBadge type="important" emphasis="subtle" content="Missing information" />}
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
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Field of study</span>
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Institution</span>
              <span className="data-card__value">University of Alberta</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Completion year</span>
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Currently studying</span>
              <span className="data-card__value">No</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Additional certifications</span>
              <span className="data-card__value">-</span>
            </div>
          </div>
        </div>
      </GoabAccordion>

      <GoabAccordion
        open={expandedList.includes(6)}
        headingSize="medium"
        heading="Employment"
        headingContent={<GoabxBadge type="important" emphasis="subtle" content="Missing information" />}
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
              <span className="data-card__value">Acme Corp Inc.</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Job title</span>
              <span className="data-card__value">Project Manager</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Employment type</span>
              <span className="data-card__value">Full-time</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Start date</span>
              <span className="data-card__value">January 15, 2020</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Annual income</span>
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Work hours per week</span>
              <span className="data-card__value">-</span>
            </div>
          </div>

          <GoabText size="heading-xs" color="secondary" mb="s" mt="2xl">
            Employment contact
          </GoabText>
          <GoabDivider mb="xl" />

          <div className="data-card" style={{ gridTemplateColumns: "1fr 2fr 0fr" }}>
            <div className="data-card_info">
              <span className="data-card__label">Work phone</span>
              <span className="data-card__value">(403) 555-0189</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Work email</span>
              <span className="data-card__value">m.johnson@acmecorp.com</span>
            </div>
          </div>
        </div>
      </GoabAccordion>

      <GoabAccordion
        open={expandedList.includes(7)}
        headingSize="medium"
        heading="Health"
        headingContent={<GoabxBadge type="default" emphasis="subtle" content="Not started" />}
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
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Current health issues</span>
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Disabilities</span>
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Medication needs</span>
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Family doctor name</span>
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Last health exam</span>
              <span className="data-card__value">-</span>
            </div>
          </div>
        </div>
      </GoabAccordion>

      <GoabAccordion
        open={expandedList.includes(8)}
        headingSize="medium"
        heading="Identified needs"
        headingContent={<GoabxBadge type="default" emphasis="subtle" content="Not started" />}
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
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Secondary need</span>
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Child care support</span>
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Training interests</span>
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Housing stability</span>
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Transportation access</span>
              <span className="data-card__value">-</span>
            </div>
          </div>

          <GoabText size="heading-xs" color="secondary" mb="s" mt="2xl">
            Support plan
          </GoabText>
          <GoabDivider mb="xl" />

          <div className="data-card" style={{ gridTemplateColumns: "1fr 2fr 0fr" }}>
            <div className="data-card_info">
              <span className="data-card__label">Case manager</span>
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Support plan notes</span>
              <span className="data-card__value">-</span>
            </div>
          </div>
        </div>
      </GoabAccordion>

      <GoabAccordion
        open={expandedList.includes(9)}
        headingSize="medium"
        heading="Labour market"
        headingContent={<GoabxBadge type="default" emphasis="subtle" content="Not started" />}
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
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Career goal</span>
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Industry preference</span>
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Job search length</span>
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Interview experience</span>
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Key skill gaps</span>
              <span className="data-card__value">-</span>
            </div>
          </div>

          <GoabText size="heading-xs" color="secondary" mb="s" mt="2xl">
            Job targeting
          </GoabText>
          <GoabDivider mb="xl" />

          <div className="data-card" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <div className="data-card_info">
              <span className="data-card__label">Target salary range</span>
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Preferred location</span>
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Remote work preference</span>
              <span className="data-card__value">-</span>
            </div>
          </div>
        </div>
      </GoabAccordion>

      <GoabAccordion
        open={expandedList.includes(10)}
        headingSize="medium"
        heading="Decision"
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
                <GoabxBadge type="default" emphasis="subtle" content="Pending" />
              </span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Decision date</span>
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Approved by</span>
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Approval reference</span>
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Funding approved</span>
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Approved category</span>
              <span className="data-card__value">-</span>
            </div>
          </div>

          <GoabText size="heading-xs" color="secondary" mb="s" mt="2xl">
            Conditions
          </GoabText>
          <GoabDivider mb="xl" />

          <div className="data-card" style={{ gridTemplateColumns: "1fr 2fr 0fr" }}>
            <div className="data-card_info">
              <span className="data-card__label">Number of conditions</span>
              <span className="data-card__value">-</span>
            </div>

            <div className="data-card_info">
              <span className="data-card__label">Decision notes</span>
              <span className="data-card__value">-</span>
            </div>
          </div>
        </div>
      </GoabAccordion>
    </>
  );
};

export default CaseAccordions;
