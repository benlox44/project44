export interface AuthContextType {
  isLoggedIn: boolean;
  userEmail: string | null;
  login: (token: string) => void;
  logout: () => void;
}
