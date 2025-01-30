import { useUser } from "../context/UserContext.js";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Dashboard = () => {
    const { user, isAuthenticated, loading } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/login"); // Redirect if not logged in
        }
    }, [isAuthenticated, loading, navigate]);

    if (loading) return <p>Checking authentication...</p>;
    if (!isAuthenticated) return null; // Prevent rendering until redirect

    return <h1>Welcome, {user.username}!</h1>;
};

export default Dashboard;
