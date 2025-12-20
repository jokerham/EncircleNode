import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Avatar,
  Stack,
  Button,
} from '@mui/material';
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiCalendar,
  FiPlus,
} from 'react-icons/fi';
import { postApi, type PostResponse, PostStatus } from '../../../api/postApi';
import { userApi } from '../../../api/userApi';
import { useAuth } from '../../../contexts/authContext';
import { showToast } from '../../../functions/showToast';

const PostList: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);
  const [boardInfo, setBoardInfo] = useState<{ title: string } | null>(null);
  const [canCreatePost, setCanCreatePost] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(false);
  const boardSlug = params.identifier;
  
  // Pagination state
  const [page, setPage] = useState(
    parseInt(searchParams.get('page') || '1') - 1
  );
  const [rowsPerPage] = useState(20);

  // Check if user has permission to create posts
  const checkPostPermission = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setCanCreatePost(false);
      return;
    }

    try {
      setCheckingPermission(true);
      const response = await userApi.checkPermission(user._id, {
        resource: 'Post',
        action: 'create'
      });
      setCanCreatePost(response.hasPermission);
    } catch (err: unknown) {
      console.error('Error checking post permission:', err);
      setCanCreatePost(false);
    } finally {
      setCheckingPermission(false);
    }
  }, [user, isAuthenticated]);

  const fetchBoardAndPosts = useCallback(async () => {
    try {
      setLoading(true);
      
      // First, fetch board by slug to get its ID
      const board = await postApi.getBoardBySlug(boardSlug!);
      setBoardInfo({ title: board.title });
      
      // Then fetch posts using the board ID
      const response = await postApi.getAllPosts({
        seriesId: board._id,
        page: page + 1,
        limit: rowsPerPage,
      });

      setPosts(response.posts);
      setTotalPosts(response.pagination.total);
    } catch (err: unknown) {
      showToast((err as Error).message || 'Failed to load board or posts', 'error');
      console.error('Error fetching board and posts:', err);
    } finally {
      setLoading(false);
    }
  }, [boardSlug, page, rowsPerPage]);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await postApi.getAllPosts({
        page: page + 1,
        limit: rowsPerPage,
      });

      setPosts(response.posts);
      setTotalPosts(response.pagination.total);
    } catch (err: unknown) {
      showToast((err as Error).message || 'Failed to load posts', 'error');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (boardSlug) {
      fetchBoardAndPosts();
    } else {
      fetchPosts();
    }
  }, [page, boardSlug, fetchBoardAndPosts, fetchPosts]);

  useEffect(() => {
    checkPostPermission();
  }, [checkPostPermission]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
    setSearchParams({ page: (newPage + 1).toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreatePost = () => {
    if (boardSlug) {
      navigate(`/admin/posts/create?board=${boardSlug}`);
    } else {
      navigate('/admin/posts/create');
    }
  };

  const handleViewPost = (slug: string) => {
    navigate(`/posts/view/${slug}`);
  };

  const handleEditPost = (id: string) => {
    navigate(`/admin/posts/edit/${id}`);
  };

  const handleDeletePost = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await postApi.deletePost(id);
      fetchPosts();
    } catch (err: unknown) {
      showToast((err as Error).message || 'Failed to delete post', 'error');
      console.error('Error deleting post:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: PostStatus) => {
    switch (status) {
      case PostStatus.PUBLISHED:
        return 'success';
      case PostStatus.DRAFT:
        return 'warning';
      case PostStatus.ARCHIVED:
        return 'default';
      default:
        return 'default';
    }
  };

  const getAuthorInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading && posts.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" component="h2">
            {boardInfo ? `${boardInfo.title} - Board` : 'Board'}
          </Typography>
          {boardSlug && !boardInfo && loading && (
            <Typography variant="body2" color="text.secondary">
              Loading board...
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Total: {totalPosts} posts
          </Typography>
          {canCreatePost && !checkingPermission && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<FiPlus />}
              onClick={handleCreatePost}
            >
              Create Post
            </Button>
          )}
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ backgroundColor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Title</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Author</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Board</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Views</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Created</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.length > 0 ? (
              posts.map((post) => (
                <TableRow
                  key={post._id}
                  hover
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                  onClick={() => handleViewPost(post.slug)}
                >
                  <TableCell>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          mb: 0.5,
                          color: 'primary.main',
                        }}
                      >
                        {truncateText(post.title, 60)}
                      </Typography>
                      {post.excerpt && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'block' }}
                        >
                          {truncateText(post.excerpt, 80)}
                        </Typography>
                      )}
                      {post.tags && post.tags.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                          {post.tags.slice(0, 3).map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              size="small"
                              variant="outlined"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          ))}
                          {post.tags.length > 3 && (
                            <Chip
                              label={`+${post.tags.length - 3}`}
                              size="small"
                              variant="outlined"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          bgcolor: 'primary.main',
                          fontSize: '0.75rem',
                        }}
                      >
                        {post.authorId && typeof post.authorId === 'object'
                          ? getAuthorInitials(post.authorId.name)
                          : 'U'}
                      </Avatar>
                      <Typography variant="body2">
                        {post.authorId && typeof post.authorId === 'object'
                          ? post.authorId.name
                          : 'Unknown'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {post.series ? (
                      <Chip
                        label={post.series.title}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        -
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={post.status}
                      size="small"
                      color={getStatusColor(post.status)}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <FiEye size={14} />
                      <Typography variant="body2">{post.viewCount}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <FiCalendar size={14} />
                      <Typography variant="body2">
                        {formatDate(post.createdAt)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <Tooltip title="View Post">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewPost(post.slug)}
                        >
                          <FiEye size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Post">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditPost(post._id)}
                        >
                          <FiEdit size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Post">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeletePost(post._id, post.title)}
                        >
                          <FiTrash2 size={16} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                    No posts found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <TablePagination
          component="div"
          count={totalPosts}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[20]}
          sx={{
            '.MuiTablePagination-toolbar': {
              justifyContent: 'center',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default PostList;