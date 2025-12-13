// src/api/postApi.ts
import { api } from './httpClient';

// ============================================
// Types
// ============================================

export const PostStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
} as const;

export type PostStatus = typeof PostStatus[keyof typeof PostStatus];

export interface Author {
  _id: string;
  name: string;
  email: string;
}

export interface BoardResponse {
  _id: string;
  title: string;
  description?: string;
  slug: string;
  authorId: Author;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  posts?: PostResponse[];
}

export interface PostResponse {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  status: PostStatus;
  authorId: Author;
  seriesId?: string;
  series?: BoardResponse;
  seriesOrder?: number;
  tags?: string[];
  viewCount: number;
  isActive: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  comments?: CommentResponse[];
}

export interface CommentResponse {
  _id: string;
  postId: string;
  post?: PostResponse;
  authorId: Author;
  content: string;
  parentCommentId?: string;
  parentComment?: CommentResponse;
  children?: CommentResponse[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  status?: PostStatus;
  authorId: string;
  seriesId?: string;
  seriesOrder?: number;
  tags?: string[];
}

export interface UpdatePostPayload {
  title?: string;
  content?: string;
  excerpt?: string;
  slug?: string;
  status?: PostStatus;
  seriesId?: string;
  seriesOrder?: number;
  tags?: string[];
  isActive?: boolean;
}

export interface CreateBoardPayload {
  title: string;
  description?: string;
  slug: string;
  authorId: string;
}

export interface UpdateBoardPayload {
  title?: string;
  description?: string;
  slug?: string;
  isActive?: boolean;
}

export interface CreateCommentPayload {
  postId: string;
  authorId: string;
  content: string;
  parentCommentId?: string;
}

export interface UpdateCommentPayload {
  content: string;
}

export interface PaginationParams {
  limit?: number;
  page?: number;
}

export interface PostFilterParams extends PaginationParams {
  status?: PostStatus;
  authorId?: string;
  seriesId?: string;
  tag?: string;
}

export interface PublishedPostParams extends PaginationParams {
  tag?: string;
  seriesId?: string;
}

export interface PaginatedResponse<T> {
  posts: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface CreatePostResponse {
  message: string;
  post: PostResponse;
}

interface UpdatePostResponse {
  message: string;
  post: PostResponse;
}

interface DeletePostResponse {
  message: string;
  postId: string;
}

interface CreateBoardResponse {
  message: string;
  board: BoardResponse;
}

interface UpdateBoardResponse {
  message: string;
  board: BoardResponse;
}

interface DeleteBoardResponse {
  message: string;
  boardId: string;
}

interface CreateCommentResponse {
  message: string;
  comment: CommentResponse;
}

interface UpdateCommentResponse {
  message: string;
  comment: CommentResponse;
}

interface DeleteCommentResponse {
  message: string;
  commentId: string;
}

// ============================================
// Post API
// ============================================

export const postApi = {
  // ============================================
  // POST ENDPOINTS
  // ============================================

  // Create new post
  createPost: (payload: CreatePostPayload) =>
    api.post<CreatePostResponse>('/posts', payload),

  // Get all posts with filters
  getAllPosts: (params?: PostFilterParams) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.authorId) queryParams.append('authorId', params.authorId);
    if (params?.seriesId) queryParams.append('seriesId', params.seriesId);
    if (params?.tag) queryParams.append('tag', params.tag);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.page) queryParams.append('page', params.page.toString());

    const query = queryParams.toString();
    return api.get<PaginatedResponse<PostResponse>>(
      `/posts${query ? `?${query}` : ''}`
    );
  },

  // Get published posts only (public)
  getPublishedPosts: (params?: PublishedPostParams) => {
    const queryParams = new URLSearchParams();
    if (params?.tag) queryParams.append('tag', params.tag);
    if (params?.seriesId) queryParams.append('seriesId', params.seriesId);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.page) queryParams.append('page', params.page.toString());

    const query = queryParams.toString();
    return api.get<PaginatedResponse<PostResponse>>(
      `/posts/published${query ? `?${query}` : ''}`
    );
  },

  // Get post by ID
  getPostById: (id: string) =>
    api.get<PostResponse>(`/posts/${id}`),

  // Get post by slug
  getPostBySlug: (slug: string) =>
    api.get<PostResponse>(`/posts/slug/${slug}`),

  // Update post
  updatePost: (id: string, payload: UpdatePostPayload) =>
    api.put<UpdatePostResponse>(`/posts/${id}`, payload),

  // Delete post
  deletePost: (id: string) =>
    api.del<DeletePostResponse>(`/posts/${id}`),

  // Publish post
  publishPost: (id: string) =>
    api.patch<UpdatePostResponse>(`/posts/${id}/publish`),

  // Archive post
  archivePost: (id: string) =>
    api.patch<UpdatePostResponse>(`/posts/${id}/archive`),

  // ============================================
  // BOARD ENDPOINTS
  // ============================================

  // Create new board
  createBoard: (payload: CreateBoardPayload) =>
    api.post<CreateBoardResponse>('/posts/boards', payload),

  // Get all boards
  getAllBoards: (isActive?: boolean) => {
    const query = isActive !== undefined ? `?isActive=${isActive}` : '';
    return api.get<BoardResponse[]>(`/posts/boards${query}`);
  },

  // Get board by ID
  getBoardById: (id: string) =>
    api.get<BoardResponse>(`/posts/boards/${id}`),

  // Get board by slug
  getBoardBySlug: (slug: string) =>
    api.get<BoardResponse>(`/posts/boards/slug/${slug}`),

  // Update board
  updateBoard: (id: string, payload: UpdateBoardPayload) =>
    api.put<UpdateBoardResponse>(`/posts/boards/${id}`, payload),

  // Delete board
  deleteBoard: (id: string) =>
    api.del<DeleteBoardResponse>(`/posts/boards/${id}`),

  // ============================================
  // COMMENT ENDPOINTS
  // ============================================

  // Create new comment
  createComment: (payload: CreateCommentPayload) =>
    api.post<CreateCommentResponse>('/posts/comments', payload),

  // Get comments for a post
  getPostComments: (postId: string) =>
    api.get<CommentResponse[]>(`/posts/comments/post/${postId}`),

  // Update comment
  updateComment: (id: string, payload: UpdateCommentPayload) =>
    api.put<UpdateCommentResponse>(`/posts/comments/${id}`, payload),

  // Delete comment (soft delete)
  deleteComment: (id: string) =>
    api.del<DeleteCommentResponse>(`/posts/comments/${id}`),
};