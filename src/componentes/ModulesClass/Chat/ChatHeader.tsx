import { MessageCircle, Search, Sparkles, Users, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { Comment } from "@/componentes/types/interface";

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

  const getFilterLabel = (type: string) => {
    switch (type) {
      case 'all': return 'Todos';
      case 'pinned': return 'Fixados';
      case 'recent': return 'Recentes';
      default: return 'Todos';
    }
  };

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
        {/* Input de Busca Melhorado */}
        <div className="flex-1 relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-200" />
          <Input
            type="text"
            placeholder="Buscar comentários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-200 hover:bg-white/15 focus:bg-white/15"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="Limpar busca"
            >
              ×
            </button>
          )}
        </div>

        {/* Select do shadcn/ui */}
        <div className="relative">
          <Select
            value={filterType}
            onValueChange={(value) => setFilterType(value as 'all' | 'pinned' | 'recent')}
          >
            <SelectTrigger className="w-32 bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-200 hover:bg-white/15 data-[state=open]:bg-white/15">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <SelectValue placeholder="Filtrar" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              <SelectItem
                value="all"
                className="focus:bg-purple-500/20 focus:text-white cursor-pointer"
              >
                <div className="flex items-center space-x-2">

                  <span>Todos</span>
                </div>
              </SelectItem>
              <SelectItem
                value="pinned"
                className="focus:bg-purple-500/20 focus:text-white cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span>Fixados</span>
                  {pinnedComments.length > 0 && (
                    <span className="ml-1 text-xs bg-yellow-500/20 text-yellow-400 px-1 rounded">
                      {pinnedComments.length}
                    </span>
                  )}
                </div>
              </SelectItem>
              <SelectItem
                value="recent"
                className="focus:bg-purple-500/20 focus:text-white cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Recentes</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Indicador de Filtro Ativo */}
      {(searchTerm || filterType !== 'all') && (
        <div className="mt-3 flex items-center space-x-2 text-xs text-gray-400">
          <span>Filtros ativos:</span>
          {searchTerm && (
            <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded border border-purple-500/30">
              Busca: "{searchTerm}"
            </span>
          )}
          {filterType !== 'all' && (
            <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded border border-blue-500/30">
              {getFilterLabel(filterType)}
            </span>
          )}
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
            }}
            className="text-gray-500 hover:text-white transition-colors duration-200 underline"
          >
            Limpar tudo
          </button>
        </div>
      )}
    </div>
  );
};