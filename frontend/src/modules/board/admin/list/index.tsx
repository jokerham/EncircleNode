import React, { useEffect, useState } from "react";
import { postApi } from "../../../../api/postApi";
import { FiEye, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { showToast } from "../../../../functions/showToast";

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

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

const BoardManagement: React.FC = () => {
  const navigate = useNavigate();
  const [boards, setBoards] = useState<BoardResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      setLoading(true);
      const response = await postApi.getAllBoards();
      setBoards(response);
    } catch (err) {
      showToast("Failed to load boards. Please try again.", "error");
      console.error("Error loading boards:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (board: BoardResponse) => {
    navigate("/board/list/" + board.slug);
  };

  const handleEdit = (board: BoardResponse) => {
    navigate("/admin/board/edit/" + board.slug);
  };

  const handleDelete = async (board: BoardResponse) => {
    if (window.confirm(`Are you sure you want to delete "${board.title}"?`)) {
      try {
        console.log("Delete board:", board._id);
        // Replace with: await postApi.deleteBoard(board._id);
        await loadBoards();
      } catch (err) {
        console.error("Error deleting board:", err);
        showToast("Failed to delete board", "error");
      }
    }
  };

  const handleCreate = () => {
    navigate("/admin/board/edit");
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 400,
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
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 500 }}>
          Board Management
        </Typography>

        <Button
          variant="contained"
          onClick={handleCreate}
          startIcon={<FiPlus />}
        >
          Create Board
        </Button>
      </Box>

      {/* Table Container */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              <TableCell sx={headerCellSx}>Title</TableCell>
              <TableCell sx={headerCellSx}>Description</TableCell>
              <TableCell sx={headerCellSx}>Author</TableCell>
              <TableCell sx={headerCellSx}>Slug</TableCell>
              <TableCell sx={headerCellSx}>Status</TableCell>
              <TableCell sx={headerCellSx}>Updated</TableCell>
              <TableCell sx={headerCellSx}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {boards.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  sx={{ py: 4, textAlign: "center", color: "text.secondary" }}
                >
                  No boards found
                </TableCell>
              </TableRow>
            ) : (
              boards.map((board) => (
                <TableRow
                  key={board._id}
                  hover
                  sx={{
                    "& td": { whiteSpace: "nowrap" },
                  }}
                >
                  <TableCell>
                    <Typography sx={{ fontWeight: 500 }}>
                      {board.title}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      title={board.description ?? "-"}
                    >
                      {board.description || "-"}
                    </Typography>
                  </TableCell>

                  <TableCell>{board.authorId?.name ?? "-"}</TableCell>

                  <TableCell>
                    <Chip
                      label={board.slug}
                      variant="outlined"
                      size="small"
                      sx={{ color: "text.secondary" }}
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={board.isActive ? "Active" : "Inactive"}
                      size="small"
                      sx={{
                        ...(board.isActive
                          ? {
                              color: "#2e7d32",
                              bgcolor: "#e8f5e9",
                            }
                          : {
                              color: "text.secondary",
                              bgcolor: "action.hover",
                            }),
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(board.updatedAt)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="View">
                        <IconButton
                          size="small"
                          onClick={() => handleView(board)}
                          sx={{ color: "primary.main" }}
                        >
                          <FiEye />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(board)}
                          sx={{ color: "primary.main" }}
                        >
                          <FiEdit2 />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => void handleDelete(board)}
                          sx={{ color: "error.main" }}
                        >
                          <FiTrash2 />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const headerCellSx = {
  color: "common.white",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  fontSize: "0.75rem",
} as const;

export default BoardManagement;