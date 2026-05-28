import apiClient from '@/services/infrastructure/apiClient';
import type { ApiResponse } from '@/types/infrastructure';
import type { ProgramCourse } from '@/types/course/course';

class CourseService {
  async getProgramCourseByCommunityId(communityId: string): Promise<ApiResponse<ProgramCourse>> {
    const trimmed = communityId.trim();
    return apiClient.get<ApiResponse<ProgramCourse>>(
      `/api/courses/program/communities/${encodeURIComponent(trimmed)}`,
      undefined,
      true,
    );
  }
}

export const courseService = new CourseService();
