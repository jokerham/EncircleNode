import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { postApi, type CreateBoardPayload, type UpdateBoardPayload } from "../../../../api/postApi";
import { showToast } from "../../../../functions/showToast";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../../../../contexts/authContext";

// Types from postApi.ts
interface Author {
  _id: string;
  name: string;
  email: string;
}

interface BoardResponse {
  _id: string;
  title: string;
  description?: string;
  slug: string;
  authorId: Author;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const BoardEdit: React.FC = () => {
  const auth = useAuth();
  const { identifier } = useParams<{ identifier: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(identifier);

  // Get current user ID - replace with your auth context/state
  const currentUserId = auth.user?._id || "";

  const [board, setBoard] = useState<BoardResponse | null>(null);
  const [pageLoading, setPageLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slug: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({
    title: "",
    slug: "",
  });

  const [submitLoading, setSubmitLoading] = useState(false);

  // Load board data if in edit mode
  useEffect(() => {
    if (identifier) {
      loadBoard(identifier);
    }
  }, [identifier]);

  const loadBoard = async (boardSlug: string) => {
    try {
      setPageLoading(true);
      const response = await postApi.getBoardBySlug(boardSlug);
      setBoard(response);
      
      // Populate form with board data
      setFormData({
        title: response.title,
        description: response.description || "",
        slug: response.slug,
        isActive: response.isActive,
      });
    } catch (err) {
      console.error("Error loading board:", err);
      showToast("Failed to load board", "error");
      navigate("/"); // Redirect to boards list
    } finally {
      setPageLoading(false);
    }
  };

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      // Only auto-generate slug in create mode or if slug is empty
      slug: !isEditMode || !prev.slug ? generateSlug(newTitle) : prev.slug,
    }));
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: "" }));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSlug = e.target.value;
    setFormData((prev) => ({ ...prev, slug: newSlug }));
    if (errors.slug) {
      setErrors((prev) => ({ ...prev, slug: "" }));
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, description: e.target.value }));
  };

  const handleIsActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, isActive: e.target.checked }));
  };

  const validate = (): boolean => {
    const newErrors = { title: "", slug: "" };
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
      isValid = false;
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = "Slug can only contain lowercase letters, numbers, and hyphens";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitLoading(true);

    try {
      if (isEditMode && board) {
        // Edit existing board
        const payload: UpdateBoardPayload = {
          title: formData.title,
          description: formData.description || undefined,
          slug: formData.slug,
          isActive: formData.isActive,
        };

        await postApi.updateBoard(board._id, payload);
        showToast("Board updated successfully", "success");
      } else {
        // Create new board
        const payload: CreateBoardPayload = {
          title: formData.title,
          description: formData.description || undefined,
          slug: formData.slug,
          authorId: currentUserId,
        };

        await postApi.createBoard(payload);
        showToast("Board created successfully", "success");
      }

      // Redirect to boards list after success
      navigate("/boards");
    } catch (err: unknown) {
      console.error("Error saving board:", err);
      const errorMessage =
        (err && typeof err === 'object' && 'response' in err && 
         err.response && typeof err.response === 'object' && 'data' in err.response &&
         err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data
         ? err.response.data.message : null) ||
        `Failed to ${isEditMode ? "update" : "create"} board`;
      showToast(errorMessage as string, "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/boards");
  };

  // Show loading spinner while fetching board data
  if (pageLoading) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          {isEditMode ? "Edit Board" : "Create New Board"}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Title Field */}
            <TextField
              label="Title"
              value={formData.title}
              onChange={handleTitleChange}
              error={Boolean(errors.title)}
              helperText={errors.title}
              fullWidth
              required
              autoFocus
              disabled={submitLoading}
            />

            {/* Slug Field */}
            <TextField
              label="Slug"
              value={formData.slug}
              onChange={handleSlugChange}
              error={Boolean(errors.slug)}
              helperText={
                errors.slug ||
                "URL-friendly identifier (lowercase, numbers, hyphens only)"
              }
              fullWidth
              required
              disabled={submitLoading}
            />

            {/* Description Field */}
            <TextField
              label="Description"
              value={formData.description}
              onChange={handleDescriptionChange}
              fullWidth
              multiline
              rows={4}
              disabled={submitLoading}
              helperText="Optional description for the board"
            />

            {/* Active Status Switch (only in edit mode) */}
            {isEditMode && (
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={handleIsActiveChange}
                    disabled={submitLoading}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Active Status
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formData.isActive
                        ? "Board is currently active"
                        : "Board is currently inactive"}
                    </Typography>
                  </Box>
                }
              />
            )}

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end", pt: 2 }}>
              <Button
                onClick={handleCancel}
                disabled={submitLoading}
                color="inherit"
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitLoading}
                startIcon={submitLoading ? <CircularProgress size={16} /> : null}
              >
                {submitLoading
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update Board"
                  : "Create Board"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default BoardEdit;