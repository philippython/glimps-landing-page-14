
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Pricing", path: "/pricing" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <NavLink to="/" className="flex items-center">
          <span className="text-2xl font-bold tracking-tight text-glimps-900">
            Glimps
          </span>
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `text-base font-medium transition-colors hover:text-glimps-accent ${
                  isActive ? "text-glimps-accent" : "text-glimps-700"
                } link-underline`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:block">
          <NavLink
            to="/pricing"
            className="inline-flex h-10 items-center justify-center rounded-md bg-glimps-900 px-6 text-sm font-medium text-white transition-colors hover:bg-glimps-800 focus:outline-none focus:ring-2 focus:ring-glimps-accent focus:ring-offset-2"
          >
            Get Started
          </NavLink>
        </div>

        {/* Mobile Navigation Toggle */}
        <button
          className="md:hidden p-2 rounded-md"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-white w-full transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } pt-20`}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col space-y-4 mt-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-lg py-3 border-b border-gray-100 ${
                    isActive ? "text-glimps-accent" : "text-glimps-800"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
            <NavLink
              to="/pricing"
              className="mt-4 w-full inline-flex h-12 items-center justify-center rounded-md bg-glimps-900 px-6 text-base font-medium text-white transition-colors hover:bg-glimps-800 focus:outline-none"
              onClick={() => setIsOpen(false)}
            >
              Get Started
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
