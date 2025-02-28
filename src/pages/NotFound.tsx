
import { useLocation, NavLink } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-16 px-4 animate-fade-in">
      <div className="text-center max-w-xl">
        <h1 className="text-6xl font-bold text-glimps-900 mb-6">404</h1>
        <p className="text-xl text-glimps-600 mb-8">
          Oops! We couldn't find the page you're looking for.
        </p>
        <NavLink
          to="/"
          className="inline-flex h-12 items-center justify-center rounded-md bg-glimps-900 px-8 text-base font-medium text-white transition-colors hover:bg-glimps-800 focus:outline-none focus:ring-2 focus:ring-glimps-accent focus:ring-offset-2"
        >
          Return to Home
        </NavLink>
      </div>
    </div>
  );
};

export default NotFound;
