import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProductDetails } from '../actions/productAction';
import { addToCart } from '../actions/cartaction';
import { useParams } from 'react-router-dom';
import ReactStars from 'react-stars';
import Payment from '../payment/Payment';
import CreateReview from '../components/CreateReview';

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { product, loading, error } = useSelector((state) => state.productDetails);
    const [quantity, setQuantity] = useState(1);
    const [showPayment, setShowPayment] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const[showReview,setShowReview] = useState(false);
    // Fetch product details using the `getProductDetails` action
    useEffect(() => {
        dispatch(getProductDetails(id));
    }, [dispatch, id]);

    // Handle adding product to cart
    const handleAddToCart = () => {
        dispatch(addToCart(id, quantity));
    };

    // Handle Buy Now action (trigger payment)
    const handleBuyNow = () => {
        setShowPayment(true);
    };

    // Handle payment success (e.g., if the product has a PDF to download)
    const handlePaymentSuccess = (downloadUrl) => {
        if (product.paymentPaid === true) {
            setPdfUrl(downloadUrl); // Set PDF URL if payment is successful
            setShowPayment(false); // Close payment modal
        }
    };

    // Increment product quantity
    const incrementQuantity = () => {
        if (product?.stock > quantity) {
            setQuantity(quantity + 1);
        }
    };

    // Decrement product quantity
    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    // Trigger download if PDF is available and payment is successful
    useEffect(() => {
        if (product?.productPDF && product?.paymentPaid === true) {
            setPdfUrl(product.productPDF);
        }
    }, [product]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const showReviewFun=()=>{
        setShowReview(!showReview);
    }

    return (
        <div className="product-details">
            <h1>{product?.name}</h1>
            <div className="rating">
                <ReactStars
                    edit={false}
                    value={product?.rating}
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

                {/* Show Buy Now button only if the product is in stock and payment hasn't been made */}
                {!product.paymentPaid && product?.stock > 0 && (
                    <button
                        onClick={handleBuyNow}
                        className="buy-button"
                        disabled={product?.stock === 0}
                    >
                        Buy Now
                    </button>
                )}
            </div>

            {/* Display payment modal if `showPayment` is true */}
            {showPayment && (
                <div className="payment-modal">
                    <Payment
                        product={product}
                        onSuccess={handlePaymentSuccess}
                    />
                </div>
            )}
            {product?.paymentPaid && pdfUrl && (<button
            onClick={()=>showReviewFun()}>
                Add Review
            </button>)}
            {showReview && <CreateReview productId={product?._id}/>}

            {/* Show download section only if payment has been made */}
            {product?.paymentPaid && pdfUrl && (
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
