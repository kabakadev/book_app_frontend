import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.js";
import NavBar from "./NavBar";
import BookInfo from "../BookDetailLogic/BookInfo.jsx";
import ReviewList from "../BookDetailLogic/ReviewList.jsx";
import AddReviewForm from "../BookDetailLogic/AddReviewForm.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useUser();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
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

  const handleAddReview = (newReview) => {
    const existingReview = reviews.find(
      (review) => review.user_id === newReview.user_id
    );
    if (existingReview) {
      toast.error("You have already reviewed this book.");
      return;
    }
    setReviews([...reviews, newReview]);
  };

  const handleUpdateReview = (updatedReview) => {
    setReviews(
      reviews.map((review) =>
        review.id === updatedReview.id ? updatedReview : review
      )
    );
  };

  const handleDeleteReview = (reviewId) => {
    setReviews(reviews.filter((review) => review.id !== reviewId));
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
        <BookInfo book={book} />
        <ReviewList
          reviews={reviews}
          onUpdateReview={handleUpdateReview}
          onDeleteReview={handleDeleteReview}
        />
        <AddReviewForm
          bookId={id}
          onAddReview={handleAddReview}
          reviews={reviews}
          userId={user.id}
        />
      </div>
    </div>
  );
};

export default BookDetail;
