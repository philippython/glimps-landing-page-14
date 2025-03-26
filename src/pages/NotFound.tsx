
import { useLocation, NavLink } from "react-router-dom";
import { useEffect } from "react";
import { Image } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-4 animate-fade-in">
      <NavLink to="/" className="flex items-center gap-2 mb-12">
        <div className="flex items-center justify-center rounded-md bg-glimps-900 p-1.5">
          <Image className="h-5 w-5 text-white" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-glimps-900">
          Glimps
        </span>
      </NavLink>

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
