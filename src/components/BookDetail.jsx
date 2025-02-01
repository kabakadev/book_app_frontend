import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  TextField,
  Rating,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import { useUser } from "../context/UserContext.js";
import NavBar from "./NavBar";

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
      book_id: parseInt(id),
      review_text: reviewText,
      rating: rating,
    };

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
    fetch(`http://127.0.0.1:5000/reviews/${reviewId}`, {
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

  if (!book) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <NavBar />
      <Box display="flex" flexDirection="row" gap={4} mb={4}>
        <Box>
          <img
            src={book.image_url}
            alt={book.title}
            style={{ maxWidth: "300px", margin: "20px 0" }}
          />
        </Box>
        <Box>
          <Typography variant="h3">{book.title}</Typography>
          <Typography variant="h5">{book.author}</Typography>
          <Typography variant="body1">{book.genre}</Typography>
          <Typography variant="body1">{book.publication_year}</Typography>
          <Typography variant="body1">{book.page_count} pages</Typography>
        </Box>
      </Box>

      <Typography variant="h4" mb={2}>
        Reviews
      </Typography>
      {reviews.map((review) => (
        <Card key={review.id} style={{ marginBottom: "16px" }}>
          <CardContent>
            {editingReviewId === review.id ? (
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  fullWidth
                />
                <Rating
                  value={editedRating}
                  onChange={(e, newValue) => setEditedRating(newValue)}
                />
                <Box display="flex" gap={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditReview(review.id)}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setEditingReviewId(null)}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box>
                <Typography variant="body1">{review.review_text}</Typography>
                <Rating value={review.rating} readOnly />
                {review.user_id === user.id && (
                  <Box display="flex" gap={2} mt={2}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEditClick(review)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      ))}

      <Box mt={4}>
        <TextField
          label="Add a Review"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Rating
          value={rating}
          onChange={(e, newValue) => setRating(newValue)}
          style={{ marginBottom: "16px" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddReview}
          disabled={reviews.some((review) => review.user_id === user.id)}
        >
          Submit Review
        </Button>
      </Box>
    </div>
  );
};

export default BookDetail;
