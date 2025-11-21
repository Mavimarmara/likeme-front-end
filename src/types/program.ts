export interface Program {
  id: string;
  name: string;
  description: string;
  duration: string;
  participantsCount: number;
  image?: string;
}

export interface ProgramModule {
  id: string;
  title: string;
  isCompleted: boolean;
  isExpanded?: boolean;
  content?: ProgramContent[];
  activities?: ProgramActivity[];
}

export interface ProgramContent {
  id: string;
  type: 'video' | 'text' | 'image';
  title: string;
  thumbnail?: string;
  duration?: string;
  url?: string;
}

export interface ProgramActivity {
  id: string;
  type: 'survey' | 'quiz' | 'exercise';
  question: string;
  options?: string[];
  isSubmitted: boolean;
}

export interface ProgramDetail extends Program {
  modules: ProgramModule[];
}

