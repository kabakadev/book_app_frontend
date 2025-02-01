import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.js";

const NavBar = () => {
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navStyle = {
    backgroundColor: "#1a1a1a",
    padding: "1rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const linkContainerStyle = {
    display: "flex",
    gap: "2rem",
  };

  const linkStyle = {
    color: "#e0e0e0",
    textDecoration: "none",
    fontSize: "1.1rem",
    fontFamily: "Georgia, serif",
    transition: "color 0.3s ease",
  };

  const activeLinkStyle = {
    ...linkStyle,
    color: "#c19a6b",
    borderBottom: "2px solid #c19a6b",
  };

  const logoutButtonStyle = {
    backgroundColor: "#8f7e4f",
    color: "#1a1a1a",
    border: "none",
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    fontFamily: "Georgia, serif",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <div style={linkContainerStyle}>
          <NavLink
            to="/home"
            style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}
            onMouseEnter={(e) => (e.target.style.color = "#d8b384")}
            onMouseLeave={(e) =>
              (e.target.style.color = e.target.className.includes("active")
                ? "#c19a6b"
                : "#e0e0e0")
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/reading-list"
            style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}
            onMouseEnter={(e) => (e.target.style.color = "#d8b384")}
            onMouseLeave={(e) =>
              (e.target.style.color = e.target.className.includes("active")
                ? "#c19a6b"
                : "#e0e0e0")
            }
          >
            Reading List
          </NavLink>
          <NavLink
            to="/dashboard"
            style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}
            onMouseEnter={(e) => (e.target.style.color = "#d8b384")}
            onMouseLeave={(e) =>
              (e.target.style.color = e.target.className.includes("active")
                ? "#c19a6b"
                : "#e0e0e0")
            }
          >
            Dashboard
          </NavLink>
        </div>
        <button
          onClick={handleLogout}
          style={logoutButtonStyle}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#c19a6b")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#8f7e4f")}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
