import { UserData, VenueData, fetchLoginTokenFromApi } from "@/service/fetchLoginTokenFromApi";
import { createContext, useContext, useEffect, useState } from "react";

export interface AuthContextType {
  user: UserData | null;
  venue: VenueData | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

type AuthProviderProps = {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  venue: null,
  login: async () => { },
  logout: () => { },
  loading: false,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [venue, setVenue] = useState<VenueData | null>(null);
  const [loading, setLoading] = useState(false);

  // check login status on page load
  useEffect(() => {
    setLoading(true);
    const user = localStorage.getItem("user");
    const venue = localStorage.getItem("venue");
    const token = localStorage.getItem("token");
    if (user && token && venue) {
      setUser(JSON.parse(user));
      setVenue(JSON.parse(venue));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    console.log("User:", user);
    console.log("Venue:", venue);
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const res = await fetchLoginTokenFromApi(email, password);
      setUser(res.venue.owner);
      setVenue(res.venue);
      localStorage.setItem("user", JSON.stringify(res.venue.owner));
      localStorage.setItem("venue", JSON.stringify(res.venue));
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
    setVenue(null);
    localStorage.removeItem("user");
    localStorage.removeItem("venue");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, venue, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);