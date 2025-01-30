import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.js";

const NavBar = () => {
    const {logout} = useUser();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };
    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex space-x-8">
                        <NavLink to={"/"} className={({isActive}) =>  `text-lg font-medium ${
                  isActive ? "text-blue-600" : "text-gray-600"
                } hover:text-blue-600`}>Home</NavLink>
                <NavLink to="/reading-list" className={({isActive}) =>  `text-lg font-medium ${isActive ? "text-blue-600" : "text-gray-600"} hover:text-blue-600`}>Reading List</NavLink>
                </div>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ">Logout</button>
            </div>
        </div>
        </nav>
    )
}

export default NavBar