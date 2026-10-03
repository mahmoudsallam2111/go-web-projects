export interface Article {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  publish_date: string;
  read_time: number;
}

export interface Snippet {
  id: number;
  title: string;
  code: string;
  language: string;
  description: string;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
}
