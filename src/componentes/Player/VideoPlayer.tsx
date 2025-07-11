import { Card, CardContent } from "@/components/ui/card";
import { VideoControls } from "./VideoControls";
import { Clock, BookOpen } from "lucide-react";
import type { Module, VideoLesson } from "@/componentes/types/interface";

import React, { useState, useRef, useEffect } from "react";

// Tipo estendido para incluir moduleTitle
type VideoLessonWithModule = VideoLesson & {
  moduleTitle?: string;
};

export const VideoPlayer = ({
  currentLesson,
  videoRef,
  isPlaying,
  currentTime,
  duration,
  progress,
  onPlayPause,
  onSeek,
  onTimeUpdate,
  onLoadedMetadata,
  onVideoEnd,
  formatTime,
  modules,
  selectLesson,
}: {
  currentLesson: VideoLesson;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  onPlayPause: () => void;
  onSeek: (value: number[]) => void;
  onTimeUpdate: () => void;
  onLoadedMetadata: () => void;
  onVideoEnd: () => void;
  formatTime: (time: number) => string;
  modules: Module[];
  selectLesson: (lesson: VideoLesson) => void;
}) => {
  // Estados locais para volume, mute, fullscreen e configurações
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [playbackSpeed] = useState(1);

  // Referência para o container do vídeo (para fullscreen)
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Detectar se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Efeito para sincronizar volume com o elemento de vídeo
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume / 100;
      videoRef.current.muted = isMuted;
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [volume, isMuted, playbackSpeed, videoRef]);

  // Efeito para detectar mudanças no fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = Boolean(document.fullscreenElement);
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Função para encontrar o título do módulo de uma aula
  const getModuleTitle = (lesson: VideoLesson): string => {
    const module = modules.find(m => m.id === lesson.moduleId);
    return module?.title || "Módulo";
  };

  // Função para encontrar a próxima aula
  const getNextLesson = (currentLesson: VideoLesson, modules: Module[]): VideoLessonWithModule | null => {
    const allLessons: VideoLessonWithModule[] = modules.flatMap(module => 
      module.lessons.map(lesson => ({ 
        ...lesson, 
        moduleTitle: module.title 
      }))
    );
    
    const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLesson.id);
    
    if (currentIndex === -1 || currentIndex === allLessons.length - 1) {
      return null;
    }
    
    return allLessons[currentIndex + 1];
  };

  // Função para ir para a próxima aula
  const goToNextLesson = () => {
    const nextLesson = getNextLesson(currentLesson, modules);
    if (nextLesson && nextLesson.unlocked) {
      // Remove moduleTitle antes de passar para selectLesson
      const { moduleTitle, ...lessonWithoutModuleTitle } = nextLesson;
      selectLesson(lessonWithoutModuleTitle);
    }
  };

  // Componente da seção da próxima aula
  const NextLessonSection = () => {
    const nextLesson = getNextLesson(currentLesson, modules);
    
    if (!nextLesson) {
      return (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Parabéns!
          </h4>
          <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
            <p className="text-green-400 text-sm">
              Você completou todas as aulas disponíveis!
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
          Próxima aula
        </h4>
        <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="w-16 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a1 1 0 001 1h4M9 10V9a1 1 0 011-1h4a1 1 0 011 1v1M13 7h6l1 1v6"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h5 className="text-white font-medium text-sm">
              {nextLesson.title}
            </h5>
            <p className="text-white/60 text-xs mt-1">
              Aula #{nextLesson.id} • {nextLesson.duration}
            </p>
            <p className="text-white/40 text-xs mt-1">
              {nextLesson.moduleTitle}
            </p>
          </div>
          <button 
            onClick={goToNextLesson}
            disabled={!nextLesson.unlocked}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
              nextLesson.unlocked
                ? 'bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30'
                : 'bg-gray-500/20 border border-gray-500/30 text-gray-500 cursor-not-allowed'
            }`}
          >
            {nextLesson.unlocked ? 'Assistir' : 'Bloqueado'}
          </button>
        </div>
      </div>
    );
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (videoRef.current) {
      videoRef.current.volume = value[0] / 100;
    }
  };

  const handleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (videoRef.current) {
      videoRef.current.muted = newMutedState;
    }
  };

  const handleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        // Entrar em tela cheia
        const element = videoContainerRef.current;
        if (element) {
          if (element.requestFullscreen) {
            await element.requestFullscreen();
          } else if ((element as any).mozRequestFullScreen) {
            await (element as any).mozRequestFullScreen();
          } else if ((element as any).webkitRequestFullscreen) {
            await (element as any).webkitRequestFullscreen();
          } else if ((element as any).msRequestFullscreen) {
            await (element as any).msRequestFullscreen();
          }
        }
      } else {
        // Sair da tela cheia
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch (error) {
      console.error("Erro ao alternar tela cheia:", error);
    }
  };

  const handleSettings = () => {
    console.log("Configurações do vídeo");
    // Implementar lógica de configurações se necessário
  };

  // Função para retroceder 10 segundos
  const handleSkipBack = () => {
    if (videoRef.current && duration > 0) {
      const newTime = Math.max(0, currentTime - 10);
      videoRef.current.currentTime = newTime;
      // Também atualizar através do onSeek para manter consistência
      const newProgress = (newTime / duration) * 100;
      onSeek([newProgress]);
    }
  };

  // Função para avançar 10 segundos
  const handleSkipForward = () => {
    if (videoRef.current && duration > 0) {
      const newTime = Math.min(duration, currentTime + 10);
      videoRef.current.currentTime = newTime;
      // Também atualizar através do onSeek para manter consistência
      const newProgress = (newTime / duration) * 100;
      onSeek([newProgress]);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/40 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border border-white/20 overflow-hidden shadow-2xl ring-1 ring-white/10 mx-2 sm:mx-0">
      {/* Video Container com referência para fullscreen */}
      <div ref={videoContainerRef} className="relative group">
        <video
          ref={videoRef}
          src={currentLesson.videoUrl}
          className="w-full aspect-video object-cover transition-all duration-300"
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onEnded={onVideoEnd}
          playsInline // Importante para iOS
          controls={false} // Desabilita controles nativos
        />

        {/* Overlay gradiente sutil */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <VideoControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          progress={progress}
          volume={volume}
          isMuted={isMuted}
          isFullscreen={isFullscreen}
          onPlayPause={onPlayPause}
          onSeek={onSeek}
          onVolumeChange={handleVolumeChange}
          onMute={handleMute}
          onFullscreen={handleFullscreen}
          onSettings={handleSettings}
          formatTime={formatTime}
          videoContainerRef={videoContainerRef}
          onSkipBack={handleSkipBack}
          onSkipForward={handleSkipForward}
          isMobile={isMobile}
        />
      </div>

      {/* Content Section */}
      <CardContent className="p-0">
        {/* Header com gradiente animado */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r animate-pulse"></div>
          <div className="relative p-4 sm:p-6 md:p-8 pb-4 sm:pb-6">
            {/* Badge de status */}
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="flex items-center gap-2 px-2 sm:px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs sm:text-sm font-medium">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="hidden xs:inline">Assistindo agora</span>
                <span className="xs:hidden">Ao vivo</span>
              </div>
              <div className="flex items-center gap-2 px-2 sm:px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-xs sm:text-sm font-medium">
                <span>{getModuleTitle(currentLesson)}</span>
              </div>
            </div>

            {/* Título principal com efeito 3D */}
            <div className="relative mb-4 sm:mb-6">
              <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg sm:rounded-xl blur-sm sm:blur-lg opacity-50"></div>
              <div className="relative">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight tracking-tight">
                  {currentLesson.title}
                </h1>
                <div className="flex items-center gap-2 mt-2 sm:mt-4">
                  <div className="w-20 sm:w-24 md:w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
              <span className="text-xs sm:text-sm font-medium">
                {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-300">
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-pink-400" />
              <span className="text-xs sm:text-sm font-medium">
                Aula #{currentLesson.id || "01"}
              </span>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
          {isMobile ? (
            <div className="space-y-4">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <button
                  onClick={() =>
                    setIsDescriptionExpanded(!isDescriptionExpanded)
                  }
                  className="flex items-center justify-between w-full text-left mb-3"
                >
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    Sobre esta aula
                  </h3>
                  <svg
                    className={`w-5 h-5 text-white/60 transition-transform duration-300 ${
                      isDescriptionExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isDescriptionExpanded
                      ? "max-h-96 opacity-100"
                      : "max-h-20 opacity-75"
                  }`}
                >
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {currentLesson.description}
                  </p>

                  {isDescriptionExpanded && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-white/60">Categoria:</span>
                          <p className="text-blue-400 mt-1">Desenvolvimento</p>
                        </div>
                        <div>
                          <span className="text-white/60">Módulo:</span>
                          <p className="text-purple-400 mt-1">{getModuleTitle(currentLesson)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <NextLessonSection />
            </div>
          ) : (
            /* Versão Desktop Original */
            <div className="space-y-6">
              <div className="relative">
                <div className="absolute -left-2 sm:-left-4 top-0 w-0.5 sm:w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-full opacity-60"></div>
                <div className="pl-4 sm:pl-6">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm sm:text-base">Sobre esta aula</span>
                  </h3>
                  <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-light tracking-wide">
                    {currentLesson.description}
                  </p>
                </div>
              </div>

              <NextLessonSection />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};