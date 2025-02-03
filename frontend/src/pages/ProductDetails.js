import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProductDetails } from '../actions/productAction';
import { addToCart } from '../actions/cartaction';
import { useParams } from 'react-router-dom';
import ReactStars from 'react-stars';
import Payment from '../payment/Payment';

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { product, loading, error } = useSelector((state) => state.productDetails);
    const [quantity, setQuantity] = useState(1);
    const [showPayment, setShowPayment] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        dispatch(getProductDetails(id));
    }, [dispatch, id]);

    const handleAddToCart = () => {
        dispatch(addToCart(id, quantity));
    };

    const handleBuyNow = () => {
        setShowPayment(true);
    };

    const handlePaymentSuccess = (downloadUrl) => {
        setPdfUrl(downloadUrl);
        setShowPayment(false);
    };

    const incrementQuantity = () => {
        if (product?.stock > quantity) {
            setQuantity(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="product-details">
            <h1>{product?.name}</h1>
            <div className="rating">
                <ReactStars
                    edit={false}
                    value={product?.ratings}
                    count={5}
                    size={24}
                    color2={'#ffd700'}
                />
            </div>
           
            <p className="price">₹{product?.price}</p>
            <p className="description">{product?.description}</p>
            <p className="category">Category: {product?.category}</p>

            <div className="quantity-controls">
                <button onClick={decrementQuantity} disabled={quantity <= 1}>-</button>
                <span>{quantity}</span>
                <button onClick={incrementQuantity} disabled={quantity >= product?.stock}>+</button>
            </div>

            <div className="action-buttons">
                <button
                    onClick={handleAddToCart}
                    className={`cart-button ${product?.stock === 0 ? 'disabled' : ''}`}
                    disabled={product?.stock === 0}
                >
                    {product?.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>

                <button
                    onClick={handleBuyNow}
                    className="buy-button"
                    disabled={product?.stock === 0}
                >
                    Buy Now
                </button>
            </div>

            {showPayment && (
                <div className="payment-modal">
                    <Payment
                        product={product}
                        onSuccess={handlePaymentSuccess}
                    />
                </div>
            )}

            {pdfUrl && (
                <div className="download-section">
                    <h3>Your Purchase is Complete!</h3>
                    <p>You can now download your PDF</p>
                    <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="download-button"
                    >
                        Download PDF
                    </a>
                </div>
            )}

            <div className="reviews-section">
                <h2>Reviews</h2>
                {product?.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((rev) => (
                        <div key={rev._id} className="review-card">
                            <img src={rev.avatar} alt="avatar" />
                            <p className="reviewer-name">{rev.name}</p>
                            <p className="review-comment">{rev.comment}</p>
                            <ReactStars
                                edit={false}
                                value={rev.rating}
                                count={5}
                                size={24}
                                color2={'#ffd700'}
                            />
                        </div>
                    ))
                ) : (
                    <p>No reviews yet</p>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
