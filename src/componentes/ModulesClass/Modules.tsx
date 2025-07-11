import { Button } from "@/components/ui/button";
import { LessonItem } from "../Player/LessonItem";
import type { Module, VideoLesson } from "@/componentes/types/interface";
import { ChevronDown, ChevronRight, CheckCircle2 } from "lucide-react";
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
  const isCompleted = moduleProgress === 100;

  // Calcula quantas aulas foram completadas neste módulo
  const completedLessonsInModule = module.lessons.filter(
    (lesson: VideoLesson) => completedLessons.has(lesson.id)
  ).length;
  const totalLessons = module.lessons.length;
  const progressPercentage = (completedLessonsInModule / totalLessons) * 100;

  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  // Calcula a altura do conteúdo quando expande/colapsa
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded]);

  // Handler para seleção de aula que evita conflitos
  const handleSelectLesson = (lesson: VideoLesson) => {
    console.log('ModuleComponent: Selecionando aula', lesson.title);
    onSelectLesson(lesson);
  };

  return (
    <div
      className="group relative overflow-hidden border border-white/10 bg-gradient-to-br from-white/8 via-white/4 to-transparent backdrop-blur-sm transition-all duration-300 hover:border-purple-400/30 hover:shadow-lg hover:shadow-purple-500/10 "
      role="region"
      aria-labelledby={`module-${module.id}-title`}
    >
      {/* Cabeçalho do Módulo */}
      <Button
        variant="ghost"
        onClick={() => onToggleModule(module.id)}
        className={`relative w-full p-3 sm:p-4 h-auto hover:bg-gradient-to-r hover:from-purple-500/8 hover:to-blue-500/8 group/button justify-start transition-all duration-300 ease-out ${
          hasCurrentLesson ? "" : ""
        }`}
        aria-expanded={isExpanded}
        aria-controls={`module-${module.id}-content`}
        aria-label={`${isExpanded ? "Recolher" : "Expandir"} módulo ${
          module.title
        }`}
        type="button"
      >
        <div className="flex items-center justify-between w-full gap-3">
          {/* Contador de Aulas com Progresso Visual - Lado Esquerdo */}
          <div className="flex-shrink-0">
            <div className="relative group/counter">
              {/* Badge principal com progresso circular */}
              <div className="relative w-8 h-8 sm:w-12 sm:h-12">
                {/* Conteúdo central */}
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/20 rounded-full shadow-xl shadow-green-500/30 group-hover/counter:shadow-2xl group-hover/counter:shadow-green-500/50 transition-all duration-300 group-hover/counter:scale-110 transform-gpu">
                  <span className="relative z-10 text-white font-black text-xs sm:text-sm drop-shadow-lg group-hover/counter:scale-110 transition-transform duration-300">
                    {module.id}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo do módulo - Centro */}
          <div className="text-left flex-1 min-w-0 px-2">
            <div className="flex items-center space-x-2 mb-1">
              <h3
                id={`module-${module.id}-title`}
                className="font-light text-white text-lg sm:text-lg transition-colors duration-300 group-hover/button:text-purple-200 truncate"
              >
                {module.title}
              </h3>
              {isCompleted && (
                <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 flex-shrink-0" />
              )}
            </div>
            <p className="text-sm font-light text-gray-300/80 transition-colors duration-300 group-hover/button:text-gray-200/90 line-clamp-1 sm:line-clamp-2 sm:text-sm">
              {totalLessons} aulas
            </p>
          </div>

          {/* Badge do Módulo e Ícone de Expansão - Lado Direito */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* Badge do Módulo Ultra Sofisticado */}
            <div className="relative group/badge">
              {/* Anel interno */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400/30 to-blue-400/30 rounded-full opacity-50 group-hover/badge:opacity-80 transition-all duration-300" />

              {/* Texto complementar sutil */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover/badge:opacity-100 transition-all duration-300 pointer-events-none">
                <span className="text-xs text-purple-300 font-medium whitespace-nowrap">
                  Módulo {module.id}
                </span>
              </div>
            </div>

            {/* Ícone de expansão melhorado */}
            <div className="relative p-1.5 rounded-lg bg-white/10 transition-all duration-300 group-hover/button:bg-purple-500/15 group-hover/button:scale-105 flex-shrink-0">
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-purple-300 transition-all duration-300 group-hover/button:text-purple-200" />
              ) : (
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-purple-300 transition-all duration-300 group-hover/button:text-purple-200" />
              )}
            </div>
          </div>
        </div>
      </Button>

      {/* Lista de Aulas do Módulo */}
      <div
        id={`module-${module.id}-content`}
        className="transition-all duration-500 ease-out overflow-hidden"
        style={{
          height: `${contentHeight}px`,
          opacity: isExpanded ? 1 : 0,
        }}
        aria-hidden={!isExpanded}
      >
        <div
          ref={contentRef}
          className={`bg-zinc-700/50 to-transparent backdrop-blur-sm border-t border-white/8 transition-all duration-300 ${
            isExpanded ? "translate-y-0" : "-translate-y-2"
          }`}
        >
          {/* Linha decorativa superior */}
          <div className="h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent mx-2 sm:mx-4" />

          {/* Container das aulas */}
          <div className="py-2">
            {module.lessons.map((lesson: VideoLesson, index: number) => (
              <div
                key={lesson.id}
                className="transition-all duration-400 ease-out px-2 sm:px-4 py-1"
                style={{
                  transitionDelay: isExpanded ? `${index * 10}ms` : "0ms",
                  transform: isExpanded ? "translateX(0)" : "translateX(-10px)",
                  opacity: isExpanded ? 1 : 0,
                }}
              >
                {/* Wrapper sem eventos que possam interferir */}
                <div className="relative group/lesson transition-all duration-250 hover:bg-gradient-to-r hover:from-white/4 hover:to-transparent hover:shadow-sm rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/3 to-blue-500/3 opacity-0 group-hover/lesson:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <LessonItem
                    lesson={lesson}
                    currentLesson={currentLesson}
                    completedLessons={completedLessons}
                    onSelectLesson={handleSelectLesson}
                  />
                </div>

                {/* Separador entre aulas */}
                {index < module.lessons.length - 1 && (
                  <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent mx-2 mt-1" />
                )}
              </div>
            ))}
          </div>

          {/* Linha decorativa inferior */}
          <div className="h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent mx-2 sm:mx-4" />
        </div>
      </div>
    </div>
  );
};