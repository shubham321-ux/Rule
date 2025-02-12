import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProductReviewAction } from '../actions/productAction'; // Assuming the action is defined here
import ReactStars from 'react-stars';
import { CREATE_REVIEW_RESET } from '../constants/productConstant'; // Add constant for reset

const CreateReview = ({ productId }) => {
  const dispatch = useDispatch();

  // Redux state for review creation
  const { loading, success, error } = useSelector((state) => state.createReview);

  // Local state for the form
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (success) {
      setRating(0);
      setComment('');
      setFormError('');
      dispatch({ type: CREATE_REVIEW_RESET });  // Reset success state after review submission
    }
  }, [dispatch, success]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!rating) {
      setFormError('Rating is required');
      return;
    }

    const reviewData = {
      rating,
      comment,
      productId,
    };
   

    // Dispatch the action to create the review
    dispatch(createProductReviewAction(reviewData));
  };

  return (
    <div className="create-review">
      <h3>Write a Review</h3>

      {success && <p className="success-message">Your review has been submitted successfully!</p>}
      {formError && <p className="error-message">{formError}</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Rating:</label>
          <ReactStars
            count={5}
            value={rating}
            onChange={handleRatingChange}
            size={24}
            color2={'#ffd700'}
          />
        </div>

        <div>
          <label>Comment:</label>
          <textarea
            value={comment}
            onChange={handleCommentChange}
            placeholder="Write your review here..."
            rows="5"
          />
        </div>

        <button type="submit" disabled={loading}>Submit Review</button>
      </form>

      {loading && <p>Submitting review...</p>}
    </div>
  );
};

export default CreateReview;
