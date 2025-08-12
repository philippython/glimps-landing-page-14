import { NavLink } from "react-router-dom";

export default function LogoWithText() {
  return (
    <NavLink to="/" className="inline-flex items-center justify-center">
      <img 
        src="/favicon.ico" 
        alt="Logo" 
        className="h-8 w-8 object-contain"
      />
    </NavLink>
  )
}
