import axios from 'axios';

// API configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ApiResponse<T = any> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface SignUpData {
  email: string;
  fullName: string;
  phone?: string;
  hashedPassword: string;
  provider: 'credentials';
}

export interface SignInData {
  email: string;
  hashedPassword: string;
  provider: 'credentials';
}

class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

function handleAxiosError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    const statusCode = error.response?.status || 500;
    throw new ApiError(message, statusCode);
  }

  throw new ApiError('Something went wrong', 500);
}

export const authApi = {
  signUp: async (data: SignUpData): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post<ApiResponse>('/api/v1/auth/signup', data);
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  },
  
  signIn: async (data: SignInData): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post<ApiResponse>('/api/v1/auth/signin', data);
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  },
  
  logout: async (): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post<ApiResponse>('/api/v1/auth/logout');
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  },
};

export { ApiError };
