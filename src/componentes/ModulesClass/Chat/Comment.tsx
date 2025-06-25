import { useState } from "react";
import type { Comment, CommentAttachment } from "@/componentes/types/interface"
import { Edit3, MoreVertical, Pin, Reply, Trash2, FileText, Image, Video, Music, Link } from "lucide-react";

export const CommentChat = ({ 
  comment, 
  onReply, 
  onPin, 
  onDelete,
  onEdit,
  level = 0 
}: { 
  comment: Comment; 
  onReply: (id: number) => void;
  onPin: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newMessage: string) => void;
  level?: number;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editMessage, setEditMessage] = useState(comment.message);
  const [showReplies, setShowReplies] = useState(false);

  const handleEdit = () => {
    onEdit(comment.id, editMessage);
    setIsEditing(false);
  };

  // Helper function to get icon based on file type
  const getFileIcon = (fileType: CommentAttachment['fileType']) => {
    switch (fileType) {
      case 'image':
        return <Image className="w-3 h-3" />;
      case 'video':
        return <Video className="w-3 h-3" />;
      case 'audio':
        return <Music className="w-3 h-3" />;
      case 'link':
        return <Link className="w-3 h-3" />;
      case 'document':
      default:
        return <FileText className="w-3 h-3" />;
    }
  };

  // Helper function to render attachment based on type
  const renderAttachment = (attachment: CommentAttachment) => {
    if (attachment.fileType === 'image' && attachment.thumbnail) {
      return (
        <div className="bg-white/10 rounded-lg p-2 max-w-xs">
          <img 
            src={attachment.thumbnail} 
            alt={attachment.fileName}
            className="rounded max-h-32 w-auto"
          />
          <p className="text-xs text-gray-300 mt-1 truncate">{attachment.fileName}</p>
        </div>
      );
    }
    
    return (
      <div className="bg-white/10 text-gray-300 px-3 py-2 rounded-lg text-xs flex items-center space-x-2 max-w-xs">
        {getFileIcon(attachment.fileType)}
        <span className="truncate">{attachment.fileName}</span>
        {attachment.fileSize && (
          <span className="text-gray-400">
            ({(attachment.fileSize / 1024).toFixed(1)}KB)
          </span>
        )}
      </div>
    );
  };

  return (
    <div className={`${level > 0 ? 'ml-8 border-l-2 border-purple-500/20 pl-4' : ''}`}>
      <div
        className={`relative group transition-all duration-200 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg ${
          comment.isPinned 
            ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20' 
            : ''
        }`}
      >
        <div className="p-4">
          {/* Pin indicator */}
          {comment.isPinned && (
            <div className="absolute -top-2 -right-2 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full px-2 py-1 text-xs">
              <Pin className="w-3 h-3" />
            </div>
          )}

          {/* Header do comentário */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                {comment.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white text-sm truncate">{comment.user}</p>
                <p className="text-xs text-gray-400">
                  {new Date(comment.timestamp).toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                  {comment.isEdited && <span className="ml-1 opacity-60">(editado)</span>}
                </p>
              </div>
            </div>

            <div className="flex-shrink-0">
              <button className="p-1 hover:bg-white/10 rounded">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Conteúdo do comentário */}
          <div className="mb-3">
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 text-sm resize-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 scrollbar-none"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  rows={3}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleEdit}
                    className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded-md"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-md"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="break-words overflow-wrap-anywhere  ">
                <p className="text-gray-200 text-sm leading-relaxed break-words hyphens-auto">
                  {comment.message}
                </p>
              </div>
            )}
          </div>

          {/* Anexos */}
          {comment.attachments && comment.attachments.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {comment.attachments.map((attachment, index) => (
                <a
                  key={index}
                  href={attachment.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  {renderAttachment(attachment)}
                </a>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => onReply(comment.id)}
                className="p-1 hover:bg-white/10 rounded"
                title="Responder"
              >
                <Reply className="w-3 h-3 text-gray-400" />
              </button>
              <button
                onClick={() => onPin(comment.id)}
                className="p-1 hover:bg-white/10 rounded"
                title={comment.isPinned ? "Desafixar" : "Fixar"}
              >
                <Pin className="w-3 h-3 text-gray-400" />
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 hover:bg-white/10 rounded"
                title="Editar"
              >
                <Edit3 className="w-3 h-3 text-gray-400" />
              </button>
              <button
                onClick={() => onDelete(comment.id)}
                className="p-1 hover:bg-red-500/20 rounded"
                title="Excluir"
              >
                <Trash2 className="w-3 h-3 text-red-400" />
              </button>
            </div>
          </div>

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4">
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-purple-400 hover:text-purple-300 text-sm"
              >
                {showReplies ? 'Ocultar' : 'Mostrar'} {comment.replies.length} resposta(s)
              </button>
              {showReplies && (
                <div className="mt-3 space-y-3">
                  {comment.replies.map((reply: Comment) => (
                    <CommentChat
                      key={reply.id}
                      comment={reply}
                      onReply={onReply}
                      onPin={onPin}
                      onDelete={onDelete}
                      onEdit={onEdit}
                      level={level + 1}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};