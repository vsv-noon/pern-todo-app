export type User = { id: number; email: string; isActivated: boolean };

export type AuthFormType = {
  email: string;
  password: string;
  captchaToken: string | null;
  isActivated: boolean;
};

export type AuthContextType = {
  user: User | null;
  // login: (e: string, p: string, t: string, a: boolean) => Promise<void>;
  // register: (e: string, p: string, t: string, a: boolean) => Promise<void>;
  login: (data: AuthFormType) => Promise<void>;
  register: (data: AuthFormType) => Promise<void>;
  logout: () => void;
  loading: boolean;
};
