
import { useLocation, NavLink } from "react-router-dom";
import { Image } from "lucide-react";
import LogoWithText from "@/components/LogoWithText";
import { FormattedMessage } from "react-intl";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-4 animate-fade-in">
      <div className="text-center max-w-xl mt-5">
        <h1 className="text-6xl font-bold text-glimps-900 mb-6">404</h1>
        <p className="text-xl text-glimps-600 mb-8">
          <FormattedMessage id="notFound.message" />
        </p>
        <NavLink
          to="/"
          className="inline-flex h-12 items-center justify-center rounded-md bg-glimps-900 px-8 text-base font-medium text-white transition-colors hover:bg-glimps-800 focus:outline-none focus:ring-2 focus:ring-glimps-accent focus:ring-offset-2"
        >
          <FormattedMessage id="notFound.button" />
        </NavLink>
      </div>
    </div>
  );
};

export default NotFound;
