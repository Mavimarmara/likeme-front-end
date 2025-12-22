import type { ApiResponse } from './infrastructure';

export type ActivityType = 'task' | 'event';

export interface UserActivity {
  id: string;
  name: string;
  type: ActivityType;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  location?: string;
  reminderEnabled: boolean;
  reminderMinutes?: number;
  completed?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface ListActivitiesParams {
  type?: ActivityType;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface ListActivitiesApiResponse extends ApiResponse<{
  activities: UserActivity[];
  total: number;
  page: number;
  limit: number;
}> {}

export interface GetActivityApiResponse extends ApiResponse<UserActivity> {}

export interface CreateActivityData {
  name: string;
  type: ActivityType;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  location?: string;
  reminderEnabled: boolean;
  reminderMinutes?: number;
}

export interface UpdateActivityData extends Partial<CreateActivityData> {}
