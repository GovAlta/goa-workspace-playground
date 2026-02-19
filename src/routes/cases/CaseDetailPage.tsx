import { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  GoabMenuAction,
  GoabMenuButton,
  GoabSkeleton,
  GoabSpacer,
  GoabTab,
  GoabText,
} from "@abgov/react-components";
import { GoabxBadge, GoabxButton, GoabxTabs } from "@abgov/react-components/experimental";
import { PageHeader } from "../../components/PageHeader";
import { CommentsDrawer } from "../../components/CommentsDrawer";
import { CaseDetailHeader } from "./CaseDetailHeader";
import { CaseAccordions } from "./CaseAccordions";
import {
  GoabMenuButtonOnActionDetail,
} from "@abgov/ui-components-common";
import { useWorkspaceMenuState } from "../../hooks/useWorkspaceMenuState";
import emptySystemStateIcon from "../../assets/empty-system-state-no-results.svg";
import mockCases from "../../data/mockCases.json";
import mockComments from "../../data/mockComments.json";
import { mockFetch } from "../../utils/mockApi";
import { Case } from "../../types/Case";
import './CaseDetailPage.css';

export function CaseDetailPage() {
  
  const { id } = useParams<{ id: string }>();
  const { isMobile } = useWorkspaceMenuState();
  const [isLoading, setIsLoading] = useState(true);
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isCommentsDrawerOpen, setIsCommentsDrawerOpen] = useState(false);
  const [expandedAll, setExpandedAll] = useState<boolean>(false);
  const [expandedList, setExpandedList] = useState<number[]>([]);
  const [activeTabIndex, setActiveTabIndex] = useState<number>(1);

  const [comments, setComments] = useState<Array<{
    id: number;
    author: string;
    timestamp: string;
    text: string;
    isOwned: boolean;
  }>>(mockComments as Array<{
    id: number;
    author: string;
    timestamp: string;
    text: string;
    isOwned: boolean;
  }>);

  useEffect(() => {
    setExpandedAll(expandedList.length === 10);
  }, [expandedList.length]);

  const expandOrCollapseAll = () => {
    setExpandedAll((prev) => {
      const newState = !prev;
      setExpandedList(newState ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] : []);
      return newState;
    });
  };

  useEffect(() => {
    const fetchCaseData = async () => {
      setIsLoading(true);
      const foundCase = (mockCases as Case[]).find((c) => c.id === id);
      const data = await mockFetch<Case>(foundCase as Case);
      setCaseData(data);
      setIsLoading(false);
    };
    fetchCaseData();
  }, [id]);

  const handleAssignClick = () => {
    console.log("Assign button clicked");
  };

  const handleCommentsClick = () => {
    setIsCommentsDrawerOpen(true);
  };

  const handleEditComment = (id: number, text: string) => {
    setComments(comments.map(c => 
      c.id === id ? { ...c, text } : c
    ));
  };

  const handleDeleteComment = (id: number) => {
    setComments(comments.filter(c => c.id !== id));
  };

  const handleCopy = (value: string, fieldName: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 1000);
    });
  };

  if (!caseData && !isLoading) {
    return <div>Case not found</div>;
  }

  // Memoize formData to prevent accordion collapse when form inputs change
  const primaryFormData = useMemo(() => ({
    firstName: (caseData?.firstName as string) || "",
    middleName: (caseData?.middleName as string) || "",
    lastName: (caseData?.lastName as string) || "",
    lastNameOnBirthCertificate: (caseData?.lastNameOnBirthCertificate as string) || "",
    sin: (caseData?.sin as string) || "",
    sinVerified: (caseData?.sinVerified as boolean) || false,
    verification: (caseData?.verification as boolean) || false,
    albertaHealthNumber: (caseData?.albertaHealthNumber as string) || "",
    lisaFileNumber: (caseData?.lisaFileNumber as string) || "",
    hsId: (caseData?.hsId as string) || "",
    pid: (caseData?.pid as string) || "",
  }), [caseData]);

  const headerActions = useMemo(
    () => (
      <>
        <GoabMenuButton
            type="tertiary"
            text="Assign"
            onAction={(e: GoabMenuButtonOnActionDetail) => handleAssignClick()}
        >
            <GoabMenuAction text="Assign to me" action="assign-me" />
            <GoabMenuAction text="Assign to team" action="assign-team" />
            <GoabMenuAction text="Unassign" action="unassign" />
        </GoabMenuButton>

        <GoabxButton
            type="tertiary"
            size="compact"
            onClick={handleCommentsClick}
            leadingIcon="chatbubble"
        >
            Comments ({comments.length})
        </GoabxButton>
      </>
    ),
    [comments.length],
  );

  const SkeletonAccordion = () => (
    <div style={{
      marginBottom: "var(--goa-space-m)",
      padding: "0 var(--goa-space-m)",
      border: "var(--goa-accordion-border)",
      borderRadius: "var(--goa-accordion-border-radius)",
      display: "flex",
      alignItems:"center",
      gap: "1rem"
    }}>
      <div style={{ minWidth: "50px" }}>
        <GoabSkeleton type="thumbnail" mb="none" mt="none"/>
      </div>
      <div style={{ minWidth: "150px" }}>
        <GoabSkeleton type="text" maxWidth="150px" mb="none" mt="none" />
      </div>
      <div style={{ minWidth: "75px" }}>
        <GoabSkeleton type="text" maxWidth="75px" mb="none" mt="none" />
      </div>
    </div>
  );

  const handleTabsChange = (event: any) => {
    const tabIndex = event.detail?.tab || event.tab;
    setActiveTabIndex(tabIndex);
  };

  return (
    <>
      <div className="case-detail__page_template">

        <PageHeader
          title={caseData?.name || "Cases"}
          actions={<CaseDetailHeader isLoading={isLoading} />}
          toolbar={headerActions}
        />

        <CommentsDrawer
          isOpen={isCommentsDrawerOpen}
          onClose={() => setIsCommentsDrawerOpen(false)}
          comments={comments}
          onEditComment={handleEditComment}
          onDeleteComment={handleDeleteComment}
        />

        <div className="case-detail__page_content">
          <GoabxTabs
            initialTab={1}
            variant={!isMobile ? "segmented" : "default"}
            onChange={handleTabsChange}
          >
            <GoabTab heading={"Current application"} />
            <GoabTab heading={<>Previous assessments<GoabxBadge type="archived" emphasis="subtle" content="0"/></>} />
          </GoabxTabs>

          {isMobile && <GoabSpacer vSpacing="l" />}

          {isLoading ? (
            <div>
              <SkeletonAccordion />
              <SkeletonAccordion />
              <SkeletonAccordion />
              <SkeletonAccordion />
              <SkeletonAccordion />
              <SkeletonAccordion />
              <SkeletonAccordion />
              <SkeletonAccordion />
              <SkeletonAccordion />
            </div>
          ) : (
            activeTabIndex === 1 ? (
              <CaseAccordions
                expandedAll={expandedAll}
                expandedList={expandedList}
                expandOrCollapseAll={expandOrCollapseAll}
                primaryFormData={primaryFormData}
                caseData={caseData}
                copiedField={copiedField}
                onCopy={handleCopy}
              />
            ) : (
              <>
                <div className="case-detail__page_empty_state">
                  <img src={emptySystemStateIcon} alt="No previous assessments" />
                  <GoabText size="body-s" mt="none">
                    No previous assessments
                  </GoabText>
                </div>
              </>
          ))}
        </div>
      </div>
    </>
  );
}
