export type User = { id: number; email: string; isActivated: boolean };

export type AuthContextType = {
  user: User | null;
  login: (e: string, p: string, t: string, a: boolean) => Promise<void>;
  register: (e: string, p: string, t: string, a: boolean) => Promise<void>;
  logout: () => void;
  loading: boolean;
};
