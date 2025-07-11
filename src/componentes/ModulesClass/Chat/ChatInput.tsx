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

  // Auto-resize do textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [newComment]);

  return (
    <div className="p-3 sm:p-4 border-t rounded-b-lg border-white/10 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm">
      <div className="flex gap-2 sm:gap-3 items-end">
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
            className="w-full flex bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300 rounded-xl px-3 py-3 sm:px-4 sm:py-3 group-hover:bg-white/15 backdrop-blur-sm resize-none scrollbar-none text-sm sm:text-base leading-relaxed focus:outline-none"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              minHeight: "48px",
              maxHeight: "120px",
            }}
            rows={1}
            maxLength={500}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onAddComment();
              }
            }}
            aria-label={
              replyingTo 
                ? "Escreva sua resposta ao comentário" 
                : "Escreva um novo comentário sobre a aula"
            }
            aria-describedby="char-counter input-help"
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
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 h-12 w-12 sm:h-14 sm:w-14 rounded-xl flex items-center justify-center text-white flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-transparent active:scale-95"
          aria-label={replyingTo ? "Enviar resposta" : "Enviar comentário"}
        >
          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Informações e contador - responsivo */}
      <div className="flex justify-between sm:flex-row sm:items-center sm:justify-between mt-2 sm:mt-3 text-xs text-gray-500 space-y-1 sm:space-y-0">
        <span 
          id="input-help" 
          className="text-xs sm:text-sm order-2 sm:order-1"
        >
          <span className="hidden sm:inline">Enter para enviar • Shift+Enter para nova linha</span>
          <span className="sm:hidden">Enter envia • Shift+Enter quebra linha</span>
        </span>
        <span 
          id="char-counter"
          className={`text-xs sm:text-sm font-medium order-1 sm:order-2 ${
            newComment.length > 450 
              ? "text-orange-400" 
              : newComment.length > 400 
                ? "text-yellow-400" 
                : "text-gray-400"
          }`}
          aria-live="polite"
        >
          {newComment.length}/500
        </span>
      </div>

      {/* Aviso de limite próximo - apenas no mobile */}
      {newComment.length > 450 && (
        <div className="mt-2 sm:hidden">
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-2">
            <p className="text-orange-300 text-xs text-center">
              Você está próximo do limite de caracteres
            </p>
          </div>
        </div>
      )}
    </div>
  );
});