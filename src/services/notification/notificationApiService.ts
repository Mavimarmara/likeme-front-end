import apiClient from '../infrastructure/apiClient';

interface ApiResponse {
  success: boolean;
  message: string;
}

const notificationApiService = {
  registerToken: async (token: string, platform: string): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse>('/api/notifications/register-token', {
      token,
      platform,
    });
  },

  unregisterToken: async (token: string): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse>('/api/notifications/unregister-token', {
      token,
    });
  },
};

export default notificationApiService;
