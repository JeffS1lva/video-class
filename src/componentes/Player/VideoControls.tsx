import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Pause,
  Play,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { useState, useEffect } from "react";

export const VideoControls = ({
  isPlaying,
  currentTime,
  duration,
  progress,
  volume: externalVolume,
  isMuted: externalIsMuted,
  isFullscreen: externalIsFullscreen,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onMute,
  onFullscreen,
  onSkipForward,
  onSkipBack,
  formatTime,
  videoContainerRef,
  isMobile = false,
}: {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  volume?: number;
  isMuted?: boolean;
  isFullscreen?: boolean;
  onPlayPause: () => void;
  onSeek: (value: number[]) => void;
  onVolumeChange?: (value: number[]) => void;
  onMute?: () => void;
  onFullscreen?: () => void;
  onSettings?: () => void;
  onSkipForward?: () => void;
  onSkipBack?: () => void;
  formatTime: (time: number) => string;
  videoContainerRef?: React.RefObject<HTMLDivElement | null>;
  isMobile?: boolean;
}) => {
  // Estados internos com fallback para quando não são fornecidos externamente
  const [internalVolume, setInternalVolume] = useState(75);
  const [internalIsMuted, setInternalIsMuted] = useState(false);
  const [internalIsFullscreen, setInternalIsFullscreen] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Usar props externas se fornecidas, senão usar estado interno
  const volume = externalVolume ?? internalVolume;
  const isMuted = externalIsMuted ?? internalIsMuted;
  const isFullscreen = externalIsFullscreen ?? internalIsFullscreen;

  // Efeito para detectar mudanças no fullscreen nativo
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = Boolean(document.fullscreenElement);
      if (
        !externalIsFullscreen &&
        isCurrentlyFullscreen !== internalIsFullscreen
      ) {
        setInternalIsFullscreen(isCurrentlyFullscreen);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [externalIsFullscreen, internalIsFullscreen]);

  // Auto-hide volume slider em mobile após 3 segundos
  useEffect(() => {
    if (isMobile && showVolumeSlider) {
      const timer = setTimeout(() => {
        setShowVolumeSlider(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showVolumeSlider, isMobile]);

  const handleVolumeChange = (value: number[]) => {
    if (onVolumeChange) {
      onVolumeChange(value);
    } else {
      setInternalVolume(value[0]);
    }
  };

  const handleMute = () => {
    if (onMute) {
      onMute();
    } else {
      setInternalIsMuted(!internalIsMuted);
    }
    
    // Em mobile, mostrar slider temporariamente
    if (isMobile) {
      setShowVolumeSlider(true);
    }
  };

  const handleFullscreen = async () => {
    if (onFullscreen) {
      onFullscreen();
    } else {
      try {
        if (!document.fullscreenElement) {
          // Entrar em tela cheia
          const element =
            videoContainerRef?.current || document.documentElement;

          if (element.requestFullscreen) {
            await element.requestFullscreen();
          } else if ((element as any).mozRequestFullScreen) {
            // Firefox
            await (element as any).mozRequestFullScreen();
          } else if ((element as any).webkitRequestFullscreen) {
            // Chrome, Safari e Opera
            await (element as any).webkitRequestFullscreen();
          } else if ((element as any).msRequestFullscreen) {
            // IE/Edge
            await (element as any).msRequestFullscreen();
          }

          setInternalIsFullscreen(true);
        } else {
          // Sair da tela cheia
          if (document.exitFullscreen) {
            await document.exitFullscreen();
          } else if ((document as any).mozCancelFullScreen) {
            // Firefox
            await (document as any).mozCancelFullScreen();
          } else if ((document as any).webkitExitFullscreen) {
            // Chrome, Safari e Opera
            await (document as any).webkitExitFullscreen();
          } else if ((document as any).msExitFullscreen) {
            // IE/Edge
            await (document as any).msExitFullscreen();
          }

          setInternalIsFullscreen(false);
        }
      } catch (error) {
        console.error("Erro ao alternar tela cheia:", error);
      }
    }
  };

  // Função para retroceder 10 segundos
  const handleSkipBack = () => {
    if (onSkipBack) {
      onSkipBack();
    } else {
      // Calcula o novo tempo em segundos
      const newTimeInSeconds = Math.max(0, currentTime - 10);
      // Converte para porcentagem baseada na duração
      const newProgress =
        duration > 0 ? (newTimeInSeconds / duration) * 100 : 0;
      onSeek([newProgress]);
    }
  };

  // Função para avançar 10 segundos
  const handleSkipForward = () => {
    if (onSkipForward) {
      onSkipForward();
    } else {
      // Calcula o novo tempo em segundos
      const newTimeInSeconds = Math.min(duration, currentTime + 10);
      // Converte para porcentagem baseada na duração
      const newProgress =
        duration > 0 ? (newTimeInSeconds / duration) * 100 : 0;
      onSeek([newProgress]);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-all duration-300 ease-out">
      {/* Progress Bar */}
      <div className={`group ${isMobile ? 'px-4 pt-4 pb-2' : 'px-6 pt-4 pb-2'}`}>
        <div className="relative">
          <Slider
            value={[progress]}
            onValueChange={onSeek}
            max={100}
            step={0.1}
            className="w-full cursor-pointer transition-all duration-200"
          />
          {/* Progress indicator dot */}
          <div
            className="absolute top-1/2 w-4 h-4 sm:w-5 sm:h-5 rounded-full shadow-lg transform -translate-y-1/2 transition-all duration-200 opacity-0 group-hover:opacity-100 pointer-events-none"
            style={{ left: `${progress}%`, marginLeft: isMobile ? "-8px" : "-10px" }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className={`flex items-center justify-between ${isMobile ? 'px-3 pb-4' : 'px-6 pb-4'}`}>
        {/* Left Controls */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Play/Pause Button */}
          <Button
            onClick={onPlayPause}
            size="sm"
            className={`bg-purple-500 hover:bg-purple-600 active:bg-purple-700 rounded-full p-0 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 ease-out ${
              isMobile ? 'w-10 h-10' : 'w-12 h-12'
            }`}
          >
            <div className="flex items-center justify-center">
              {isPlaying ? (
                <Pause className={`text-white ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
              ) : (
                <Play className={`text-white ${isMobile ? 'w-5 h-5 ml-0.5' : 'w-6 h-6 ml-0.5'}`} />
              )}
            </div>
          </Button>

          {/* Skip Back Button */}
          <button
            onClick={handleSkipBack}
            className={`relative bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full border border-white/20 hover:border-white/40 transition-all duration-200 flex items-center justify-center group ${
              isMobile ? 'w-9 h-9' : 'w-10 h-10 sm:w-12 sm:h-12'
            }`}
            title="Retroceder 10 segundos"
          >
            <RotateCcw className={`text-white/80 group-hover:text-white transition-colors duration-200 ${
              isMobile ? 'w-5 h-5' : 'w-6 h-6 sm:w-7 sm:h-7'
            }`} />
            <span
              className={`absolute font-bold text-white/90 group-hover:text-white transition-colors duration-200 ${
                isMobile ? 'text-xs top-3' : 'text-xs top-4 sm:top-4.5'
              }`}
              style={{ fontSize: isMobile ? "8px" : "10px" }}
            >
              10
            </span>
          </button>

          {/* Skip Forward Button */}
          <button
            onClick={handleSkipForward}
            className={`relative bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full border border-white/20 hover:border-white/40 transition-all duration-200 flex items-center justify-center group ${
              isMobile ? 'w-9 h-9' : 'w-10 h-10 sm:w-12 sm:h-12'
            }`}
            title="Avançar 10 segundos"
          >
            <RotateCw className={`text-white/80 group-hover:text-white transition-colors duration-200 ${
              isMobile ? 'w-5 h-5' : 'w-6 h-6 sm:w-7 sm:h-7'
            }`} />
            <span
              className={`absolute font-bold text-white/90 group-hover:text-white transition-colors duration-200 ${
                isMobile ? 'text-xs top-3' : 'text-xs top-4 sm:top-4.5'
              }`}
              style={{ fontSize: isMobile ? "8px" : "10px" }}
            >
              10
            </span>
          </button>

          {/* Volume Control - Adaptado para mobile */}
          {!isMobile ? (
            // Desktop Volume Control
            <div className="flex items-center space-x-3 group">
              <button
                onClick={handleMute}
                className="p-1 hover:bg-white/10 rounded transition-colors duration-200"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white hover:text-white transition-colors duration-200" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white hover:text-white transition-colors duration-200" />
                )}
              </button>
              <div className="w-16 sm:w-20 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out transform group-hover:translate-x-0 -translate-x-2">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          ) : (
            // Mobile Volume Control
            <div className="relative flex items-center">
              <button
                onClick={handleMute}
                className="p-1 hover:bg-white/10 rounded transition-colors duration-200"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white transition-colors duration-200" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white transition-colors duration-200" />
                )}
              </button>
              
              {/* Volume slider que aparece/some em mobile */}
              {showVolumeSlider && (
                <div className="absolute left-8 top-1/2 -translate-y-1/2 w-16 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 border border-white/20 transition-all duration-300">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-2">
          {/* Time Display */}
          <div className={`text-white font-medium bg-black/30 backdrop-blur-sm rounded-full border border-white/20 ${
            isMobile ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5'
          }`}>
            <span className="text-purple-300">{formatTime(currentTime)}</span>
            <span className="text-white/60 mx-1">/</span>
            <span className="text-white/80">{formatTime(duration)}</span>
          </div>

          {/* Fullscreen Button */}
          <Button
            onClick={handleFullscreen}
            size="sm"
            className={`bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full p-0 border border-white/20 hover:border-white/40 transition-all duration-200 ${
              isMobile ? 'w-9 h-9' : 'w-10 h-10'
            }`}
            title={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
          >
            {isFullscreen ? (
              <Minimize className={`text-white/80 hover:text-white transition-colors duration-200 ${
                isMobile ? 'w-4 h-4' : 'w-5 h-5'
              }`} />
            ) : (
              <Maximize className={`text-white/80 hover:text-white transition-colors duration-200 ${
                isMobile ? 'w-4 h-4' : 'w-5 h-5'
              }`} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};