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
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          description: "Aprenda os conceitos fundamentais do React e como começar seu primeiro projeto.",
          completed: false,
          unlocked: true,
          moduleId: 1
        },
        {
          id: 2,
          title: "Componentes e Props",
          duration: "22:15",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          description: "Entenda como criar e utilizar componentes reutilizáveis com props.",
          completed: false,
          unlocked: false,
          moduleId: 1
        },
        {
          id: 2,
          title: "Componentes e Props",
          duration: "22:15",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          description: "Entenda como criar e utilizar componentes reutilizáveis com props.",
          completed: false,
          unlocked: false,
          moduleId: 1
        }
      ]
    },
    {
      id: 2,
      title: "Estado e Hooks",
      description: "Gerenciamento de estado avançado",
      lessons: [
        {
          id: 3,
          title: "useState e useEffect",
          duration: "28:45",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          description: "Domine o gerenciamento de estado com useState e outros hooks essenciais.",
          completed: false,
          unlocked: false,
          moduleId: 2
        },
        {
          id: 4,
          title: "Hooks Customizados",
          duration: "18:20",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          description: "Crie seus próprios hooks para reutilizar lógica de estado.",
          completed: false,
          unlocked: false,
          moduleId: 2
        }
      ]
    },
    {
      id: 3,
      title: "Roteamento e Navegação",
      description: "Navegação entre páginas",
      lessons: [
        {
          id: 5,
          title: "React Router Básico",
          duration: "25:10",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          description: "Implemente navegação entre páginas com React Router DOM.",
          completed: false,
          unlocked: false,
          moduleId: 3
        }
      ]
    }
  ]);
  
  const [currentLesson, setCurrentLesson] = useState<VideoLesson>(modules[0].lessons[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      user: "Ana Silva",
      message: "Excelente explicação! Muito didático.",
      timestamp: new Date(Date.now() - 300000),
      avatar: "AS"
    },
    {
      id: 2,
      user: "Carlos Santos",
      message: "Poderia dar mais exemplos práticos?",
      timestamp: new Date(Date.now() - 180000),
      avatar: "CS"
    }
  ]);
  const [newComment, setNewComment] = useState('');
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<'lessons' | 'chat'>('lessons');
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());

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
    setCompletedLessons(prev => new Set(prev).add(currentLesson.id));

    // Desbloquear próxima aula
    const allLessons = modules.flatMap(m => m.lessons);
    const nextLessonIndex = allLessons.findIndex(l => l.id === currentLesson.id) + 1;
    if (nextLessonIndex < allLessons.length) {
      const nextLesson = allLessons[nextLessonIndex];
      const moduleIndex = modules.findIndex(m => m.id === nextLesson.moduleId);
      const lessonIndex = modules[moduleIndex].lessons.findIndex(l => l.id === nextLesson.id);
      modules[moduleIndex].lessons[lessonIndex].unlocked = true;
    }
  };

  const selectLesson = (lesson: VideoLesson) => {
    if (lesson.unlocked) {
      setCurrentLesson(lesson);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
        avatar: "VC"
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const isScrolled = scrollTop > 10 || scrollHeight > clientHeight + 20;

      if (isScrolled) {
        scrollContainerRef.current.classList.add('scrolled');
      } else {
        scrollContainerRef.current.classList.remove('scrolled');
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
    const completedInModule = module.lessons.filter((lesson: { id: any; }) => completedLessons.has(lesson.id)).length;
    return Math.round((completedInModule / module.lessons.length) * 100);
  };

  // Cálculos
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const totalLessons = modules.reduce((acc: any, module: { lessons: string | any[]; }) => acc + module.lessons.length, 0);
  const completionRate = Math.round((completedLessons.size / totalLessons) * 100);

  // Render principal
  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Estilos CSS personalizados para scroll invisível */}
      <style>{`
        .invisible-scrollbar {
          /* Firefox */
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        /* Webkit browsers (Chrome, Safari, Edge) */
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
        
        /* Efeito de fade nas bordas durante scroll */
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
          background: linear-gradient(180deg,  0%, transparent 100%);
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
          background: linear-gradient(0deg,  0%, transparent 100%);
          pointer-events: none;
          z-index: 10;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .scroll-fade-container.scrolled::before,
        .scroll-fade-container.scrolled::after {
          opacity: 1;
        }
      `}</style>

      {/* Header da Plataforma */}
      <PlatformHeader completionRate={completionRate} />

      {/* Container Principal com Layout Flex - altura fixa */}
      <div className="flex flex-1 overflow-hidden">

        {/* Seção do Player de Vídeo - Ocupa a maior parte da tela com scroll personalizado */}
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
            />
          </div>
        </div>

        {/* Seção da Sidebar - Largura fixa à direita, altura fixa sem scroll */}
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
    </div>
  );
};

export default VideoLearningPlatform;