import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "react-toastify";

const AddReviewForm = ({ bookId, onAddReview, reviews, userId }) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://book-app-backend-mp22.onrender.com";

  const handleAddReview = () => {
    const existingReview = reviews.find((review) => review.user_id === userId);
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
      user_id: userId,
      book_id: Number.parseInt(bookId),
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
        onAddReview(data);
        setReviewText("");
        setRating(0);
        toast.success("Review added successfully!");
      })
      .catch((error) => {
        console.error("Error adding review:", error);
        toast.error("Failed to add review. Please try again.");
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

  return (
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
  );
};

export default AddReviewForm;
