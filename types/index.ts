// Shared TypeScript types for the application

export interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
  firma: string;
  job_title: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  firma: string;
  job_title: string | null;
  created_at: string;
}

export interface ApiResponse<T = unknown> {
  ok?: boolean;
  error?: string;
  data?: T;
}
