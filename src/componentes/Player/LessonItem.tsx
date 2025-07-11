import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Lock, CheckCircle, Clock } from "lucide-react";
import type { VideoLesson } from "@/componentes/types/interface";

export const LessonItem = ({
  lesson,
  currentLesson,
  completedLessons,
  onSelectLesson,
}: {
  lesson: VideoLesson;
  currentLesson: VideoLesson;
  completedLessons: Set<number>;
  onSelectLesson: (lesson: VideoLesson) => void;
}) => {
  const isCompleted = completedLessons.has(lesson.id);
  const isCurrentLesson = lesson.id === currentLesson.id;
  const isWatching = isCurrentLesson && !isCompleted;

  const getStatusText = () => {
    if (isCompleted) return "✓";
    if (isWatching) return "Assistindo";
    if (lesson.unlocked) return "Liberado";
    return "Bloqueada";
  };

  const getAriaLabel = () => {
    const status = getStatusText();
    const duration = lesson.duration;
    return `${lesson.title}, ${status}, duração: ${duration}`;
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Clique na aula:', lesson.title, 'Desbloqueada:', lesson.unlocked);
    
    if (lesson.unlocked && onSelectLesson) {
      console.log('Selecionando aula:', lesson.title, lesson.id);
      onSelectLesson(lesson);
    } else {
      console.log('Aula bloqueada ou função não disponível');
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={!lesson.unlocked}
      className={`w-full px-2 sm:px-4 py-2 sm:py-3 h-auto justify-start transition-all duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-900 ${
        isCurrentLesson
          ? "bg-purple-500/20 border-l-4 border-purple-400 text-white"
          : isCompleted
          ? "bg-green-500/10 border-l-4 border-green-400/50 text-white hover:bg-green-500/15"
          : lesson.unlocked
          ? "border-l-4 border-transparent hover:bg-white/5 hover:border-purple-400/30 text-white cursor-pointer"
          : "border-l-4 border-transparent cursor-not-allowed opacity-50 text-gray-500"
      }`}
      aria-label={getAriaLabel()}
      role="button"
      tabIndex={lesson.unlocked ? 0 : -1}
      type="button"
    >
      <div className="flex items-start sm:items-center gap-2 sm:gap-3 w-full min-w-0">
        {/* Status Icon */}
        <div
          className={`flex-shrink-0 w-5 h-5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center mt-0.5 sm:mt-0 ${
            isCompleted
              ? "bg-green-500"
              : isWatching
              ? "bg-purple-500"
              : lesson.unlocked
              ? "bg-gray-600"
              : "bg-gray-700"
          }`}
          aria-hidden="true"
        >
          {isCompleted ? (
            <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white p-0.5" />
          ) : lesson.unlocked ? (
            <Play className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white p-0.5" />
          ) : (
            <Lock className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-gray-400 p-0.5" />
          )}
        </div>

        {/* Content Area - Flexible */}
        <div className="flex-1 min-w-0">
          {/* Title and Duration - Stack on mobile */}
          <div className="flex justify-between sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
            <h4
              className={`font-medium text-sm sm:text-base truncate ${
                isCompleted ? "line-through text-green-300" : ""
              }`}
            >
              {lesson.title}
            </h4>

            {/* Duration Badge - Smaller on mobile */}
            <Badge
              variant="outline"
              className={`text-xs px-1.5 py-0.5 self-start sm:self-center ${
                isCompleted
                  ? "text-green-400 border-green-400/50"
                  : isWatching
                  ? "text-purple-400 border-purple-400/50"
                  : "text-gray-400 border-gray-400/50"
              }`}
              aria-label={`Duração: ${lesson.duration}`}
            >
              <Clock className="w-2 h-2 sm:w-2.5 sm:h-2.5 mr-1" />
              {lesson.duration}
            </Badge>
          </div>

          {/* Status Text + Progress Bar - Better mobile layout */}
          <div className="flex items-center justify-between mt-1 sm:mt-2 gap-2">
            <span
              className={`text-xs flex-shrink-0 ${
                isCompleted
                  ? "text-green-400"
                  : isWatching
                  ? "text-gray-300"
                  : lesson.unlocked
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
              aria-live="polite"
            >
              {isCompleted && <span aria-hidden="true">Concluído </span>}
              <span className="hidden sm:inline">{getStatusText()}</span>
              <span className="sm:hidden">
                {isCompleted ? "✓" : isWatching ? "Assistindo" : lesson.unlocked ? "Liberado" : "Bloqueado"}
              </span>
            </span>

            {/* Progress Bar - Responsive width */}
            {lesson.unlocked && (
              <div 
                className="flex-1 max-w-12 sm:max-w-16 h-1 sm:h-1.5 bg-gray-700 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={
                  isCompleted ? 100 : isWatching ? 33 : 0
                }
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Progresso da aula: ${
                  isCompleted ? 100 : isWatching ? 33 : 0
                }%`}
              >
                <div
                  className={`h-full transition-all duration-500 ${
                    isCompleted
                      ? "w-full bg-green-400"
                      : isWatching
                      ? "w-1/3 bg-purple-400"
                      : "w-0"
                  }`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Button>
  );
};