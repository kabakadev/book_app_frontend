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
  const API_URL = import.meta.env.VITE_API_URL;

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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#1a1a1a",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "4px solid #2c2c2c",
            borderTop: "4px solid #c19a6b",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const containerStyle = {
    backgroundColor: "#1a1a1a",
    minHeight: "100vh",
    color: "#e0e0e0",
    fontFamily: "Georgia, serif",
  };

  const contentStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
  };

  const headingStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#c19a6b",
    marginBottom: "2rem",
  };

  const sectionStyle = {
    marginBottom: "3rem",
  };

  const sectionHeadingStyle = {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#8f7e4f",
    marginBottom: "1.5rem",
    display: "flex",
    alignItems: "center",
  };

  const cardContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
  };

  const cardStyle = {
    backgroundColor: "#2c2c2c",
    borderRadius: "8px",
    padding: "1.5rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const cardTitleStyle = {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#c19a6b",
    marginBottom: "0.5rem",
  };

  const cardTextStyle = {
    color: "#b0bec5",
    marginBottom: "1rem",
  };

  return (
    <div style={containerStyle}>
      <NavBar />
      <div style={contentStyle}>
        <h1 style={headingStyle}>Welcome, {user.username}!</h1>

        <section style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>
            <Star style={{ marginRight: "0.5rem", color: "#c19a6b" }} />
            Recent Reviews
          </h2>
          <div style={cardContainerStyle}>
            {userData?.reviews?.map((review) => (
              <div key={review.id} style={cardStyle}>
                <h3 style={cardTitleStyle}>{review.book.title}</h3>
                <p style={cardTextStyle}>{review.review_text}</p>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      style={{
                        width: "20px",
                        height: "20px",
                        color: i < review.rating ? "#d8b384" : "#b0bec5",
                      }}
                    />
                  ))}
                  <span style={{ marginLeft: "0.5rem", color: "#b0bec5" }}>
                    {review.rating}/5
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>
            <List style={{ marginRight: "0.5rem", color: "#c19a6b" }} />
            My Reading Lists
          </h2>
          <div style={cardContainerStyle}>
            {userData?.reading_lists?.map((list) => (
              <div key={list.id} style={cardStyle}>
                <h3 style={cardTitleStyle}>{list.name}</h3>
                <ul style={{ listStyleType: "none", padding: 0 }}>
                  {list.books.map((book) => (
                    <li
                      key={book.id}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <BookOpen
                        style={{
                          width: "20px",
                          height: "20px",
                          marginRight: "0.5rem",
                          color: "#8f7e4f",
                        }}
                      />
                      <span style={cardTextStyle}>
                        {book.book.title} by {book.book.author}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>
            <BookOpen style={{ marginRight: "0.5rem", color: "#c19a6b" }} />
            Recommendations
          </h2>
          <div style={cardContainerStyle}>
            <div style={cardStyle}>
              <h3 style={cardTitleStyle}>You Don't Know JS Yet</h3>
              <div style={{ display: "flex", alignItems: "center" }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    style={{
                      width: "20px",
                      height: "20px",
                      color: "#d8b384",
                    }}
                  />
                ))}
                <span style={{ marginLeft: "0.5rem", color: "#b0bec5" }}>
                  5/5
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
