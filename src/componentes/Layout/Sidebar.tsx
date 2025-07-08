import { Card } from "@/components/ui/card";
import { ChatTab } from "@/componentes/ModulesClass/Chat/ChatTab";
import { LessonsTab } from "@/componentes/ModulesClass/LessonsTab";
import { TabHeader } from "@/componentes/ModulesClass/TabHeader";
import type { Module, VideoLesson, Comment } from "../types/interface";

export const Sidebar = ({
  activeTab,
  modules,
  currentLesson,
  expandedModules,
  completedLessons,
  comments,
  newComment,
  onTabChange,
  onToggleModule,
  onSelectLesson,
  getModuleProgress,
  onNewCommentChange,
  onAddComment,
}: {
  activeTab: "lessons" | "chat";
  modules: Module[];
  currentLesson: VideoLesson;
  expandedModules: Set<number>;
  completedLessons: Set<number>;
  comments: Comment[];
  newComment: string;
  onTabChange: (tab: "lessons" | "chat") => void;
  onToggleModule: (moduleId: number) => void;
  onSelectLesson: (lesson: VideoLesson) => void;
  getModuleProgress: (module: Module) => number;
  onNewCommentChange: (value: string) => void;
  onAddComment: () => void;
}) => {
  return (
    <Card className="bg-white/5 backdrop-blur-md border-white/10 h-full flex flex-col">
      {/* Cabeçalho das Tabs */}
      <div className="flex-shrink-0">
        <TabHeader activeTab={activeTab} onTabChange={onTabChange} />
      </div>

      {/* Conteúdo das Tabs - Agora ocupa toda altura restante */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === "lessons" && (
          <LessonsTab
            modules={modules}
            currentLesson={currentLesson}
            expandedModules={expandedModules}
            completedLessons={completedLessons}
            onToggleModule={onToggleModule}
            onSelectLesson={onSelectLesson}
            getModuleProgress={getModuleProgress}
          />
        )}

        {activeTab === "chat" && (
          <ChatTab
            comments={comments}
            newComment={newComment}
            onNewCommentChange={onNewCommentChange}
            onAddComment={onAddComment}
          />
        )}
      </div>
    </Card>
  );
};
