import { MessageCircle, Search, Sparkles, Users } from "lucide-react";
import type { Comment } from "@/componentes/types/interface"

export const ChatHeader = ({ 
  comments, 
  searchTerm, 
  setSearchTerm, 
  filterType, 
  setFilterType 
}: {
  comments: Comment[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: 'all' | 'pinned' | 'recent';
  setFilterType: (type: 'all' | 'pinned' | 'recent') => void;
}) => {
  const pinnedComments = comments.filter(c => c.isPinned);

  return (
    <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10">
      <div className="flex items-center justify-between mb-4">
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
              {comments.length} {comments.length === 1 ? "comentário" : "comentários"}
              {pinnedComments.length > 0 && (
                <span className="ml-2 text-yellow-400 bg-yellow-500/20 border border-yellow-500/30 px-2 py-1 rounded text-xs">
                  {pinnedComments.length} fixado(s)
                </span>
              )}
            </p>
          </div>
        </div>
        <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
      </div>

      <div className="flex space-x-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar comentários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-200"
          />
        </div>
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value as 'all' | 'pinned' | 'recent')}
          className="w-32 bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500/50"
        >
          <option value="all" className="bg-slate-800">Todos</option>
          <option value="pinned" className="bg-slate-800">Fixados</option>
          <option value="recent" className="bg-slate-800">Recentes</option>
        </select>
      </div>
    </div>
  );
};