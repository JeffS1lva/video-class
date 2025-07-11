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

        /* Navegação Mobile Ultra-Moderna */
        .mobile-nav-container {
          position: relative;
          padding: 0 20px 30px;
          background: transparent;
        }

        .mobile-nav-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .mobile-nav-content {
          position: relative;
          display: flex;
          align-items: center;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(20px);
          border-radius: 32px;
          padding: 6px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.4),
            0 8px 32px rgba(139, 92, 246, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          overflow: hidden;
        }

        .mobile-nav-content::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          right: -50%;
          bottom: -50%;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            rgba(139, 92, 246, 0.1) 60deg,
            rgba(168, 85, 247, 0.1) 120deg,
            transparent 180deg,
            rgba(147, 51, 234, 0.1) 240deg,
            rgba(139, 92, 246, 0.1) 300deg,
            transparent 360deg
          );
          animation: rotate 8s linear infinite;
          opacity: 0.6;
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .mobile-nav-morphing-bg {
          position: absolute;
          top: 6px;
          left: 6px;
          width: 68px;
          height: 46px;
          background: linear-gradient(135deg, 
            rgba(139, 92, 246, 0.8) 0%, 
            rgba(168, 85, 247, 0.6) 100%);
          border-radius: 26px;
          transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          box-shadow: 
            0 8px 32px rgba(139, 92, 246, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .mobile-nav-button {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 68px;
          height: 46px;
          border-radius: 26px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          overflow: hidden;
        }

        .mobile-nav-button:hover {
          transform: translateY(-2px);
        }

        .mobile-nav-button.active {
          transform: translateY(-3px);
        }

        .mobile-nav-icon {
          width: 22px;
          height: 22px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: #94a3b8;
        }

        .mobile-nav-button:hover .mobile-nav-icon {
          transform: scale(1.1);
          color: #cbd5e1;
        }

        .mobile-nav-button.active .mobile-nav-icon {
          transform: scale(1.15);
          color: #ffffff;
          filter: drop-shadow(0 2px 8px rgba(255, 255, 255, 0.3));
        }

        .mobile-nav-label {
          position: absolute;
          top: -32px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: #ffffff;
          background: rgba(0, 0, 0, 0.9);
          padding: 4px 8px;
          border-radius: 8px;
          border: 1px solid rgba(139, 92, 246, 0.3);
          backdrop-filter: blur(10px);
          opacity: 0;
          transition: all 0.3s ease;
          pointer-events: none;
          white-space: nowrap;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .mobile-nav-button.active .mobile-nav-label {
          opacity: 1;
          transform: translateX(-50%) translateY(-4px);
        }

        /* Animações do morphing background */
        .mobile-nav-content[data-active="0"] .mobile-nav-morphing-bg {
          transform: translateX(0);
        }

        .mobile-nav-content[data-active="1"] .mobile-nav-morphing-bg {
          transform: translateX(74px);
        }

        .mobile-nav-content[data-active="2"] .mobile-nav-morphing-bg {
          transform: translateX(148px);
        }

        /* Efeitos de brilho */
        .mobile-nav-shine {
          position: absolute;

          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transition: left 0.5s ease;
        }

        .mobile-nav-button.active .mobile-nav-shine {
          left: 100%;
          
        }

        /* Partículas flutuantes */
        .mobile-nav-particles {
          position: absolute;
          top: 0px;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          overflow: hidden;
          border-radius: 32px;
        }

        .mobile-nav-particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(139, 92, 246, 0.6);
          border-radius: 50%;
          animation: float 4s ease-in-out infinite;
        }

        .mobile-nav-particle:nth-child(1) {
          left: 20%;
          animation-delay: 0s;
        }

        .mobile-nav-particle:nth-child(2) {
          left: 50%;
          animation-delay: 1s;
        }

        .mobile-nav-particle:nth-child(3) {
          left: 80%;
          animation-delay: 2s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(20px);
            opacity: 0;
          }
          50% {
            transform: translateY(-20px);
            opacity: 1;
          }
        }

        .mobile-content-area {
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(10px);
          
        }

        .mobile-player-container {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(88, 28, 135, 0.1) 100%);
        }

        @media (max-width: 1023px) {
          .mobile-layout {
            height: calc(100vh - 67px);

          }
        }

        @media (max-width: 360px) {
          .mobile-nav-content {
            max-width: 340px;
            padding: 6px;
          }
          
          .mobile-nav-button {
            padding: 10px 6px;
            min-height: 52px;
          }
          
          .mobile-nav-icon {
            width: 22px;
            height: 22px;
          }
          
          .mobile-nav-label {
            font-size: 10px;
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
              className={`absolute inset-0 transition-all duration-300 ease-in-out ${
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
              className={`absolute inset-0 transition-all duration-300 ease-in-out ${
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

          {/* Navegação Mobile Ultra-Moderna */}
          <div className="mobile-nav-container ">
            <div className="mobile-nav-wrapper">
              <div 
                className="mobile-nav-content" 
                data-active={
                  mobileView === "player" ? "0" : 
                  mobileView === "content" && activeTab === "lessons" ? "1" : "2"
                }
              >
                {/* Background morphing animado */}
                <div className="mobile-nav-morphing-bg "></div>
                
                {/* Partículas flutuantes */}
                <div className="mobile-nav-particles ">
                  <div className="mobile-nav-particle"></div>
                  <div className="mobile-nav-particle"></div>
                  <div className="mobile-nav-particle"></div>
                </div>

                {/* Botão Player */}
                <button
                  onClick={() => setMobileView("player")}
                  className={`mobile-nav-button ${
                    mobileView === "player" ? "active" : ""
                  }`}
                >
                  <div className="mobile-nav-shine"></div>
                  <div className="mobile-nav-icon">
                    <svg
                      className="w-full h-full"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 12a9 9 0 11-6.219-8.56"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4"
                      />
                    </svg>
                  </div>
                  <span className="mobile-nav-label">Player</span>
                </button>

                {/* Botão Aulas */}
                <button
                  onClick={() => {
                    setMobileView("content");
                    setActiveTab("lessons");
                  }}
                  className={`mobile-nav-button ${
                    mobileView === "content" && activeTab === "lessons" ? "active" : ""
                  }`}
                >
                  <div className="mobile-nav-shine"></div>
                  <div className="mobile-nav-icon">
                    <svg
                      className="w-full h-full"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                  <span className="mobile-nav-label">Aulas</span>
                </button>

                {/* Botão Chat */}
                <button
                  onClick={() => {
                    setMobileView("content");
                    setActiveTab("chat");
                  }}
                  className={`mobile-nav-button ${
                    mobileView === "content" && activeTab === "chat" ? "active" : ""
                  }`}
                >
                  <div className="mobile-nav-shine"></div>
                  <div className="mobile-nav-icon">
                    <svg
                      className="w-full h-full"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                  <span className="mobile-nav-label">Chat</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoLearningPlatform;