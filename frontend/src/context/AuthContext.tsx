'use client';

import { jwtDecode } from 'jwt-decode';
import {
  createContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
  JSX,
} from 'react';

import type { AuthContextType } from '@/types/auth';

export interface DecodedToken {
  sub: string;
  email: string;
  purpose: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const resetAuthState = useCallback((): void => {
    setIsLoggedIn(false);
    setUserEmail(null);
  }, []);

  const decodeAndSetAuth = useCallback(
    (token: string): void => {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded?.email) {
          setUserEmail(decoded.email);
          setIsLoggedIn(true);
        } else {
          throw new Error('Invalid token structure');
        }
      } catch (error) {
        console.error(
          'Failed to decode token',
          error instanceof Error ? error.message : error,
        );
        resetAuthState();
      }
    },
    [resetAuthState],
  );

  const login = useCallback(
    (token: string): void => {
      localStorage.setItem('access_token', token);
      decodeAndSetAuth(token);
    },
    [decodeAndSetAuth],
  );

  const logout = useCallback((): void => {
    localStorage.removeItem('access_token');
    resetAuthState();
  }, [resetAuthState]);

  useEffect((): void => {
    const token = localStorage.getItem('access_token');
    if (token) {
      decodeAndSetAuth(token);
    }
  }, [decodeAndSetAuth]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
