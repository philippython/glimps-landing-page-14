import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function ProtectedRoute() {
  const { token, venue, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" />
  } else if (!venue) {
    return <Navigate to="/venue-creation" />
  } else {
    return <Outlet />;
  }
};
