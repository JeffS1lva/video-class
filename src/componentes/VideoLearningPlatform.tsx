import { useRef, useState } from "react";
import { PlatformHeader } from "./Header/Header";
import { Sidebar } from "./Layout/Sidebar";
import { VideoPlayer } from "./Player/VideoPlayer";
import type { Module, VideoLesson, Comment } from "./types/interface";

const VideoLearningPlatform = () => {
  // Estados principais
  const [modules] = useState<Module[]>([
    {
      id: 1,
      title: "Fundamentos do React",
      description: "Conceitos básicos e estrutura inicial",
      lessons: [
        {
          id: 1,
          title: "Introdução ao React",
          duration: "15:30",
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          description:
            "Aprenda os conceitos fundamentais do React e como começar seu primeiro projeto.",
          completed: false,
          unlocked: true,
          moduleId: 1,
        },
        {
          id: 2,
          title: "Componentes e Props",
          duration: "22:15",
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          description:
            "Entenda como criar e utilizar componentes reutilizáveis com props.",
          completed: false,
          unlocked: false,
          moduleId: 1,
        },
        {
          id: 3,
          title: "Componentes e Props Avançados",
          duration: "22:15",
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          description:
            "Entenda como criar e utilizar componentes reutilizáveis com props.",
          completed: false,
          unlocked: false,
          moduleId: 1,
        },
      ],
    },
    {
      id: 2,
      title: "Estado e Hooks",
      description: "Gerenciamento de estado avançado",
      lessons: [
        {
          id: 4,
          title: "useState e useEffect",
          duration: "28:45",
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          description:
            "Domine o gerenciamento de estado com useState e outros hooks essenciais.",
          completed: false,
          unlocked: false,
          moduleId: 2,
        },
        {
          id: 5,
          title: "Hooks Customizados",
          duration: "18:20",
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          description:
            "Crie seus próprios hooks para reutilizar lógica de estado.",
          completed: false,
          unlocked: false,
          moduleId: 2,
        },
      ],
    },
    {
      id: 3,
      title: "Roteamento e Navegação",
      description: "Navegação entre páginas",
      lessons: [
        {
          id: 6,
          title: "React Router Básico",
          duration: "25:10",
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          description:
            "Implemente navegação entre páginas com React Router DOM.",
          completed: false,
          unlocked: false,
          moduleId: 3,
        },
      ],
    },
  ]);

  const [currentLesson, setCurrentLesson] = useState<VideoLesson>(
    modules[0].lessons[0]
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      user: "Ana Silva",
      message: "Excelente explicação! Muito didático.",
      timestamp: new Date(Date.now() - 300000),
      avatar: "AS",
    },
    {
      id: 2,
      user: "Carlos Santos",
      message: "Poderia dar mais exemplos práticos?",
      timestamp: new Date(Date.now() - 180000),
      avatar: "CS",
    },
  ]);
  const [newComment, setNewComment] = useState("");
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(
    new Set()
  );
  const [activeTab, setActiveTab] = useState<"lessons" | "chat">("lessons");
  const [expandedModules, setExpandedModules] = useState<Set<number>>(
    new Set()
  );
  const [mobileView, setMobileView] = useState<"player" | "content">("player");

  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Funções auxiliares
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setCompletedLessons((prev) => new Set(prev).add(currentLesson.id));

    // Desbloquear próxima aula
    const allLessons = modules.flatMap((m) => m.lessons);
    const nextLessonIndex =
      allLessons.findIndex((l) => l.id === currentLesson.id) + 1;
    if (nextLessonIndex < allLessons.length) {
      const nextLesson = allLessons[nextLessonIndex];
      const moduleIndex = modules.findIndex(
        (m) => m.id === nextLesson.moduleId
      );
      const lessonIndex = modules[moduleIndex].lessons.findIndex(
        (l) => l.id === nextLesson.id
      );
      modules[moduleIndex].lessons[lessonIndex].unlocked = true;
    }
  };

  const selectLesson = (lesson: VideoLesson) => {
    if (lesson.unlocked) {
      setCurrentLesson(lesson);
      setCurrentTime(0);
      setIsPlaying(false);
      // Em mobile, volta para o player quando seleciona uma aula
      if (window.innerWidth < 1024) {
        setMobileView("player");
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = (value: number[]) => {
    const time = (value[0] / 100) * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
    setCurrentTime(time);
  };

  const addComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        user: "Você",
        message: newComment,
        timestamp: new Date(),
        avatar: "VC",
      };
      setComments([...comments, comment]);
      setNewComment("");
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;
      const isScrolled = scrollTop > 10 || scrollHeight > clientHeight + 20;

      if (isScrolled) {
        scrollContainerRef.current.classList.add("scrolled");
      } else {
        scrollContainerRef.current.classList.remove("scrolled");
      }
    }
  };

  const toggleModule = (moduleId: number) => {
    setExpandedModules((prev: Set<number>) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const getModuleProgress = (module: Module) => {
    const completedInModule = module.lessons.filter((lesson: { id: any }) =>
      completedLessons.has(lesson.id)
    ).length;
    return Math.round((completedInModule / module.lessons.length) * 100);
  };

  // Cálculos
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const totalLessons = modules.reduce(
    (acc: any, module: { lessons: string | any[] }) =>
      acc + module.lessons.length,
    0
  );
  const completionRate = Math.round(
    (completedLessons.size / totalLessons) * 100
  );

  // Render principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Estilos CSS personalizados */}
      <style>{`
        .invisible-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        .invisible-scrollbar::-webkit-scrollbar {
          width: 0px;
          height: 0px;
          background: transparent;
        }
        
        .invisible-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .invisible-scrollbar::-webkit-scrollbar-thumb {
          background: transparent;
        }
        
        .invisible-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }
        
        .scroll-fade-container {
          position: relative;
        }
        
        .scroll-fade-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 20px;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, transparent 100%);
          pointer-events: none;
          z-index: 10;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .scroll-fade-container::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 20px;
          pointer-events: none;
          z-index: 10;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .scroll-fade-container.scrolled::before,
        .scroll-fade-container.scrolled::after {
          opacity: 1;
        }

        /* Navegação Mobile Otimizada */
        .mobile-nav-container {
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(139, 92, 246, 0.2);
          padding: 8px 16px 12px;
          position: relative;
          z-index: 50;
        }

        .mobile-nav-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(139, 92, 246, 0.6) 30%, 
            rgba(168, 85, 247, 0.8) 50%, 
            rgba(139, 92, 246, 0.6) 70%, 
            transparent 100%
          );
        }

        .mobile-nav-tabs {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 4px;
          max-width: 100%;
          margin: 0 auto;
        }

        .mobile-nav-tab {
          flex: 1;
          max-width: 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 10px 8px;
          border-radius: 16px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          background: transparent;
          border: 1px solid transparent;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }

        .mobile-nav-tab:active {
          transform: scale(0.95);
        }

        .mobile-nav-tab.active {
          background: rgba(139, 92, 246, 0.15);
          border-color: rgba(139, 92, 246, 0.3);
          box-shadow: 
            0 4px 20px rgba(139, 92, 246, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .mobile-nav-tab:not(.active):hover {
          background: rgba(139, 92, 246, 0.08);
          transform: translateY(-1px);
        }

        .mobile-nav-icon {
          width: 24px;
          height: 24px;
          margin-bottom: 4px;
          transition: all 0.3s ease;
          color: #94a3b8;
          stroke-width: 2;
        }

        .mobile-nav-tab.active .mobile-nav-icon {
          color: #a855f7;
          transform: scale(1.1);
        }

        .mobile-nav-tab:not(.active):hover .mobile-nav-icon {
          color: #cbd5e1;
        }

        .mobile-nav-label {
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
          transition: all 0.3s ease;
          text-align: center;
          line-height: 1;
          letter-spacing: 0.3px;
        }

        .mobile-nav-tab.active .mobile-nav-label {
          color: #a855f7;
        }

        .mobile-nav-tab:not(.active):hover .mobile-nav-label {
          color: #cbd5e1;
        }

        /* Indicador de notificação */
        .mobile-nav-badge {
          position: absolute;
          top: 6px;
          right: 12px;
          width: 6px;
          height: 6px;
          background: #ef4444;
          border-radius: 50%;
          opacity: 0;
          transform: scale(0);
          transition: all 0.3s ease;
        }

        .mobile-nav-tab.has-notification .mobile-nav-badge {
          opacity: 1;
          transform: scale(1);
        }

        /* Animação de ripple effect */
        .mobile-nav-tab::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(139, 92, 246, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.3s ease, height 0.3s ease;
        }

        .mobile-nav-tab:active::after {
          width: 80px;
          height: 80px;
        }

        .mobile-content-area {
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(10px);
        }

        .mobile-player-container {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(88, 28, 135, 0.1) 100%);
        }

        /* Transições suaves para mudança de conteúdo */
        .mobile-content-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mobile-content-enter {
          opacity: 0;
          transform: translateY(20px);
        }

        .mobile-content-enter-active {
          opacity: 1;
          transform: translateY(0);
        }

        .mobile-content-exit {
          opacity: 1;
          transform: translateY(0);
        }

        .mobile-content-exit-active {
          opacity: 0;
          transform: translateY(-20px);
        }

        @media (max-width: 1023px) {
          .mobile-layout {
            height: calc(100vh - 70px);
          }
        }

        /* Otimizações para telas pequenas */
        @media (max-width: 380px) {
          .mobile-nav-container {
            padding: 6px 12px 8px;
          }
          
          .mobile-nav-tabs {
            gap: 2px;
          }
          
          .mobile-nav-tab {
            max-width: 80px;
            padding: 8px 6px;
          }
          
          .mobile-nav-icon {
            width: 20px;
            height: 20px;
            margin-bottom: 2px;
          }
          
          .mobile-nav-label {
            font-size: 10px;
          }
        }

        /* Melhorias para acessibilidade */
        @media (prefers-reduced-motion: reduce) {
          .mobile-nav-tab,
          .mobile-nav-icon,
          .mobile-nav-label {
            transition: none;
          }
        }
      `}</style>

      {/* Header da Plataforma */}
      <PlatformHeader completionRate={completionRate} />

      {/* Container Principal com Layout Responsivo */}
      <div className="flex-1 overflow-hidden">
        {/* Layout Desktop (lg+) - Flex horizontal */}
        <div className="hidden lg:flex h-full">
          {/* Seção do Player de Vídeo */}
          <div className="flex-1 relative">
            <div
              ref={scrollContainerRef}
              className="invisible-scrollbar scroll-fade-container h-full overflow-y-auto p-5"
              onScroll={handleScroll}
            >
              <VideoPlayer
                currentLesson={currentLesson}
                videoRef={videoRef}
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={duration}
                progress={progress}
                onPlayPause={handlePlayPause}
                onSeek={handleSeek}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onVideoEnd={handleVideoEnd}
                formatTime={formatTime}
                modules={modules}
                selectLesson={selectLesson}
              />
            </div>
          </div>

          {/* Seção da Sidebar */}
          <div className="w-2/9 flex-shrink-0 p-6 pl-3 flex flex-col h-full">
            <Sidebar
              activeTab={activeTab}
              modules={modules}
              currentLesson={currentLesson}
              expandedModules={expandedModules}
              completedLessons={completedLessons}
              comments={comments}
              newComment={newComment}
              onTabChange={setActiveTab}
              onToggleModule={toggleModule}
              onSelectLesson={selectLesson}
              getModuleProgress={getModuleProgress}
              onNewCommentChange={setNewComment}
              onAddComment={addComment}
            />
          </div>
        </div>

        {/* Layout Mobile (lg e menores) - Layout com tabs na parte inferior */}
        <div className="lg:hidden mobile-layout flex flex-col">
          {/* Área de Conteúdo Principal */}
          <div className="flex-1 relative overflow-hidden">
            {/* Player de Vídeo */}
            <div
              className={`absolute inset-0 mobile-content-transition ${
                mobileView === "player"
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-full"
              }`}
            >
              <div className="mobile-player-container h-full">
                <div
                  ref={scrollContainerRef}
                  className="invisible-scrollbar scroll-fade-container h-full overflow-y-auto p-4"
                  onScroll={handleScroll}
                >
                  <VideoPlayer
                    currentLesson={currentLesson}
                    videoRef={videoRef}
                    isPlaying={isPlaying}
                    currentTime={currentTime}
                    duration={duration}
                    progress={progress}
                    onPlayPause={handlePlayPause}
                    onSeek={handleSeek}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onVideoEnd={handleVideoEnd}
                    formatTime={formatTime}
                    modules={modules} 
                    selectLesson={selectLesson} 
                  />
                </div>
              </div>
            </div>

            {/* Conteúdo da Sidebar */}
            <div
              className={`absolute inset-0 mobile-content-transition ${
                mobileView === "content"
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-full"
              }`}
            >
              <div className="mobile-content-area h-full p-4 overflow-y-auto">
                <Sidebar
                  activeTab={activeTab}
                  modules={modules}
                  currentLesson={currentLesson}
                  expandedModules={expandedModules}
                  completedLessons={completedLessons}
                  comments={comments}
                  newComment={newComment}
                  onTabChange={setActiveTab}
                  onToggleModule={toggleModule}
                  onSelectLesson={selectLesson}
                  getModuleProgress={getModuleProgress}
                  onNewCommentChange={setNewComment}
                  onAddComment={addComment}
                />
              </div>
            </div>
          </div>

          {/* Navegação Mobile Otimizada */}
          <div className="mobile-nav-container">
            <div className="mobile-nav-tabs">
              {/* Tab Player */}
              <button
                onClick={() => setMobileView("player")}
                className={`mobile-nav-tab ${
                  mobileView === "player" ? "active" : ""
                }`}
              >
                <svg
                  className="mobile-nav-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="mobile-nav-label">Player</span>
              </button>

              {/* Tab Aulas */}
              <button
                onClick={() => {
                  setMobileView("content");
                  setActiveTab("lessons");
                }}
                className={`mobile-nav-tab ${
                  mobileView === "content" && activeTab === "lessons" ? "active" : ""
                }`}
              >
                <svg
                  className="mobile-nav-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span className="mobile-nav-label">Aulas</span>
              </button>

              {/* Tab Chat */}
              <button
                onClick={() => {
                  setMobileView("content");
                  setActiveTab("chat");
                }}
                className={`mobile-nav-tab ${
                  mobileView === "content" && activeTab === "chat" ? "active" : ""
                } ${comments.length > 5 ? "has-notification" : ""}`}
              >
                <svg
                  className="mobile-nav-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span className="mobile-nav-label">Chat</span>
                <div className="mobile-nav-badge"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoLearningPlatform;