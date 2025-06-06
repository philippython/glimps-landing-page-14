import { UserData, VenueData, fetchLoginTokenFromApi } from "@/service/fetchLoginTokenFromApi";
import { createContext, useContext, useEffect, useState } from "react";

export interface AuthContextType {
  user: UserData | null;
  venue: VenueData | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  setUserAndVenueAfterCreation: (venue: VenueData) => void;
}

type AuthProviderProps = {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  venue: null,
  token: null,
  login: async () => { },
  logout: () => { },
  loading: true,
  setUserAndVenueAfterCreation: () => { }
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [venue, setVenue] = useState<VenueData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // check login status on page load
  useEffect(() => {
    const user = localStorage.getItem("user");
    const venue = localStorage.getItem("venue");
    const token = localStorage.getItem("token");
    if (user && token && venue) {
      setUser(JSON.parse(user));
      setVenue(JSON.parse(venue));
      setToken(token);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetchLoginTokenFromApi(email, password);
      setToken(res.access_token);
      setUser(res.venue?.owner ?? null);
      setVenue(res.venue);
      localStorage.setItem("token", res.access_token);
      localStorage.setItem("user", JSON.stringify(res.venue?.owner ?? null));
      localStorage.setItem("venue", JSON.stringify(res.venue));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const setUserAndVenueAfterCreation = (venue: VenueData) => {
    setUser(venue.owner);
    setVenue(venue);
    localStorage.setItem("user", JSON.stringify(venue.owner));
    localStorage.setItem("venue", JSON.stringify(venue));
  }

  const logout = () => {
    setUser(null);
    setVenue(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("venue");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, venue, token, loading, login, logout, setUserAndVenueAfterCreation }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);