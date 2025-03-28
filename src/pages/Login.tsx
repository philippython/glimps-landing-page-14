
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogIn, Eye, EyeOff, Image } from "lucide-react";
import { useAuth } from "@/auth/AuthProvider";
import { FormattedMessage } from "react-intl";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, login } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === "admin") {
      navigate("/admin-dashboard");
    }

    if (user && user.role === "renter") {
      navigate("/venue-dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <NavLink to="/" className="inline-flex items-center gap-2 mb-6 justify-center">
            <div className="flex items-center justify-center rounded-md bg-glimps-900 p-1.5">
              <Image className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-glimps-900">
              Glimps
            </span>
          </NavLink>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-glimps-900">
            <FormattedMessage id="login.title" />
          </h2>
          <p className="mt-2 text-sm text-glimps-600">
            <FormattedMessage id="login.optionalTitle.or" />{" "}
            <NavLink
              to="/register"
              className="font-medium text-glimps-accent hover:text-glimps-accent/90"
            >
              <FormattedMessage id="login.optionalTitle.createAnAccount" />
            </NavLink>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-glimps-700">
                <FormattedMessage id="login.form.username" />
              </label>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-glimps-900 placeholder-glimps-400 focus:border-glimps-accent focus:outline-none focus:ring-glimps-accent sm:text-sm"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500">
                <FormattedMessage id="login.form.usernameTips" />
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-glimps-700">
                <FormattedMessage id="login.form.password" />
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-glimps-900 placeholder-glimps-400 focus:border-glimps-accent focus:outline-none focus:ring-glimps-accent sm:text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-glimps-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {/* <p className="mt-1 text-xs text-gray-500">
                Use any password (this is a demo)
              </p> */}
            </div>
          </div>

          {/* Remember creadential and forgot password. not implemented */}
          {/* <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-glimps-accent focus:ring-glimps-accent"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-glimps-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-glimps-accent hover:text-glimps-accent/90">
                Forgot your password?
              </a>
            </div>
          </div> */}

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-glimps-900 py-2 px-4 text-sm font-medium text-white hover:bg-glimps-800 focus:outline-none focus:ring-2 focus:ring-glimps-accent focus:ring-offset-2"
              disabled={loading}
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <LogIn className="h-5 w-5 text-glimps-500 group-hover:text-glimps-400" aria-hidden="true" />
              </span>
              {loading
                ? <FormattedMessage id="login.form.button.loading" />
                : <FormattedMessage id="login.form.button.signIn" />}
            </button>
          </div>
        </form>

        {/* <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-glimps-600">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-glimps-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-glimps-accent focus:ring-offset-2"
            >
              <span className="sr-only">Sign in with Google</span>
              <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                />
              </svg>
            </button>
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-glimps-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-glimps-accent focus:ring-offset-2"
            >
              <span className="sr-only">Sign in with Microsoft</span>
              <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M11.4 4.8H4.8v6.6h6.6V4.8zm0 7.8H4.8v6.6h6.6v-6.6zm1.2-7.8v6.6h6.6V4.8h-6.6zm6.6 7.8h-6.6v6.6h6.6v-6.6z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
