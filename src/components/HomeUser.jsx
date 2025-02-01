import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext.js";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar.jsx";
import { Plus, Search } from "lucide-react";

const HomeUser = () => {
  const { user, isAuthenticated, loading } = useUser();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    } else {
      fetch("http://127.0.0.1:5000/books", {
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          setBooks(data);
          console.log("Books fetched:", data);
          setIsFetching(false);
        })
        .catch((error) => {
          console.error("Error fetching books:", error);
          setIsFetching(false);
        });
    }
  }, [isAuthenticated, loading, navigate]);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerStyle = {
    backgroundColor: "#1a1a1a",
    minHeight: "100vh",
    color: "#e0e0e0",
    fontFamily: "Georgia, serif",
  };

  const contentStyle = {
    padding: "2rem",
  };

  const headingStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#c19a6b",
    marginBottom: "2rem",
  };

  const searchContainerStyle = {
    marginBottom: "2rem",
    position: "relative",
  };

  const searchInputStyle = {
    width: "100%",
    padding: "0.75rem",
    paddingLeft: "2.5rem",
    backgroundColor: "#2c2c2c",
    border: "1px solid #8f7e4f",
    borderRadius: "4px",
    color: "#e0e0e0",
    fontSize: "1rem",
  };

  const searchIconStyle = {
    position: "absolute",
    left: "0.75rem",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#8f7e4f",
  };

  const addButtonStyle = {
    backgroundColor: "#8f7e4f",
    color: "#1a1a1a",
    border: "none",
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    fontFamily: "Georgia, serif",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    transition: "background-color 0.3s ease",
    marginBottom: "2rem",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "1.5rem",
  };

  const cardStyle = {
    backgroundColor: "#2c2c2c",
    borderRadius: "8px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const cardImageStyle = {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  };

  const cardContentStyle = {
    padding: "1rem",
    flexGrow: 1,
  };

  const cardTitleStyle = {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#c19a6b",
    marginBottom: "0.5rem",
  };

  const cardTextStyle = {
    color: "#b0bec5",
    marginBottom: "0.5rem",
  };

  const viewButtonStyle = {
    backgroundColor: "#8f7e4f",
    color: "#1a1a1a",
    border: "none",
    padding: "0.5rem",
    width: "100%",
    fontSize: "1rem",
    fontFamily: "Georgia, serif",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  const loadMoreStyle = {
    backgroundColor: "transparent",
    border: "1px solid #8f7e4f",
    color: "#8f7e4f",
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    fontFamily: "Georgia, serif",
    cursor: "pointer",
    transition: "background-color 0.3s ease, color 0.3s ease",
    marginTop: "2rem",
  };

  if (loading || isFetching) {
    return (
      <div
        style={{
          ...containerStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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

  return (
    <div style={containerStyle}>
      <NavBar />
      <div style={contentStyle}>
        <h1 style={headingStyle}>Home</h1>

        <div style={searchContainerStyle}>
          <input
            type="text"
            placeholder="Search..."
            style={searchInputStyle}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search style={searchIconStyle} size={20} />
        </div>

        <button style={addButtonStyle} onClick={() => navigate("/addbook")}>
          <Plus style={{ marginRight: "0.5rem" }} />
          Add New Book
        </button>

        <div style={gridStyle}>
          {filteredBooks.map((book) => (
            <div key={book.id} style={cardStyle}>
              <img
                src={book.image_url || "/placeholder.svg"}
                alt={book.title}
                style={cardImageStyle}
              />
              <div style={cardContentStyle}>
                <h2 style={cardTitleStyle}>{book.title}</h2>
                <p style={cardTextStyle}>
                  {book.author} ({book.publication_year})
                </p>
                <p style={cardTextStyle}>{book.genre}</p>
                <p style={cardTextStyle}>{book.pages_count} pages</p>
              </div>
              <button
                style={viewButtonStyle}
                onClick={() => navigate(`/books/${book.id}`)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <button style={loadMoreStyle}>Load More</button>
        </div>
      </div>
    </div>
  );
};

export default HomeUser;
