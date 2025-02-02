import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.js";
import NavBar from "./NavBar";
import { Star, Edit, Trash2 } from "lucide-react";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading, user } = useUser();
  const [book, setBook] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [editedRating, setEditedRating] = useState(0);
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://book-app-backend-mp22.onrender.com";

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    } else if (isAuthenticated) {
      fetch(`${API_URL}/books/${id}`, {
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          setBook(data);
          setReviews(data.reviews || []);
        })
        .catch((error) => {
          console.error("Error fetching book details:", error);
        });
    }
  }, [id, isAuthenticated, loading, navigate]);

  const handleAddReview = () => {
    const existingReview = reviews.find((review) => review.user_id === user.id);

    if (existingReview) {
      alert("User has already reviewed this book");
      return;
    }

    const payload = {
      user_id: user.id,
      book_id: Number.parseInt(id),
      review_text: reviewText,
      rating: rating,
    };

    fetch(`${API_URL}/reviews`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        setReviews([...reviews, data]);
        setReviewText("");
        setRating(0);
      })
      .catch((error) => {
        console.error("Error adding review:", error);
      });
  };

  const handleEditClick = (review) => {
    setEditingReviewId(review.id);
    setEditedText(review.review_text);
    setEditedRating(review.rating);
  };

  const handleEditReview = (reviewId) => {
    fetch(`${API_URL}/reviews/${reviewId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        review_text: editedText,
        rating: editedRating,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setReviews(
          reviews.map((review) => (review.id === reviewId ? data : review))
        );
        setEditingReviewId(null);
      })
      .catch((error) => {
        console.error("Error updating review:", error);
      });
  };

  const handleDeleteReview = (reviewId) => {
    fetch(`${API_URL}/reviews/${reviewId}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(() => {
        setReviews(reviews.filter((review) => review.id !== reviewId));
      })
      .catch((error) => {
        console.error("Error deleting review:", error);
      });
  };

  const containerStyle = {
    backgroundColor: "#1a1a1a",
    minHeight: "100vh",
    color: "#e0e0e0",
    fontFamily: "Georgia, serif",
  };

  const contentStyle = {
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const bookDetailsStyle = {
    display: "flex",
    flexDirection: "row",
    gap: "2rem",
    marginBottom: "2rem",
  };

  const bookImageStyle = {
    maxWidth: "300px",
    height: "auto",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  const bookInfoStyle = {
    flex: 1,
  };

  const headingStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#c19a6b",
    marginBottom: "0.5rem",
  };

  const subheadingStyle = {
    fontSize: "1.5rem",
    color: "#d8b384",
    marginBottom: "0.5rem",
  };

  const textStyle = {
    fontSize: "1rem",
    color: "#b0bec5",
    marginBottom: "0.5rem",
  };

  const reviewSectionStyle = {
    marginTop: "2rem",
  };

  const reviewHeadingStyle = {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#c19a6b",
    marginBottom: "1rem",
  };

  const reviewCardStyle = {
    backgroundColor: "#2c2c2c",
    borderRadius: "8px",
    padding: "1rem",
    marginBottom: "1rem",
  };

  const buttonStyle = {
    backgroundColor: "#8f7e4f",
    color: "#1a1a1a",
    border: "none",
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    fontFamily: "Georgia, serif",
    cursor: "pointer",
    marginRight: "0.5rem",
    transition: "background-color 0.3s ease",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.5rem",
    marginBottom: "1rem",
    backgroundColor: "#2c2c2c",
    border: "1px solid #8f7e4f",
    borderRadius: "4px",
    color: "#e0e0e0",
    fontSize: "1rem",
  };

  const starContainerStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "0.5rem",
  };

  const starStyle = {
    color: "#d8b384",
    marginRight: "0.25rem",
    cursor: "pointer",
  };

  const renderStars = (value, onChange) => {
    return (
      <div style={starContainerStyle}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            style={{
              ...starStyle,
              fill: star <= value ? "#d8b384" : "none",
            }}
            onClick={() => onChange && onChange(star)}
          />
        ))}
      </div>
    );
  };

  if (!book) {
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

  return (
    <div style={containerStyle}>
      <NavBar />
      <div style={contentStyle}>
        <div style={bookDetailsStyle}>
          <img
            src={book.image_url || "/placeholder.svg"}
            alt={book.title}
            style={bookImageStyle}
          />
          <div style={bookInfoStyle}>
            <h1 style={headingStyle}>{book.title}</h1>
            <h2 style={subheadingStyle}>{book.author}</h2>
            <p style={textStyle}>{book.genre}</p>
            <p style={textStyle}>{book.publication_year}</p>
            <p style={textStyle}>{book.page_count} pages</p>
          </div>
        </div>

        <div style={reviewSectionStyle}>
          <h2 style={reviewHeadingStyle}>Reviews</h2>
          {reviews.map((review) => (
            <div key={review.id} style={reviewCardStyle}>
              {editingReviewId === review.id ? (
                <div>
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    style={inputStyle}
                  />
                  {renderStars(editedRating, setEditedRating)}
                  <div>
                    <button
                      style={buttonStyle}
                      onClick={() => handleEditReview(review.id)}
                    >
                      Save
                    </button>
                    <button
                      style={{
                        ...buttonStyle,
                        backgroundColor: "#2c2c2c",
                        color: "#e0e0e0",
                      }}
                      onClick={() => setEditingReviewId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p style={textStyle}>{review.review_text}</p>
                  {renderStars(review.rating)}
                  {review.user_id === user.id && (
                    <div>
                      <button
                        style={buttonStyle}
                        onClick={() => handleEditClick(review)}
                      >
                        <Edit size={16} style={{ marginRight: "0.25rem" }} />
                        Edit
                      </button>
                      <button
                        style={{ ...buttonStyle, backgroundColor: "#d8b384" }}
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        <Trash2 size={16} style={{ marginRight: "0.25rem" }} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: "2rem" }}>
          <textarea
            placeholder="Add a Review"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            style={inputStyle}
          />
          {renderStars(rating, setRating)}
          <button
            style={buttonStyle}
            onClick={handleAddReview}
            disabled={reviews.some((review) => review.user_id === user.id)}
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
