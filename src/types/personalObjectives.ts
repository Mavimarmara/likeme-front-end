export interface PersonalObjective {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  description: string | null;
  order: number;
}

export interface PersonalObjectivesPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PersonalObjectivesResponse {
  success: boolean;
  message: string;
  data: {
    objectives: PersonalObjective[];
    pagination: PersonalObjectivesPagination;
  };
}

export interface PersonalObjectivesParams {
  page?: number;
  limit?: number;
}

export interface UserPersonalObjective {
  userId: string;
  objectiveId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  objective: PersonalObjective;
}

export interface MyObjectivesResponse {
  success: boolean;
  message: string;
  data: UserPersonalObjective[];
}
