import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { Comment } from "@/componentes/types/interface";

export const CommentComponent = ({ comment }: { comment: Comment }) => {
  // Função para gerar cores consistentes baseadas no nome do usuário
  const getAvatarGradient = (name: string) => {
    const gradients = [
      "from-purple-500 to-pink-500",
      "from-blue-500 to-cyan-500", 
      "from-green-500 to-emerald-500",
      "from-orange-500 to-red-500",
      "from-indigo-500 to-purple-500",
      "from-teal-500 to-blue-500",
      "from-rose-500 to-pink-500",
      "from-amber-500 to-orange-500"
    ];
    
    // Usar hash simples do nome para escolher gradiente consistente
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
  };

  // Formatação responsiva do timestamp
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    // No mobile, mostrar formato mais compacto
    if (window.innerWidth < 640) {
      if (hours > 0) return `${hours}h`;
      if (minutes > 0) return `${minutes}min`;
      return "agora";
    }
    
    // No desktop, mostrar formato completo
    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}min atrás`;
    return "agora";
  };

  return (
    <div className="flex space-x-2 sm:space-x-3 w-full">
      <Avatar className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 ring-2 ring-white/10 transition-all duration-200 hover:ring-white/20">
        <AvatarFallback 
          className={`bg-gradient-to-r ${getAvatarGradient(comment.user)} text-xs sm:text-sm text-white font-medium shadow-lg`}
          aria-label={`Avatar de ${comment.user}`}
        >
          {comment.avatar}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <Card className="bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-200 shadow-lg backdrop-blur-sm">
          <CardContent className="p-2 sm:p-3">
            {/* Header do comentário */}
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <span className="text-xs sm:text-sm font-medium text-white truncate pr-2 flex-1">
                {comment.user}
              </span>
              <span 
                className="text-xs text-gray-400 flex-shrink-0"
                title={comment.timestamp.toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              >
                {formatTimestamp(comment.timestamp)}
              </span>
            </div>
            
            {/* Conteúdo do comentário */}
            <div className="break-words">
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-wrap break-words hyphens-auto">
                {comment.message}
              </p>
            </div>
            
            {/* Indicadores adicionais */}
            <div className="flex items-center justify-between mt-2 text-xs">
              <div className="flex items-center space-x-2">
                {comment.isPinned && (
                  <span className="bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full text-xs border border-yellow-500/30">
                    Fixado
                  </span>
                )}
                {comment.isEdited && (
                  <span className="text-gray-500 text-xs">
                    (editado)
                  </span>
                )}
              </div>
              
              {/* Contador de respostas no mobile */}
              {comment.replies && comment.replies.length > 0 && (
                <span className="text-purple-400 text-xs sm:hidden">
                  {comment.replies.length} resposta{comment.replies.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Respostas aninhadas - mostrar apenas no desktop por padrão */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 sm:mt-3 ml-2 sm:ml-4 space-y-2 border-l-2 border-purple-500/20 pl-2 sm:pl-3">
            <div className="hidden sm:block">
              <span className="text-xs text-purple-400 font-medium">
                {comment.replies.length} resposta{comment.replies.length > 1 ? 's' : ''}
              </span>
            </div>
            
            {/* Mostrar apenas primeira resposta no mobile, todas no desktop */}
            {comment.replies.slice(0, window.innerWidth < 640 ? 1 : comment.replies.length).map((reply) => (
              <CommentComponent key={reply.id} comment={reply} />
            ))}
            
            {/* Botão "ver mais" no mobile se houver mais respostas */}
            {comment.replies.length > 1 && (
              <button className="sm:hidden text-xs text-purple-400 hover:text-purple-300 transition-colors">
                Ver mais {comment.replies.length - 1} resposta{comment.replies.length - 1 > 1 ? 's' : ''}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};