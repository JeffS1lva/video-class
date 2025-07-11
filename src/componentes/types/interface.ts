// ========================================
// INTERFACES PRINCIPAIS
// ========================================

import type { ReactNode } from "react";

export interface VideoLesson {
  id: number;
  title: string;
  duration: string;
  videoUrl: string;
  description?: string;
  completed: boolean;
  unlocked: boolean;
  moduleId: number;
  // Melhorias adicionais
  thumbnail?: string;
  transcription?: string;
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  createdAt?: Date;
  updatedAt?: Date;
  // moduleTitle is optional and computed dynamically
  moduleTitle?: ReactNode;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  lessons: VideoLesson[];
  // Melhorias adicionais
  thumbnail?: string;
  estimatedDuration?: string;
  prerequisiteModules?: number[];
  completionPercentage?: number;
  isLocked?: boolean;
  order?: number;
  
}

// ========================================
// INTERFACE DE COMENTÁRIOS CONSOLIDADA
// ========================================

export interface CommentAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: 'image' | 'document' | 'video' | 'audio' | 'link';
  fileSize?: number;
  thumbnail?: string;
  mimeType?: string;
  uploadedAt?: Date;
}

export interface CommentReaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface Comment {
  id: number;
  user: string;
  message: string;
  timestamp: Date;
  avatar: string;
  
  // Funcionalidades existentes melhoradas
  replies?: Comment[];
  isPinned?: boolean;
  isEdited?: boolean;
  editedAt?: Date;
  
  // Novas funcionalidades
  attachments?: CommentAttachment[];
  reactions?: CommentReaction[];
  mentions?: string[];
  isHighlighted?: boolean;
  parentId?: number; // Para melhor controle de replies
  depth?: number; // Profundidade da reply (máx 3 níveis)
  
  // Metadados úteis
  videoTimestamp?: number; // Timestamp do vídeo quando comentou
  isInstructor?: boolean;
  isModerator?: boolean;
  isOwner?: boolean;
  
  // Status e visibilidade
  isDeleted?: boolean;
  isReported?: boolean;
  isApproved?: boolean;
  visibility?: 'public' | 'private' | 'instructors_only';
  
  // Engajamento
  likesCount?: number;
  repliesCount?: number;
  isLikedByCurrentUser?: boolean;
}

// ========================================
// PROPS E CONFIGURAÇÕES
// ========================================

export interface ChatTabProps {
  comments: Comment[];
  newComment: string;
  onNewCommentChange: (value: string) => void;
  onAddComment: () => void;
  
  // Melhorias nas props
  currentUser?: {
    id: string;
    name: string;
    avatar: string;
    role: 'student' | 'instructor' | 'moderator' | 'admin';
  };
  
  // Configurações de funcionalidades
  allowAttachments?: boolean;
  allowReactions?: boolean;
  allowReplies?: boolean;
  maxReplyDepth?: number;
  allowPinning?: boolean;
  allowEditing?: boolean;
  allowDeletion?: boolean;
  
  // Configurações de moderação
  requireApproval?: boolean;
  allowReporting?: boolean;
  showInstructorBadge?: boolean;
  
  // Callbacks adicionais
  onReply?: (commentId: number) => void;
  onPin?: (commentId: number) => void;
  onDelete?: (commentId: number) => void;
  onEdit?: (commentId: number, newMessage: string) => void;
  onLike?: (commentId: number) => void;
  onReact?: (commentId: number, reaction: string) => void;
  onReport?: (commentId: number, reason: string) => void;
  onMention?: (username: string) => void;
  onAttachmentUpload?: (files: File[]) => Promise<CommentAttachment[]>;
  onVideoTimestampClick?: (timestamp: number) => void;
}

// ========================================
// TIPOS AUXILIARES
// ========================================

export type CommentFilterType = 
  | 'all' 
  | 'pinned' 
  | 'recent' 
  | 'instructor' 
  | 'my_comments' 
  | 'mentions' 
  | 'unanswered'
  | 'most_liked';

export type CommentSortType = 
  | 'newest' 
  | 'oldest' 
  | 'most_liked' 
  | 'most_replies' 
  | 'pinned_first';

export interface CommentFilters {
  search: string;
  type: CommentFilterType;
  sort: CommentSortType;
  dateRange?: {
    start: Date;
    end: Date;
  };
  users?: string[];
  tags?: string[];
}

export interface CommentStats {
  total: number;
  pinned: number;
  recent: number;
  instructorComments: number;
  studentComments: number;
  averageResponseTime: number;
  engagementRate: number;
}

// ========================================
// HOOKS E CONTEXTOS
// ========================================

export interface CommentContextType {
  comments: Comment[];
  filters: CommentFilters;
  stats: CommentStats;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addComment: (comment: Omit<Comment, 'id' | 'timestamp'>) => Promise<void>;
  updateComment: (id: number, updates: Partial<Comment>) => Promise<void>;
  deleteComment: (id: number) => Promise<void>;
  togglePin: (id: number) => Promise<void>;
  toggleLike: (id: number) => Promise<void>;
  addReaction: (id: number, emoji: string) => Promise<void>;
  removeReaction: (id: number, emoji: string) => Promise<void>;
  reportComment: (id: number, reason: string) => Promise<void>;
  
  // Filters
  updateFilters: (filters: Partial<CommentFilters>) => void;
  clearFilters: () => void;
  
  // Real-time
  subscribeToComments: (lessonId: number) => () => void;
  isUserTyping: boolean;
  typingUsers: string[];
}

// ========================================
// CONFIGURAÇÕES GLOBAIS
// ========================================

export interface ChatConfiguration {
  features: {
    reactions: boolean;
    attachments: boolean;
    videoTimestamps: boolean;
    mentions: boolean;
    threading: boolean;
    moderation: boolean;
    realTimeTyping: boolean;
    autoSave: boolean;
  };
  
  limits: {
    maxMessageLength: number;
    maxAttachmentSize: number;
    maxAttachmentsPerComment: number;
    maxReplyDepth: number;
    rateLimitPerMinute: number;
  };
  
  ui: {
    theme: 'light' | 'dark' | 'auto';
    compactMode: boolean;
    showAvatars: boolean;
    showTimestamps: boolean;
    autoScrollToNew: boolean;
    soundNotifications: boolean;
  };
  
  permissions: {
    canPin: boolean;
    canDelete: boolean;
    canEdit: boolean;
    canModerate: boolean;
    canViewPrivate: boolean;
    canMention: boolean;
    canUploadAttachments: boolean;
  };
}