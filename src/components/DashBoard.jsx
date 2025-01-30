import { useUser } from "../context/UserContext.js";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ReviewsList from "./ReviewsList.jsx";

function DashBoard (){
    const { user, isAuthenticated, loading } = useUser();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/login"); 
        } else if (user && user.id) {
            fetch(`http://127.0.0.1:5000/users/${user.id}`, {
                credentials: "include",
            })
                .then((response) => response.json())
                .then((data) => {
                    setUserData(data);
                    setIsFetching(false);
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                    setIsFetching(false);
                });
        }
    }, [isAuthenticated, loading, navigate, user]);

    if (loading || isFetching) return <p>Loading...</p>;
    if (!isAuthenticated) return null;

    return (
        <div>
            <h1>Welcome, {user.username}!</h1>

         
            <div>
                <h2>Recent Reviews</h2>
                <ReviewsList />
            </div>

           
            <div>
                <h2>My Reading Lists</h2>
                <ul>
                    {userData?.reading_lists?.map((list) => (
                        <li key={list.id}>
                            <h3>{list.name}</h3>
                            <ul>
                                {list.books.map((book) => (
                                    <li key={book.id}>{book.book.title} by {book.book.author}</li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DashBoard;
