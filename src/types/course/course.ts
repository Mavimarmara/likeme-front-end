export type CourseStep = {
  stepNumber: number;
  title: string;
  postId: string;
  body: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type ProgramCourse = {
  type: 'program';
  communityId: string;
  steps: CourseStep[];
};
