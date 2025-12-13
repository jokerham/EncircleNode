import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
} from '@mui/material';
import { FiSend, FiEdit, FiTrash2, FiMessageSquare } from 'react-icons/fi';
import { postApi, type CommentResponse } from '../../../api/postApi';
import { useAuth } from '../../../contexts/authContext';

interface CommentSectionProps {
  postId: string;
  comments: CommentResponse[];
  onCommentAdded: () => void;
}

interface CommentItemProps {
  comment: CommentResponse;
  onReply: (parentId: string) => void;
  onDelete: (commentId: string) => void;
  level?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onReply,
  onDelete,
  level = 0,
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [saving, setSaving] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getAuthorInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const handleSaveEdit = async () => {
    try {
      setSaving(true);
      await postApi.updateComment(comment._id, { content: editContent });
      setIsEditing(false);
      window.location.reload(); // Refresh to show updated comment
    } catch (error) {
      console.error('Error updating comment:', error);
    } finally {
      setSaving(false);
    }
  };

  const isCommentOwner = user?._id === comment.authorId;
  const maxLevel = 3; // Maximum nesting level

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          ml: level * 4,
        }}
      >
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: 'primary.main',
            fontSize: '0.875rem',
          }}
        >
          {comment.author ? getAuthorInitials(comment.author.name) : 'U'}
        </Avatar>

        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {comment.author?.name || 'Unknown User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDate(comment.createdAt)}
            </Typography>
            {comment.createdAt !== comment.updatedAt && (
              <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                (edited)
              </Typography>
            )}
          </Box>

          {isEditing ? (
            <Box sx={{ mt: 1 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                disabled={saving}
              />
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleSaveEdit}
                  disabled={saving || !editContent.trim()}
                >
                  Save
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          ) : (
            <>
              <Typography variant="body2" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>
                {comment.content}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1 }}>
                {level < maxLevel && (
                  <Button
                    size="small"
                    startIcon={<FiMessageSquare size={14} />}
                    onClick={() => onReply(comment._id)}
                    disabled={!user}
                  >
                    Reply
                  </Button>
                )}
                {isCommentOwner && (
                  <>
                    <Button
                      size="small"
                      startIcon={<FiEdit size={14} />}
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<FiTrash2 size={14} />}
                      onClick={() => onDelete(comment._id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* Nested replies */}
      {comment.children && comment.children.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {comment.children.map((reply: CommentResponse) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              onReply={onReply}
              onDelete={onDelete}
              level={level + 1}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  comments,
  onCommentAdded,
}) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;

    try {
      setSubmitting(true);
      setError(null);
      await postApi.createComment({
        postId,
        authorId: user._id,
        content: newComment.trim(),
      });
      setNewComment('');
      onCommentAdded();
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to post comment');
      console.error('Error posting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async () => {
    if (!user || !replyContent.trim() || !replyingTo) return;

    try {
      setSubmitting(true);
      setError(null);
      await postApi.createComment({
        postId,
        authorId: user._id,
        content: replyContent.trim(),
        parentCommentId: replyingTo,
      });
      setReplyContent('');
      setReplyingTo(null);
      onCommentAdded();
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to post reply');
      console.error('Error posting reply:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await postApi.deleteComment(commentId);
      onCommentAdded();
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to delete comment');
      console.error('Error deleting comment:', err);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Comments ({comments.length})
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* New Comment Form */}
      {user ? (
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={submitting}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              endIcon={<FiSend />}
              onClick={handleSubmitComment}
              disabled={submitting || !newComment.trim()}
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </Box>
        </Box>
      ) : (
        <Alert severity="info" sx={{ mb: 4 }}>
          Please sign in to leave a comment.
        </Alert>
      )}

      <Divider sx={{ mb: 3 }} />

      {/* Comments List */}
      {comments.length > 0 ? (
        <Box>
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onReply={setReplyingTo}
              onDelete={handleDeleteComment}
            />
          ))}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
          No comments yet. Be the first to comment!
        </Typography>
      )}

      {/* Reply Modal/Form */}
      {replyingTo && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'background.paper',
            boxShadow: 3,
            p: 3,
            zIndex: 1000,
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Reply to comment
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Write your reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            disabled={submitting}
          />
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleSubmitReply}
              disabled={submitting || !replyContent.trim()}
            >
              {submitting ? 'Posting...' : 'Post Reply'}
            </Button>
            <Button variant="outlined" onClick={() => setReplyingTo(null)} disabled={submitting}>
              Cancel
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
};