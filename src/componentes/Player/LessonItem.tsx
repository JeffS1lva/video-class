import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Lock, CheckCircle, Clock } from "lucide-react";
import type { VideoLesson } from "../types/interface";

export const LessonItem = ({ 
  lesson, 
  currentLesson, 
  completedLessons, 
  onSelectLesson 
}: {
  lesson: VideoLesson;
  currentLesson: VideoLesson;
  completedLessons: Set<number>;
  onSelectLesson: (lesson: VideoLesson) => void;
}) => {
  const isCompleted = completedLessons.has(lesson.id);
  const isCurrentLesson = lesson.id === currentLesson.id;
  const isWatching = isCurrentLesson && !isCompleted;
  
  return (
    <Button
      onClick={() => onSelectLesson(lesson)}
      disabled={!lesson.unlocked}
      className={`w-full px-4 py-3 h-auto justify-start transition-all duration-200 ${
        isCurrentLesson
          ? 'bg-purple-500/20 border-l-4 border-purple-400 text-white'
          : isCompleted
          ? 'bg-green-500/10 border-l-4 border-green-400/50 text-white hover:bg-green-500/15'
          : lesson.unlocked
          ? 'border-l-4 border-transparent hover:bg-white/5 hover:border-purple-400/30 text-white'
          : 'border-l-4 border-transparent cursor-not-allowed opacity-50 text-gray-500'
      }`}
    >
      <div className="flex items-center gap-3 w-full min-w-0">
        {/* Status Icon */}
        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
          isCompleted
            ? 'bg-green-500'
            : isWatching
            ? 'bg-purple-500'
            : lesson.unlocked
            ? 'bg-gray-600'
            : 'bg-gray-700'
        }`}>
          {isCompleted ? (
            <CheckCircle className="w-3 h-3 text-white p-0.5" />
          ) : lesson.unlocked ? (
            <Play className="w-2.5 h-2.5 text-white p-0.5" />
          ) : (
            <Lock className="w-2.5 h-2.5 text-gray-400 p-0.5" />
          )}
        </div>
        
        {/* Content Area - Flexible */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className={`font-medium text-sm truncate ${
              isCompleted ? 'line-through text-green-300' : ''
            }`}>
              {lesson.title}
            </h4>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Duration Badge */}
              <Badge 
                variant="outline" 
                className={`text-xs px-1.5 py-0.5 ${
                  isCompleted
                    ? 'text-green-400 border-green-400/50'
                    : isWatching
                    ? 'text-purple-400 border-purple-400/50'
                    : 'text-gray-400 border-gray-400/50'
                }`}
              >
                <Clock className="w-2.5 h-2.5 mr-1" />
                {lesson.duration}
              </Badge>
            </div>
          </div>
          
          {/* Status Text + Progress Bar */}
          <div className="flex items-center justify-between mt-1 gap-2">
            <span className={`text-xs flex-shrink-0 ${
              isCompleted
                ? 'text-green-400'
                : isWatching
                ? 'text-purple-400 '
                : lesson.unlocked
                ? 'text-gray-400'
                : 'text-gray-500'
            }`}>
              {isCompleted 
                ? '✓ Concluída' 
                : isWatching 
                ? 'Assistindo'
                : lesson.unlocked
                ? 'Disponível'
                : 'Bloqueada'
              }
            </span>
            
            {/* Progress Bar */}
            {lesson.unlocked && (
              <div className="flex-1 max-w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    isCompleted 
                      ? 'w-full bg-green-400' 
                      : isWatching
                      ? 'w-1/3 bg-purple-400'
                      : 'w-0'
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