import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.js";

const NavBar = () => {
    const {logout} = useUser();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    }
}