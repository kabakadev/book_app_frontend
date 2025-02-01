import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Button, TextField, Rating } from "@mui/material";
import { useUser } from "../context/UserContext.js";
import NavBar from "./NavBar";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading, user } = useUser();
  const [book, setBook] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [editedRating, setEditedRating] = useState(0);

  const handleEditClick = (review) => {
    setEditingReviewId(review.id);
    setEditedText(review.review_text);
    setEditedRating(review.rating);
  };

  // Fetch book details and reviews
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    } else if (isAuthenticated) {
      fetch(`http://127.0.0.1:5000/books/${id}`, {
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

      fetch(`http://127.0.0.1:5000/reviews`, {
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          const bookReviews = data.filter(
            (review) => review.book_id === parseInt(id)
          );
          setReviews(bookReviews);
        })
        .catch((error) => {
          console.error("Error fetching reviews:", error);
        });
    }
  }, [id, isAuthenticated, loading, navigate]);

  const handleAddReview = () => {
    // Check if the user has already reviewed this book
    const existingReview = reviews.find((review) => review.user_id === user.id);

    if (existingReview) {
      alert("User has already reviewed this book");
      return;
    }
    const payload = {
      user_id: user.id,
      book_id: parseInt(id),
      review_text: reviewText,
      rating: rating,
    };
    console.log("Sending payload:", payload);
    fetch(`http://127.0.0.1:5000/reviews`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response data:", data);
        setReviews([...reviews, data]);
        setReviewText("");
        setRating(0);
      })
      .catch((error) => {
        console.error("Error adding review:", error);
      });
  };
  const handleEditReview = (reviewId) => {
    fetch(`http://127.0.0.1:5000/reviews/${reviewId}`, {
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
        if (data.error) {
          console.error(data.error);
        } else {
          setReviews(
            reviews.map((review) => (review.id === reviewId ? data : review))
          );
          setEditingReviewId(null);
        }
      })
      .catch((error) => {
        console.error("Error updating review:", error);
      });
  };
  const handleDeleteReview = (reviewId) => {
    fetch(`http://127.0.0.1:5000/reviews/${reviewId}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          setReviews(reviews.filter((review) => review.id !== reviewId));
        }
      })
      .catch((error) => {
        console.error("Error deleting review:", error);
      });
  };

  if (!book) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <NavBar />
      <Typography variant="h3">{book.title}</Typography>
      <Typography variant="h5">{book.author}</Typography>
      <Typography variant="body1">{book.genre}</Typography>
      <Typography variant="body1">{book.publication_year}</Typography>
      <Typography variant="body1">{book.page_count} pages</Typography>

      <Typography variant="h4">Reviews</Typography>
      {reviews.map((review) => (
        <div key={review.id}>
          {editingReviewId === review.id ? (
            <div>
              <TextField
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                fullWidth
              />
              <Rating
                value={editedRating}
                onChange={(e, newValue) => setEditedRating(newValue)}
              />
              <Button onClick={() => handleEditReview(review.id)}>Save</Button>
              <Button onClick={() => setEditingReviewId(null)}>Cancel</Button>
            </div>
          ) : (
            <div>
              <Typography variant="body1">{review.review_text}</Typography>
              <Rating value={review.rating} readOnly />
              {review.user_id === user.id && (
                <div>
                  <Button onClick={() => handleEditClick(review)}>Edit</Button>
                  <Button onClick={() => handleDeleteReview(review.id)}>
                    Delete
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <TextField
        label="Add a Review"
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Rating value={rating} onChange={(e, newValue) => setRating(newValue)} />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddReview}
        disabled={reviews.some((review) => review.user_id === user.id)}
      >
        Submit Review
      </Button>
    </div>
  );
};
export default BookDetail;
