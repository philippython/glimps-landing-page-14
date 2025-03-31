
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserPlus, Eye, EyeOff, Image } from "lucide-react";
import LogoWithText from "@/components/LogoWithText";
import VenueSettings from "@/components/VenueSettings";

type Steps = "register" | "venue";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<Steps>("venue");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // In a real app, this would register with a backend
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated delay

      // Simulate successful registration
      setStep("venue");
    } catch (err) {
      setError("An error occurred during registration. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      {step == "register" && (
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <LogoWithText />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-glimps-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-glimps-600">
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="font-medium text-glimps-accent hover:text-glimps-accent/90"
              >
                Sign in
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
                <label htmlFor="name" className="block text-sm font-medium text-glimps-700">
                  Username
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-glimps-900 placeholder-glimps-400 focus:border-glimps-accent focus:outline-none focus:ring-glimps-accent sm:text-sm"
                  placeholder="johndoe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-glimps-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-glimps-900 placeholder-glimps-400 focus:border-glimps-accent focus:outline-none focus:ring-glimps-accent sm:text-sm"
                  placeholder="johndoe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-glimps-700">
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-glimps-900 placeholder-glimps-400 focus:border-glimps-accent focus:outline-none focus:ring-glimps-accent sm:text-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
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
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-glimps-700">
                  Confirm Password
                </label>
                <div className="relative mt-1">
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-glimps-900 placeholder-glimps-400 focus:border-glimps-accent focus:outline-none focus:ring-glimps-accent sm:text-sm"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-glimps-400"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* ToS tickbox */}
            {/* <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 rounded border-gray-300 text-glimps-accent focus:ring-glimps-accent"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-glimps-700">
              I agree to the{" "}
              <a href="#" className="font-medium text-glimps-accent hover:text-glimps-accent/90">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="font-medium text-glimps-accent hover:text-glimps-accent/90">
                Privacy Policy
              </a>
            </label>
          </div> */}

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-glimps-900 py-2 px-4 text-sm font-medium text-white hover:bg-glimps-800 focus:outline-none focus:ring-2 focus:ring-glimps-accent focus:ring-offset-2"
                disabled={loading}
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <UserPlus className="h-5 w-5 text-glimps-500 group-hover:text-glimps-400" aria-hidden="true" />
                </span>
                {loading ? "Creating account..." : "Create account"}
              </button>
            </div>
          </form>

        </div>
      )}

      {step == "venue" && <VenueSettings mode="create" loading={loading} />}

    </div>
  );
};

export default Register;
