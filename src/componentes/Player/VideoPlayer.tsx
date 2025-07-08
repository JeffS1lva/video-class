import { Card, CardContent } from "@/components/ui/card";
import { VideoControls } from "./VideoControls";
import { Clock, Eye, BookOpen } from "lucide-react";
import type { VideoLesson } from "@/componentes/types/interface";

import React, { useState, useRef, useEffect } from "react";

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
}) => {
  // Estados locais para volume, mute, fullscreen e configurações
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Referência para o container do vídeo (para fullscreen)
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Efeito para sincronizar volume com o elemento de vídeo
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume / 100;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted, videoRef]);

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
    <Card className="bg-gradient-to-br from-slate-900/40 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border border-white/20 overflow-hidden shadow-2xl ring-1 ring-white/10">
      {/* Video Container com referência para fullscreen */}
      <div ref={videoContainerRef} className="relative group">
        <video
          ref={videoRef}
          src={currentLesson.videoUrl}
          className="w-full aspect-video object-cover transition-all duration-300"
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onEnded={onVideoEnd}
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
        />
      </div>

      {/* Content Section */}
      <CardContent className="p-0">
        {/* Header com gradiente animado */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r animate-pulse"></div>
          <div className="relative p-8 pb-6">
            {/* Badge de status */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm font-medium">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Assistindo agora
              </div>
            </div>

            {/* Título principal com efeito 3D */}
            <div className="relative mb-6">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur-lg opacity-50"></div>
              <div className="relative">
                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight tracking-tight">
                  {currentLesson.title}
                </h1>
                <div className="flex items-center gap-2 mt-4">
                  <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-8 pb-6">
          <div className="flex flex-wrap items-center gap-6 mb-6">
            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium">
                {formatTime(duration)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Eye className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium">1.2k visualizações</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <BookOpen className="w-4 h-4 text-pink-400" />
              <span className="text-sm font-medium">
                Aula #{currentLesson.id || "01"}
              </span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="px-8 pb-8">
          <div className="relative">
            <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-full opacity-60"></div>
            <div className="pl-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Sobre esta aula
              </h3>
              <p className="text-gray-200 text-base leading-relaxed font-light tracking-wide">
                {currentLesson.description}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
