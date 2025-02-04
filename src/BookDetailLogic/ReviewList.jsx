import { useState } from "react";
import { useUser } from "../context/UserContext.js";
import { Star, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const ReviewList = ({ reviews, onUpdateReview, onDeleteReview }) => {
  const { user } = useUser();
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [editedRating, setEditedRating] = useState(0);
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://book-app-backend-mp22.onrender.com";

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
        onUpdateReview(data);
        setEditingReviewId(null);
        toast.success("Review updated!");
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
        onDeleteReview(reviewId);
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

  return (
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
              <p className="text-text-secondary mb-2">{review.review_text}</p>
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
  );
};

export default ReviewList;
