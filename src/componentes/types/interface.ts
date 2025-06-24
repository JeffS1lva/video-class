export interface VideoLesson {
  id: number;
  title: string;
  duration: string;
  videoUrl: string;
  description?: string;
  completed: boolean;
  unlocked: boolean;
  moduleId: number;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  lessons: VideoLesson[];
}

export interface Comment {
  id: number;
  user: string;
  message: string;
  timestamp: Date;
  avatar: string;
}