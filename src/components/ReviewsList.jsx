import { useEffect, useState } from "react";
import { fetchReviews } from "../utils/api";

function ReviewsList(){
    const [reviews,setReviews] = useState([]);

    useEffect(() =>{
        fetchReviews().then(setReviews)
    },[]);
    return(
        <div>
            <p>Reviews</p>
            <ul>
            {reviews.length > 0 ? (
          reviews.map((review) => (
            <li key={review.id}>
              <strong>{review.book.title}</strong> by {review.book.author}
              <p>Rating: {review.rating}</p>
              <p>{review.review_text}</p>
            </li>
          ))
        ) : (
          <p>No reviews available</p>
        )}
            </ul>
        </div>
    )
}
export default ReviewsList