import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.js";
import { Menu, X } from "lucide-react";
import "./NavBar.css";

const NavBar = () => {
  const { logout } = useUser();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const renderNavLink = (to, text) => (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? "link active" : "link")}
      onClick={() => setIsMenuOpen(false)}
    >
      {text}
    </NavLink>
  );

  return (
    <nav className="nav">
      <div className="container">
        <NavLink to="/home" className="logo">
          BookWorm
        </NavLink>
        <button
          className="menuButton"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className={`navLinks ${isMenuOpen ? "show" : ""}`}>
          {renderNavLink("/home", "Home")}
          {renderNavLink("/reading-list", "Reading List")}
          {renderNavLink("/dashboard", "Dashboard")}
          <button onClick={handleLogout} className="logoutButton">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
