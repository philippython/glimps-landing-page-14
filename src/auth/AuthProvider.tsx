import { fetchLoginTokenFromApi } from "@/service/fetchLoginTokenFromApi";
import { set } from "date-fns";
import { createContext, useContext, useEffect, useState } from "react";

export type User = {
  email: string;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

type AuthProviderProps = {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // check login status on page load
  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
      setUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    console.log("User:", user);
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetchLoginTokenFromApi(email, password);
      setUser(res.venue);
      localStorage.setItem("user", JSON.stringify(res.venue));
      localStorage.setItem("token", res.access_token);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);