import { Button } from "@/components/ui/button";
import { LessonItem } from "../Player/LessonItem";
import type { Module, VideoLesson } from "../types/interface";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export const ModuleComponent = ({
  module,
  currentLesson,
  expandedModules,
  completedLessons,
  onToggleModule,
  onSelectLesson,
  getModuleProgress,
}: {
  module: Module;
  currentLesson: VideoLesson;
  expandedModules: Set<number>;
  completedLessons: Set<number>;
  onToggleModule: (moduleId: number) => void;
  onSelectLesson: (lesson: VideoLesson) => void;
  getModuleProgress: (module: Module) => number;
}) => {
  const isExpanded = expandedModules.has(module.id);
  const moduleProgress = getModuleProgress(module);
  const hasCurrentLesson = module.lessons.some(
    (lesson: { id: number }) => lesson.id === currentLesson.id
  );

  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  // Calcula a altura do conteúdo quando expande/colapsa
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded]);

  return (
    <div className="overflow-hidden  border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm transition-all duration-300 hover:border-purple-400/30 hover:shadow-lg hover:shadow-purple-500/10 ">
      {/* Cabeçalho do Módulo */}
      <Button
        variant="ghost"
        onClick={() => onToggleModule(module.id)}
        className={`w-full p-4 h-auto hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 group justify-start transition-all duration-300 ease-in-out ${
          hasCurrentLesson
            ? "bg-gradient-to-r from-purple-500/15 to-blue-500/10  border-purple-400 shadow-lg shadow-purple-500/20"
            : "hover:border-purple-300/50"
        }`}
      >
        <div className="flex items-center justify-between w-full ">
          <div className="flex items-center space-x-3">
            <div className="p-1 rounded-full bg-white/10 transition-all duration-300 ease-in-out group-hover:bg-purple-500/20 ">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-purple-300 transform transition-transform duration-300 group-hover:text-purple-200" />
              ) : (
                <ChevronRight className="w-4 h-4 text-purple-300 transform transition-transform duration-300 group-hover:text-purple-200" />
              )}
            </div>
            <div className="text-left">
              <h3 className="font-bold text-white text-sm mb-1 transition-colors duration-200 group-hover:text-purple-200">
                {module.title}
              </h3>
              <p className="text-xs text-gray-300/80 transition-colors duration-200 group-hover:text-gray-200/90 line-clamp-1">
                {module.description}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex flex-col items-end">
              <Badge
                variant="outline"
                className="text-xs text-purple-300 border-purple-300/50 bg-purple-500/10 transition-all duration-200 group-hover:border-purple-200 group-hover:text-purple-200 group-hover:bg-purple-500/20 ml-4"
              >
                {moduleProgress}%
              </Badge>
              <Progress
                value={moduleProgress}
                className="w-12 h-1.5 mt-1 transition-all duration-200 "
              />
            </div>
            <Badge
              variant="secondary"
              className="text-xs bg-white/10 text-gray-300 border-0 transition-all duration-200 group-hover:bg-purple-100/20 group-hover:text-white"
            >
              {module.lessons.length}
            </Badge>
          </div>
        </div>
      </Button>

      {/* Lista de Aulas do Módulo com Animação Melhorada */}
      <div
        className="transition-all duration-500 ease-in-out overflow-hidden"
        style={{
          height: `${contentHeight}px`,
          opacity: isExpanded ? 1 : 0,
        }}
      >
        <div
          ref={contentRef}
          className={`bg-gradient-to-br from-black/20 to-purple-900/10 backdrop-blur-sm border-t border-white/5 transition-all duration-300 ${
            isExpanded ? "translate-y-0" : "-translate-y-2"
          }`}
        >
          {/* Linha decorativa superior */}
          <div className="h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent mx-4" />

          {/* Container das aulas com padding e espaçamento melhorados */}
          <div className="py-2">
            {module.lessons.map((lesson: VideoLesson, index: number) => (
              <div
                key={lesson.id}
                className="transition-all duration-300 ease-in-out px-4 py-1"
                style={{
                  transitionDelay: isExpanded ? `${index * 50}ms` : "0ms",
                  transform: isExpanded ? "translateX(0)" : "translateX(-10px)",
                  opacity: isExpanded ? 1 : 0,
                }}
              >
                {/* Wrapper com hover effect melhorado */}
                <div className=" transition-all duration-200 hover:bg-white/5 hover:shadow-sm">
                  <LessonItem
                    lesson={lesson}
                    currentLesson={currentLesson}
                    completedLessons={completedLessons}
                    onSelectLesson={onSelectLesson}
                  />
                </div>

                {/* Separador sutil entre aulas (exceto a última) */}
                {index < module.lessons.length - 1 && (
                  <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent mx-2 mt-1" />
                )}
              </div>
            ))}
          </div>

          {/* Linha decorativa inferior */}
          <div className="h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent mx-4" />
        </div>
      </div>
    </div>
  );
};
