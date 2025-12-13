import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  Stack,
} from '@mui/material';
import {
  FiCalendar,
  FiEye,
  FiTag,
  FiFolder,
} from 'react-icons/fi';
import { postApi, type PostResponse } from '../../../api/postApi';
import { CommentSection } from './CommentSection';
import { Author } from '../../../components/Author';

const PostView: React.FC = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (identifier) {
      fetchPost(identifier);
    }
  }, [identifier]);

  const fetchPost = async (postSlug: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await postApi.getPostBySlug(postSlug);
      setPost(response);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to load post');
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !post) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Post not found'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          underline="hover"
          color="inherit"
          sx={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Home
        </Link>
        {post.series && (
          <Link
            underline="hover"
            color="inherit"
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate(`/boards/${post.series!.slug}`)}
          >
            {post.series.title}
          </Link>
        )}
        <Typography color="text.primary">{post.title}</Typography>
      </Breadcrumbs>

      {/* Main Post Content */}
      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        {/* Post Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700, mb: 2 }}
          >
            {post.title}
          </Typography>

          {post.excerpt && (
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 3, fontWeight: 400 }}
            >
              {post.excerpt}
            </Typography>
          )}

          {/* Post Meta Information */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ mb: 3 }}
            flexWrap="wrap"
          >
            {/* Author */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Author 
                userName={post.authorId?.name || 'Unknown Author'} 
                showAvatar
                showName />
            </Box>

            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />

            {/* Published Date */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <FiCalendar size={16} />
              <Typography variant="body2" color="text.secondary">
                {post.publishedAt
                  ? formatDate(post.publishedAt)
                  : formatDate(post.createdAt)}
              </Typography>
            </Box>

            {/* View Count */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <FiEye size={16} />
              <Typography variant="body2" color="text.secondary">
                {post.viewCount} views
              </Typography>
            </Box>
          </Stack>

          {/* Board/Series */}
          {post.series && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <FiFolder size={16} />
              <Chip
                label={post.series.title}
                size="small"
                color="primary"
                variant="outlined"
                clickable
                onClick={() => navigate(`/boards/${post.series!.slug}`)}
              />
            </Box>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <FiTag size={16} />
              {post.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  variant="outlined"
                  clickable
                  onClick={() => navigate(`/posts?tag=${tag}`)}
                />
              ))}
            </Box>
          )}
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Post Content */}
        <Box
          sx={{
            '& img': {
              maxWidth: '100%',
              height: 'auto',
            },
            '& pre': {
              backgroundColor: 'grey.100',
              padding: 2,
              borderRadius: 1,
              overflow: 'auto',
            },
            '& code': {
              backgroundColor: 'grey.100',
              padding: 0.5,
              borderRadius: 0.5,
              fontFamily: 'monospace',
            },
            '& blockquote': {
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              pl: 2,
              ml: 0,
              fontStyle: 'italic',
            },
            '& a': {
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              mt: 3,
              mb: 2,
              fontWeight: 600,
            },
            '& p': {
              mb: 2,
              lineHeight: 1.8,
            },
            '& ul, & ol': {
              mb: 2,
              pl: 3,
            },
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </Paper>

      {/* Comments Section */}
      {post._id && (
        <CommentSection
          postId={post._id}
          comments={post.comments || []}
          onCommentAdded={() => identifier && fetchPost(identifier)}
        />
      )}
    </Container>
  );
};

export default PostView;