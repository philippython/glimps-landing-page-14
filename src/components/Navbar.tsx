import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import LanguagePicker from "./LanguagePicker";
import LogoWithText from "./LogoWithText";
import { FormattedMessage } from 'react-intl';

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
    { name: <FormattedMessage id="common.navbar.home" />, path: "/" },
    // { name: <FormattedMessage id="common.navbar.pricing" />, path: "/pricing" },
    { name: <FormattedMessage id="common.navbar.about" />, path: "/about" },
  ];

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled
        ? "bg-white/80 backdrop-blur-md shadow-sm py-3"
        : "bg-transparent py-5"
        }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <LogoWithText />

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-base font-medium transition-colors hover:text-glimps-accent ${isActive ? "text-glimps-accent" : "text-glimps-700"
                } link-underline`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {/* Language Dropdown */}
          <LanguagePicker />

          <NavLink
            to="/login"
            className="text-base font-medium text-glimps-700 hover:text-glimps-accent transition-colors"
          >
            <FormattedMessage id="common.navbar.login" />
          </NavLink>
          <NavLink
            to="/register"
            className="inline-flex h-10 items-center justify-center rounded-md bg-glimps-900 px-6 text-sm font-medium text-white transition-colors hover:bg-glimps-800 focus:outline-none focus:ring-2 focus:ring-glimps-accent focus:ring-offset-2"
          >
            <FormattedMessage id="common.navbar.getStarted" />
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
        className={`md:hidden fixed inset-0 z-40 bg-white w-full transition-transform duration-300 ease-in-out transform ${isOpen ? "translate-x-0" : "-translate-x-full"
          } pt-20`}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col space-y-4 mt-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-lg py-3 border-b border-gray-100 ${isActive ? "text-glimps-accent" : "text-glimps-800"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}

            {/* Mobile Language Selector */}
            <LanguagePicker />

            <NavLink
              to="/login"
              className="text-lg py-3 border-b border-gray-100 text-glimps-800"
              onClick={() => setIsOpen(false)}
            >
              <FormattedMessage id="common.navbar.login" />
            </NavLink>
            <NavLink
              to="/register"
              className="mt-4 w-full inline-flex h-12 items-center justify-center rounded-md bg-glimps-900 px-6 text-base font-medium text-white transition-colors hover:bg-glimps-800 focus:outline-none"
              onClick={() => setIsOpen(false)}
            >
              <FormattedMessage id="common.navbar.getStarted" />
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
