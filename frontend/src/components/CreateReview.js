import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import ReactStars from 'react-stars';
import { createProductReviewAction } from '../actions/productAction';
import './css/CreateReview.css';

const CreateReview = ({ productId, onClose }) => {
    const dispatch = useDispatch();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const reviewData = {
            productId,
            rating,
            comment
        };
        dispatch(createProductReviewAction(reviewData));
        onClose();
    };

    return (
        <div className="create-review-container">
            <h2>Write a Review</h2>
            <form onSubmit={handleSubmit}>
                <div className="rating-section">
                    <label>Your Rating</label>
                    <ReactStars
                        count={5}
                        value={rating}
                        size={32}
                        color2={'#ffd700'}
                        onChange={(newRating) => setRating(newRating)}
                    />
                </div>

                <div className="comment-section">
                    <label>Your Review</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts about this book..."
                        rows={6}
                        required
                    />
                </div>

                <div className="button-group">
                    <button type="submit" className="submit-button">
                        Submit Review
                    </button>
                    <button type="button" className="cancel-button" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateReview;
