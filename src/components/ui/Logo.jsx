
import { NavLink } from 'react-router-dom';

export default function Logo({ className = '', ...props }) {
    const baseClasses = 'holidaze-logo flex items-center text-1xl font-bold';
  
    return (
      <NavLink
        to="/"
        className={`${baseClasses} ${className}`.trim()}
        {...props}
      >
        <span className="mr-0.5">H</span>
        <span className="material-symbols-outlined sun icon-interactive mx-0 text-[inherit]">
    light_mode
  </span>
        <span className="ml-0.5">lidaze</span>
      </NavLink>
    );
  }