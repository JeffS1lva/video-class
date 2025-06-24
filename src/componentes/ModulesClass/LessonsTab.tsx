import type { Module, VideoLesson } from "../types/interface";
import { ModuleComponent } from "./Modules";

export const LessonsTab = ({ 
  modules, 
  currentLesson, 
  expandedModules, 
  completedLessons, 
  onToggleModule, 
  onSelectLesson, 
  getModuleProgress 
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
    <div className="h-[600px] overflow-y-auto">
      <div className="divide-y divide-white/5">
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