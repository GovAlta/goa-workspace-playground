import { useState } from "react";
import {
  GoabButtonGroup,
  GoabFormItem,
  GoabMenuAction,
  GoabMenuButton,
  GoabText,
  GoabTextArea,
} from "@abgov/react-components";
import { GoabxButton, GoabxDrawer, GoabxModal } from "@abgov/react-components/experimental";
import {
  GoabInputOnChangeDetail,
} from "@abgov/ui-components-common";
import {
  parseDate,
} from "../utils/dateUtils";
import "./CommentsDrawer.css";

interface Comment {
  id: number;
  author: string;
  timestamp: string;
  text: string;
  isOwned: boolean;
}

interface CommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  onEditComment: (id: number, text: string) => void;
  onDeleteComment: (id: number) => void;
}

export function CommentsDrawer({
  isOpen,
  onClose,
  comments,
  onEditComment,
  onDeleteComment,
}: CommentsDrawerProps) {
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);

  const handleClearComment = () => {
    setCommentText("");
  };

  const handleEditComment = (commentId: number) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      setEditingCommentId(commentId);
      setEditingCommentText(comment.text);
    }
  };

  const handleSaveEditComment = () => {
    if (editingCommentId !== null && editingCommentText.trim()) {
      onEditComment(editingCommentId, editingCommentText);
      setEditingCommentId(null);
      setEditingCommentText("");
    }
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  const handleDeleteComment = (commentId: number) => {
    setDeleteCommentId(commentId);
    setShowDeleteCommentModal(true);
  };

  const confirmDeleteComment = () => {
    if (deleteCommentId !== null) {
      onDeleteComment(deleteCommentId);
    }
    setShowDeleteCommentModal(false);
    setDeleteCommentId(null);
  };

  return (
    <>
      <GoabxDrawer
        maxSize="400"
        position="right"
        open={isOpen}
        onClose={onClose}
        heading={`Comments (${comments.length})`}
      >
        <div className="page__comments">
          {/* Add Comment Section */}
          <div className="page__comments_form">
            <div className="page__comments_form_heading">
              <GoabText size="heading-xs" mt="none" mb="none">
                Add comment
              </GoabText>
              <GoabButtonGroup alignment="end">
                <GoabxButton
                  type="tertiary"
                  size="compact"
                  disabled={commentText.trim().length === 0}
                  onClick={() => handleClearComment()}
                >
                  Clear
                </GoabxButton>
                <GoabxButton
                  type="primary"
                  size="compact"
                  disabled={commentText.trim().length === 0}
                  onClick={() => {
                    console.log('Saving comment:', commentText);
                    handleClearComment();
                  }}
                >
                  Save
                </GoabxButton>
              </GoabButtonGroup>
            </div>
            <GoabFormItem helpText="Add a comment for updates related to the case.">
              <GoabTextArea
                name="comment"
                countBy="character"
                maxCount={200}
                value={commentText}
                onChange={(event: GoabInputOnChangeDetail) => {
                  setCommentText(event.value);
                }}
              />
            </GoabFormItem>
          </div>

          {/* Comments List */}
          <div className="page__comments_list">
            {[...comments].sort((a, b) => {
              const dateA = parseDate(a.timestamp);
              const dateB = parseDate(b.timestamp);
              if (!dateA) return 1;
              if (!dateB) return -1;
              return dateB.getTime() - dateA.getTime();
            }).map((comment) => (
              <div key={comment.id} className="page__comments_single">
                <div className="page__comments_single_heading">
                  <div>
                    <div className="page__comments_single_author">
                      {comment.author}
                    </div>
                    <div className="page__comments_single_date">
                      {comment.timestamp}
                    </div>
                  </div>
                  {comment.isOwned && editingCommentId !== comment.id && (
                    <GoabMenuButton
                      type="tertiary"
                      leadingIcon="ellipsis-vertical:filled"
                      text=""
                      onAction={(e: any) => {
                        const action = (e as any)?.detail?.action || (e as any)?.action || "";
                        if (action === "edit") {
                          handleEditComment(comment.id);
                        } else if (action === "delete") {
                          handleDeleteComment(comment.id);
                        }
                      }}
                    >
                      <GoabMenuAction text="Edit" action="edit" />
                      <GoabMenuAction text="Delete" action="delete" />
                    </GoabMenuButton>
                  )}
                </div>
                <div className="page__comments_single_content">
                  {editingCommentId === comment.id ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--goa-space-s)" }}>
                      <GoabFormItem>
                        <GoabTextArea
                          name={`edit-comment-${comment.id}`}
                          key={`edit-comment-${comment.id}`}
                          value={editingCommentText}
                          countBy="character"
                          onChange={(event: GoabInputOnChangeDetail) => {
                            setEditingCommentText(event.value);
                          }}
                          maxCount={200}
                        />
                      </GoabFormItem>
                      <GoabButtonGroup alignment="end">
                        <GoabxButton type="tertiary" size="compact" onClick={handleCancelEditComment}>
                          Cancel
                        </GoabxButton>
                        <GoabxButton type="primary" size="compact" onClick={handleSaveEditComment}>
                          Save
                        </GoabxButton>
                      </GoabButtonGroup>
                    </div>
                  ) : (
                    <GoabText size="body-s" mb="none" mt="none" color="secondary">
                      {comment.text}
                    </GoabText>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </GoabxDrawer>

      {/* Delete Comment Modal */}
      <GoabxModal
        heading="Delete comment"
        open={showDeleteCommentModal}
        actions={
          <GoabButtonGroup alignment="end">
            <GoabxButton type="secondary" size="compact" onClick={() => setShowDeleteCommentModal(false)}>
              Cancel
            </GoabxButton>
            <GoabxButton
              type="primary"
              size="compact"
              variant="destructive"
              onClick={confirmDeleteComment}
            >
              Delete comment
            </GoabxButton>
          </GoabButtonGroup>
        }
      >
        <GoabText mt="none" mb="none">
          Are you sure you want to delete this comment? This action cannot be undone.
        </GoabText>
      </GoabxModal>
    </>
  );
}
