// // import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
// // import type { User } from '../types/todo';
// // import {
// //   login,
// //   register,
// //   refreshAccessToken,
// //   logout as apiLogout,
// //   getCurrentUser,
// // } from '../services/api';

// // interface AuthContextType {
// //   user: User | null;
// //   login: (email: string, password: string) => Promise<void>;
// //   register: (email: string, password: string) => Promise<void>;
// //   logout: () => void;
// //   refreshAccessToken: () => Promise<boolean>;
// //   loading: boolean;
// // }

// // interface AuthProviderProps {
// //   children: ReactNode;
// // }
// // const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // export function AuthProvider({ children }: AuthProviderProps) {
// //   const [user, setUser] = useState<User | null>(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     function init() {
// //       const savedUser = getCurrentUser();
// //       setUser(savedUser);
// //       setLoading(false);
// //     }

// //     init();
// //   }, []);

// //   const contextValue: AuthContextType = {
// //     user,
// //     loading,
// //     login: async (email: string, password: string) => {
// //       await login(email, password);
// //       setUser(getCurrentUser());
// //     },
// //     register: async (email: string, password: string) => {
// //       await register(email, password);
// //       setUser(getCurrentUser());
// //     },
// //     logout: apiLogout,
// //     refreshAccessToken,
// //   };

// //   return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
// // }

// // export const useAuth = () => {
// //   const context = useContext(AuthContext);
// //   if (!context) {
// //     throw new Error('useAuth must be used within AuthProvider');
// //   }
// //   return context;
// // };

// // src/context/AuthContext.tsx
// import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
// import type { User } from '../types/todo';
// import {
//   login,
//   register,
//   refreshAccessToken,
//   logout as apiLogout,
//   getCurrentUser,
// } from '../services/api';

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   register: (email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
//   refreshAccessToken: () => Promise<boolean>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Восстанавливаем пользователя из localStorage
//     const savedUser = getCurrentUser();
//     setUser(savedUser);
//     setLoading(false);
//   }, []);

//   const contextValue: AuthContextType = {
//     user,
//     loading,
//     login: async (email: string, password: string) => {
//       await login(email, password);
//       setUser(getCurrentUser());
//     },
//     register: async (email: string, password: string) => {
//       await register(email, password);
//       setUser(getCurrentUser());
//     },
//     logout: apiLogout,
//     refreshAccessToken,
//   };

//   return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };
