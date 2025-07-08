import type { Module, VideoLesson } from "@/componentes/types/interface";
import { ModuleComponent } from "./Modules";

export const LessonsTab = ({
  modules,
  currentLesson,
  expandedModules,
  completedLessons,
  onToggleModule,
  onSelectLesson,
  getModuleProgress,
}: {
  modules: Module[];
  currentLesson: VideoLesson;
  expandedModules: Set<number>;
  completedLessons: Set<number>;
  onToggleModule: (moduleId: number) => void;
  onSelectLesson: (lesson: VideoLesson) => void;
  getModuleProgress: (module: Module) => number;
}) => {
  return (
    <div className="h-[800px] overflow-y-auto">
      <div className="divide-y divide-white/5">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm border-b border-white/10 text-white font-bold">
          <h1 className="text-lg">Conteúdo</h1>
        </div>
        {modules.map((module) => (
          <ModuleComponent
            key={module.id}
            module={module}
            currentLesson={currentLesson}
            expandedModules={expandedModules}
            completedLessons={completedLessons}
            onToggleModule={onToggleModule}
            onSelectLesson={onSelectLesson}
            getModuleProgress={getModuleProgress}
          />
        ))}
      </div>
    </div>
  );
};
