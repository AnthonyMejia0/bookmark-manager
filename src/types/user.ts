export type User = {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
  };
} | null;
