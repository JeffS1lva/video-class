import { CardHeader } from "@/components/ui/card";
import { MessageCircle, Send, Users, Sparkles } from "lucide-react";
import { CommentComponent } from "./Comment";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Comment } from "../types/interface";

export const ChatTab = ({
  comments,
  newComment,
  onNewCommentChange,
  onAddComment,
}: {
  comments: Comment[];
  newComment: string;
  onNewCommentChange: (value: string) => void;
  onAddComment: () => void;
}) => {
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-900/50 to-slate-800/50 backdrop-blur-sm rounded-lg border border-white/10 shadow-2xl">
      {/* Cabeçalho do Chat Melhorado */}
      <CardHeader className="pb-4 relative overflow-hidden">
        {/* Efeito de brilho sutil no fundo */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 opacity-50"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <MessageCircle className="w-5 h-5 text-purple-400" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h3 className="font-semibold text-white text-base tracking-wide">
                Discussão da Aula
              </h3>
              <p className="text-xs text-gray-400 flex items-center mt-1">
                <Users className="w-3 h-3 mr-1" />
                {comments.length}{" "}
                {comments.length === 1 ? "comentário" : "comentários"}
              </p>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
        </div>
      </CardHeader>

      {/* Lista de Comentários com Scroll Customizado */}
      <div className="flex-1 overflow-y-auto px-6 space-y-4 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageCircle className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-sm text-center">
              Seja o primeiro a comentar!
              <br />
              <span className="text-xs">
                Compartilhe suas ideias sobre esta aula
              </span>
            </p>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {comments.map((comment, index) => (
              <div
                key={comment.id}
                className="animate-in slide-in-from-bottom-2 fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CommentComponent comment={comment} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Campo de Entrada Melhorado */}
      <div className="p-4 border-t border-white/10 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm">
        <div className="flex space-x-3 items-end">
          <div className="flex-1 relative group">
            <Input
              value={newComment}
              onChange={(e) => onNewCommentChange(e.target.value)}
              placeholder="Compartilhe seus pensamentos sobre a aula..."
              className="bg-white/10 border-white/20 text-white placeholder-gray-400 
                         focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 
                         transition-all duration-300 rounded-xl px-4 py-3
                         group-hover:bg-white/15 backdrop-blur-sm"
              onKeyPress={(e) =>
                e.key === "Enter" && !e.shiftKey && onAddComment()
              }
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
          <Button
            onClick={onAddComment}
            disabled={!newComment.trim()}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40
                       transition-all duration-300 rounded-xl px-6 py-3 h-auto
                       transform hover:scale-105 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Dica sutil */}
        <p className="text-xs text-gray-500 mt-2 flex items-center">
          <span className="flex items-center">
            Pressione Enter para enviar • Shift+Enter para nova linha
          </span>
        </p>
      </div>
    </div>
  );
};
