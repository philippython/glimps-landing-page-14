
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Image, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [language, setLanguage] = useState("English");

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

  const languages = [
    { name: "English", code: "en" },
    { name: "Español", code: "es" },
    { name: "Français", code: "fr" },
    { name: "Deutsch", code: "de" },
  ];

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    // Here you would typically call a function to change the app's language
    console.log(`Language changed to ${lang}`);
  };

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-md bg-glimps-900 p-1.5">
            <Image className="h-5 w-5 text-white" />
          </div>
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

        <div className="hidden md:flex items-center space-x-4">
          {/* Language Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center text-glimps-700 hover:text-glimps-accent transition-colors">
              <Globe className="h-5 w-5 mr-1" />
              <span className="text-base font-medium">{language}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              {languages.map((lang) => (
                <DropdownMenuItem 
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.name)}
                  className="cursor-pointer"
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <NavLink
            to="/login"
            className="text-base font-medium text-glimps-700 hover:text-glimps-accent transition-colors"
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
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
            
            {/* Mobile Language Selector */}
            <div className="py-3 border-b border-gray-100">
              <div className="flex items-center text-glimps-800 mb-2">
                <Globe className="h-5 w-5 mr-2" />
                <span>Language</span>
              </div>
              <div className="pl-7 flex flex-col space-y-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`text-left ${
                      language === lang.name ? "text-glimps-accent font-medium" : "text-glimps-700"
                    }`}
                    onClick={() => {
                      handleLanguageChange(lang.name);
                      setIsOpen(false);
                    }}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
            
            <NavLink
              to="/login"
              className="text-lg py-3 border-b border-gray-100 text-glimps-800"
              onClick={() => setIsOpen(false)}
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
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
