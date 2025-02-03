import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.js";
import NavBar from "./NavBar";
import { Star, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      toast.error("You have already reviewed this book.");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Review text cannot be empty.");
      return;
    }

    if (rating === 0 || rating === null) {
      toast.error("Please provide a rating.");
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
        toast.success("Review added successfully!");
      })
      .catch((error) => {
        console.error("Error adding review:", error);
        toast.error("Failed to add review. Please try again.");
      });
  };

  const handleEditClick = (review) => {
    setEditingReviewId(review.id);
    setEditedText(review.review_text);
    setEditedRating(review.rating);
  };

  const handleEditReview = (reviewId) => {
    if (!editedText.trim() || editedRating === 0) {
      toast.error("Both text and rating must be provided.");
      return;
    }
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
        toast.success("Review deleted!");
      })
      .catch((error) => {
        console.error("Error deleting review:", error);
      });
  };

  const renderStars = (value, onChange) => {
    return (
      <div className="flex items-center mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            className={`text-accent mr-1 cursor-pointer ${
              star <= value ? "fill-accent" : ""
            }`}
            onClick={() => onChange && onChange(star)}
          />
        ))}
      </div>
    );
  };

  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-12 h-12 border-4 border-card border-t-primary rounded-full animate-spin"></div>
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
    <div className="bg-background min-h-screen text-text-primary font-serif">
      <NavBar />
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <img
            src={book.image_url || "/placeholder.svg"}
            alt={book.title}
            className="max-w-[300px] h-auto rounded-lg shadow-md"
          />
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-primary mb-2">
              {book.title}
            </h1>
            <h2 className="text-2xl text-accent mb-2">{book.author}</h2>
            <p className="text-text-secondary mb-2">{book.genre}</p>
            <p className="text-text-secondary mb-2">{book.publication_year}</p>
            <p className="text-text-secondary">{book.page_count} pages</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-3xl font-bold text-primary mb-4">Reviews</h2>
          {reviews.map((review) => (
            <div key={review.id} className="bg-card rounded-lg p-4 mb-4">
              {editingReviewId === review.id ? (
                <div>
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full p-2 mb-4 bg-background border border-secondary rounded text-text-primary text-base"
                  />
                  {renderStars(editedRating, setEditedRating)}
                  <div>
                    <button
                      className="bg-secondary text-background border-none py-2 px-4 text-base font-serif cursor-pointer mr-2 transition-colors duration-300"
                      onClick={() => handleEditReview(review.id)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-card text-text-primary border-none py-2 px-4 text-base font-serif cursor-pointer transition-colors duration-300"
                      onClick={() => setEditingReviewId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-text-secondary mb-2">
                    {review.review_text}
                  </p>
                  {renderStars(review.rating)}
                  {review.user_id === user.id && (
                    <div className="flex space-x-2 mt-2">
                      <button
                        className="bg-secondary text-background border-none py-2 px-4 text-base font-serif cursor-pointer transition-colors duration-300 flex items-center"
                        onClick={() => handleEditClick(review)}
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </button>
                      <button
                        className="bg-accent text-background border-none py-2 px-4 text-base font-serif cursor-pointer transition-colors duration-300 flex items-center"
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8">
          <textarea
            placeholder="Add a Review"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full p-2 mb-4 bg-background border border-secondary rounded text-text-primary text-base"
          />
          {renderStars(rating, setRating)}
          <button
            className="bg-secondary text-background border-none py-2 px-4 text-base font-serif cursor-pointer transition-colors duration-300"
            onClick={handleAddReview}
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
