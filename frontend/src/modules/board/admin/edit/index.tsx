import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { postApi, type CreateBoardPayload, type UpdateBoardPayload } from "../../../../api/postApi";
import { showToast } from "../../../../functions/showToast";
import * as Yup from "yup";

import {
  Box,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { useAuth } from "../../../../contexts/authContext";
import FormBuilder, { type FormConfig } from "../../../../components/formBuilder";
 
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

interface BoardFormValues {
  title: string;
  description: string;
  slug: string;
  isActive: boolean;
}

const BoardEdit: React.FC = () => {
  const auth = useAuth();
  const { identifier } = useParams<{ identifier: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(identifier);

  // Get current user ID
  const currentUserId = auth.user?._id || "";

  const [board, setBoard] = useState<BoardResponse | null>(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [formReady, setFormReady] = useState(false);
  const [initialValues, setInitialValues] = useState<BoardFormValues>({
    title: "",
    description: "",
    slug: "",
    isActive: true,
  });

  // Load board data if in edit mode
  useEffect(() => {
    if (identifier) {
      loadBoard(identifier);
    } else {
      // In create mode, form is ready immediately
      setFormReady(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identifier]);

  const loadBoard = async (boardSlug: string) => {
    try {
      setPageLoading(true);
      const response = await postApi.getBoardBySlug(boardSlug);
      setBoard(response);
      
      // Populate form with board data
      setInitialValues({
        title: response.title,
        description: response.description || "",
        slug: response.slug,
        isActive: response.isActive,
      });
      
      // Mark form as ready after data is loaded
      setFormReady(true);
    } catch (err) {
      console.error("Error loading board:", err);
      showToast("Failed to load board", "error");
      navigate("/admin"); // Redirect to boards list
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

  // Validation schema
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .trim()
      .required("Title is required"),
    slug: Yup.string()
      .trim()
      .required("Slug is required")
      .matches(
        /^[a-z0-9-]+$/,
        "Slug can only contain lowercase letters, numbers, and hyphens"
      ),
    description: Yup.string(),
    isActive: Yup.boolean(),
  });

  // Handle form submission
  const handleSubmit = async (
    values: Record<string, unknown>,
    formikHelpers: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    const boardValues = values as unknown as BoardFormValues;
    try {
      if (isEditMode && board) {
        // Edit existing board
        const payload: UpdateBoardPayload = {
          title: boardValues.title,
          description: boardValues.description || undefined,
          slug: boardValues.slug,
          isActive: boardValues.isActive,
        };

        await postApi.updateBoard(board._id, payload);
        showToast("Board updated successfully", "success");
      } else {
        // Create new board
        const payload: CreateBoardPayload = {
          title: boardValues.title,
          description: boardValues.description || undefined,
          slug: boardValues.slug,
          authorId: currentUserId,
        };

        await postApi.createBoard(payload);
        showToast("Board created successfully", "success");
      }

      // Redirect to boards list after success
      navigate("/admin/board/list");
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
      formikHelpers.setSubmitting(false);
    }
  };

  // Form configuration
  const formConfig: FormConfig = {
    fields: [
      {
        name: "title",
        label: "Title",
        type: "text",
        required: true,
        placeholder: "Enter board title",
        onChange: (value, formikProps) => {
          // Auto-generate slug from title
          const currentSlug = formikProps.values.slug as string;
          // Only auto-generate slug in create mode or if slug is empty
          if (!isEditMode || !currentSlug) {
            formikProps.setFieldValue("slug", generateSlug(value as string));
          }
        },
      },
      {
        name: "slug",
        label: "Slug",
        type: "text",
        required: true,
        placeholder: "board-url-slug",
      },
      {
        name: "description",
        label: "Description",
        type: "text",
        multiline: true,
        rows: 4,
        placeholder: "Optional description for the board",
      },
      // Only show isActive in edit mode
      ...(isEditMode
        ? [
            {
              name: "isActive",
              label: "Active Status (Board is currently active/inactive)",
              type: "checkbox" as const,
            },
          ]
        : []),
    ],
    initialValues: initialValues as unknown as Record<string, unknown>,
    validationSchema,
    onSubmit: handleSubmit,
    submitButtonText: isEditMode ? "Update Board" : "Create Board",
    variant: "default", // Using default MUI variant
  };

  // Show loading spinner while fetching board data
  if (pageLoading || !formReady) {
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
        <FormBuilder {...formConfig} />
      </Paper>
    </Container>
  );
};

export default BoardEdit;