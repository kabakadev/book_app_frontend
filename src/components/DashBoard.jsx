import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext.js";
import { useNavigate } from "react-router-dom";
import { BookOpen, List, Star } from "lucide-react";
import NavBar from "./NavBar.jsx";

const Dashboard = () => {
  const { user, isAuthenticated, loading, logout } = useUser();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://book-app-backend-mp22.onrender.com";

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    } else if (user && user.id) {
      fetch(`${API_URL}/users/${user.id}`, {
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

  if (loading || isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-12 h-12 border-4 border-card border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="bg-background min-h-screen text-text-primary font-serif">
      <NavBar />
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-primary mb-8">
          Welcome, {user.username}!
        </h1>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center">
            <Star className="mr-2 text-primary" />
            Recent Reviews
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userData?.reviews?.map((review) => (
              <div
                key={review.id}
                className="bg-card rounded-lg p-6 shadow-md transition-transform duration-300 ease-in-out hover:transform hover:scale-105"
              >
                <h3 className="text-xl font-bold text-primary mb-2">
                  {review.book.title}
                </h3>
                <p className="text-text-secondary mb-4">{review.review_text}</p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating
                          ? "text-accent"
                          : "text-text-secondary"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-text-secondary">
                    {review.rating}/5
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center">
            <List className="mr-2 text-primary" />
            My Reading Lists
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userData?.reading_lists?.map((list) => (
              <div
                key={list.id}
                className="bg-card rounded-lg p-6 shadow-md transition-transform duration-300 ease-in-out hover:transform hover:scale-105"
              >
                <h3 className="text-xl font-bold text-primary mb-2">
                  {list.name}
                </h3>
                <ul className="list-none p-0">
                  {list.books.map((book) => (
                    <li key={book.id} className="flex items-start mb-2">
                      <BookOpen className="w-5 h-5 mr-2 text-secondary flex-shrink-0" />
                      <span className="text-text-secondary">
                        {book.book.title} by {book.book.author}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center">
            <BookOpen className="mr-2 text-primary" />
            Recommendations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg p-6 shadow-md transition-transform duration-300 ease-in-out hover:transform hover:scale-105">
              <h3 className="text-xl font-bold text-primary mb-2">
                You Don't Know JS Yet
              </h3>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-accent" />
                ))}
                <span className="ml-2 text-text-secondary">5/5</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
