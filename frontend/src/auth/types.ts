export type User = { id: number; email: string };

export type AuthContextType = {
  user: User | null;
  login: (e: string, p: string, t: string) => Promise<void>;
  register: (e: string, p: string, t: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};
