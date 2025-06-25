import { MessageCircle, Pin, Reply } from "lucide-react";
import { ChatInput, type ChatInputRef } from "./ChatInput";
import { CommentChat } from "./Comment";
import type { ChatTabProps, Comment } from "@/componentes/types/interface";
import { ChatHeader } from "./ChatHeader";
import { useEffect, useRef, useState } from "react";

export const ChatTab = ({
  comments: initialComments,
  newComment,
  onNewCommentChange,
  onAddComment,
}: ChatTabProps) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "pinned" | "recent">(
    "all"
  );
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<ChatInputRef>(null);

  // Scroll to bottom when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  // Controle do indicador de "digitando..."
  useEffect(() => {
    if (newComment.trim()) {
      if (!isTyping) {
        setIsTyping(true);
      }

      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      const timeout = setTimeout(() => {
        setIsTyping(false);
      }, 2000);

      setTypingTimeout(timeout);
    } else {
      setIsTyping(false);
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    }

    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [newComment]);

  // Filtrar comentários
  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.user.toLowerCase().includes(searchTerm.toLowerCase());

    switch (filterType) {
      case "pinned":
        return matchesSearch && comment.isPinned;
      case "recent":
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return matchesSearch && new Date(comment.timestamp) > oneHourAgo;
      default:
        return matchesSearch;
    }
  });

  // Funções de interação
  const handleReply = (commentId: number) => {
    setReplyingTo(commentId);
    // Foca no textarea após definir o estado
    setTimeout(() => {
      chatInputRef.current?.focus();
    }, 0);
  };

  const handlePin = (commentId: number) => {
    setComments((prev: any[]) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, isPinned: !comment.isPinned }
          : comment
      )
    );
  };

  const handleDelete = (commentId: number) => {
    setComments((prev: any[]) =>
      prev.filter((comment) => comment.id !== commentId)
    );
  };

  const handleEdit = (commentId: number, newMessage: string) => {
    setComments((prev: any[]) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, message: newMessage, isEdited: true }
          : comment
      )
    );
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentObj: Comment = {
        id: Date.now(),
        user: "Você",
        message: newComment,
        timestamp: new Date(),
        avatar: "VC",
        replies: [],
        isPinned: false,
        isEdited: false,
      };

      if (replyingTo) {
        setComments((prev: any[]) =>
          prev.map((comment) => {
            if (comment.id === replyingTo) {
              return {
                ...comment,
                replies: [
                  ...(comment.replies || []),
                  { ...newCommentObj, id: Date.now() + 1 },
                ],
              };
            }
            return comment;
          })
        );
        setReplyingTo(null);
      } else {
        setComments((prev: any) => [...prev, newCommentObj]);
      }

      onAddComment();
      setIsTyping(false);
    }
  };

  const pinnedComments = comments.filter((c) => c.isPinned);
  const regularComments = filteredComments.filter((c) => !c.isPinned);

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-900/50 to-slate-800/50 backdrop-blur-sm rounded-b-lg border border-white/10 shadow-2xl">
      <ChatHeader
        comments={comments}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
      />

      {/* Lista de comentários */}
      <div
        className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Status indicators */}

        {filteredComments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageCircle className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-sm text-center">
              {searchTerm
                ? "Nenhum comentário encontrado"
                : "Seja o primeiro a comentar!"}
              <br />
              <span className="text-xs">
                {searchTerm
                  ? "Tente outro termo de busca"
                  : "Compartilhe suas ideias sobre esta aula"}
              </span>
            </p>
          </div>
        ) : (
          <>
            {/* Comentários fixados */}
            {pinnedComments.length > 0 && filterType !== "recent" && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Pin className="w-4 h-4 text-yellow-400" />
                  <h4 className="text-yellow-400 text-sm font-medium">
                    Comentários Fixados
                  </h4>
                </div>
                {pinnedComments.map((comment: Comment) => (
                  <CommentChat
                    key={comment.id}
                    comment={comment}
                    onReply={handleReply}
                    onPin={handlePin}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                ))}
                {regularComments.length > 0 && (
                  <div className="border-t border-white/10 my-4"></div>
                )}
              </div>
            )}

            {/* Comentários regulares */}
            <div className="space-y-4">
              {regularComments.map((comment) => (
                <CommentChat
                  key={comment.id}
                  comment={comment}
                  onReply={handleReply}
                  onPin={handlePin}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="py-3 px-3 space-y-3">
        {replyingTo && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="p-3">
              <p className="text-blue-300 text-sm flex items-center">
                <Reply className="w-4 h-4 mr-2" />
                Respondendo ao comentário de{" "}
                {comments.find((c) => c.id === replyingTo)?.user}
                <button
                  onClick={() => setReplyingTo(null)}
                  className="ml-auto p-1 text-blue-400 hover:text-white rounded"
                >
                  ✕
                </button>
              </p>
            </div>
          </div>
        )}

        {isTyping && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg ">
            <div className="p-3">
              <p className="text-green-300 text-sm flex items-center">
                <div className="flex space-x-1 mr-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                Você está digitando...
              </p>
            </div>
          </div>
        )}
      </div>

      <ChatInput
        ref={chatInputRef}
        newComment={newComment}
        onNewCommentChange={onNewCommentChange}
        onAddComment={handleAddComment}
        replyingTo={replyingTo}
      />
    </div>
  );
};