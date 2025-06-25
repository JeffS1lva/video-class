import { Send } from "lucide-react";
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

export interface ChatInputRef {
  focus: () => void;
}

export const ChatInput = forwardRef<ChatInputRef, {
  newComment: string;
  onNewCommentChange: (value: string) => void;
  onAddComment: () => void;
  replyingTo: number | null;
}>(({ newComment, onNewCommentChange, onAddComment, replyingTo }, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      textareaRef.current?.focus();
    }
  }));

  // Auto-foco quando começar a responder
  useEffect(() => {
    if (replyingTo && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyingTo]);

  return (
    <div className="p-4 border-t rounded-b-lg border-white/10 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm">
      <div className="flex gap-2 items-center">
        <div className="flex-1 relative group">
          <textarea
            ref={textareaRef}
            value={newComment}
            onChange={(e) => onNewCommentChange(e.target.value)}
            placeholder={
              replyingTo
                ? "Escreva sua resposta..."
                : "Seus pensamentos sobre a aula..."
            }
            className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300 rounded-xl px-3 py-1 group-hover:bg-white/15 backdrop-blur-sm resize-none scrollbar-none "
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              minHeight: "60px",
              maxHeight: "120px",
            }}
            rows={1}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onAddComment();
              }
            }}
          />
          <style>{`
            textarea::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>

        <button
          onClick={onAddComment}
          disabled={!newComment.trim()}
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700  disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 h-12 w-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 mb-1"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
        <span>Enter para enviar • Shift+Enter para nova linha</span>
        <span className={newComment.length > 450 ? "text-orange-400" : ""}>
          {newComment.length}/500
        </span>
      </div>
    </div>
  );
});