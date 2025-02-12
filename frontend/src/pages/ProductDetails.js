import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductDetails } from '../actions/productAction';
import { addToFavorites, removeFromFavorites } from '../actions/favoritebooksAction';
import CreateReview from '../components/CreateReview';
import ReactStars from 'react-stars';
import Payment from '../payment/Payment';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { FaDownload } from 'react-icons/fa';
import "./css/ProductDetails.css"
import { getUserDetails } from '../actions/userAction';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { product, loading, error } = useSelector((state) => state.productDetails);
    const { favorites } = useSelector((state) => state.favorites);
    const { user, isAuthenticated } = useSelector((state) => state.user);
    const [showPayment, setShowPayment] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        dispatch(getProductDetails(id));
    }, [dispatch, id]);

    const handleAuthRequired = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/product/${id}` } });
        }
    };

    const handleBuyNow = () => {
        if (!isAuthenticated) {
            handleAuthRequired();
            return;
        }
        setShowPayment(true);
    };

    const handlePaymentSuccess = (downloadUrl) => {
        if (downloadUrl) {
            setPdfUrl(downloadUrl);
        }
        setShowPayment(false);
    };

    const handleDownloadPdf = () => {
        if (!isAuthenticated) {
            handleAuthRequired();
            return;
        }
        const downloadUrl = pdfUrl || product?.productPDF?.url;
        if (downloadUrl) {
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.target = '_blank';
            link.download = `${product.name}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const isProductInFavorites = (productId) => {
        return favorites?.some((fav) => {
            const favProductId = fav.product?._id || fav.product;
            return favProductId === productId;
        });
    };

    const handleToggleFavorite = (productId) => {
        if (!isAuthenticated) {
            handleAuthRequired();
            return;
        }
        if (isProductInFavorites(productId)) {
            dispatch(removeFromFavorites(productId));
        } else {
            dispatch(addToFavorites(productId));
        }
    };

    const handleAddReview = () => {
        if (!isAuthenticated) {
            handleAuthRequired();
            return;
        }
        setActiveTab('addReview');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="product-details-container">
            <div className="product-main-content">
                <div className="product-images-section">
                    <div className="thumbnail-images">
                        {product?.images?.map((img, index) => (
                            <div
                                key={index}
                                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                onClick={() => setSelectedImage(index)}
                            >
                                <img src={img.url} alt={`Product ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                    <div className="main-image">
                        <img src={product?.images?.[selectedImage]?.url} alt="Product Preview" />
                    </div>
                </div>

                <div className="product-info-section">
                    <div className="product-header">
                        <div className={`stock-status ${product?.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                            {product?.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </div>
                        <button
                            className="favorite-icon-button"
                            onClick={() => handleToggleFavorite(product?._id)}
                        >
                            {isProductInFavorites(product?._id) ? (
                                <AiFillHeart className="heart-icon filled" />
                            ) : (
                                <AiOutlineHeart className="heart-icon" />
                            )}
                        </button>
                    </div>

                    <h1 className="product-title">{product?.name}</h1>

                    <div className="author-rating">
                        <span className="author">{product?.author}</span>
                        <div className="rating">
                            <ReactStars
                                edit={false}
                                value={product?.rating}
                                count={5}
                                size={24}
                                color2={'#ffd700'}
                            />
                            <span>({product?.numOfReviews} reviews)</span>
                        </div>
                    </div>

                    <div className="product-price">₹{product?.price}</div>

                    <div className="product-description">
                        <p>{product?.description}</p>
                    </div>

                    {product?.paymentPaid ? (
                        <button
                            className="download-pdf-button"
                            onClick={handleDownloadPdf}
                        >
                            <FaDownload className="download-icon" />
                            Download PDF
                        </button>
                    ) : (
                        <button
                            className="buy-now-button"
                            onClick={handleBuyNow}
                            disabled={product?.stock === 0}
                        >
                            Buy Now
                        </button>
                    )}

                    {/* Add Review Section (Only if the product is paid for) */}
                    {/* {product?.paymentPaid && (
                        <button
                            className="add-review-button"
                            onClick={handleAddReview}
                        >
                            Add Review
                        </button>
                    )} */}

                    {!product?.paymentPaid && (
                        <p className="review-notice">
                            You must buy this product before leaving a review.
                        </p>
                    )}

                    <div className="customer-satisfaction">
                        <span>100+ Happy Customers</span>
                    </div>

                    <div className="product-category">
                        Category: <span>{product?.category}</span>
                    </div>
                </div>
            </div>

            <div className="product-tabs">
                <div className="tab-buttons">
                    <button
                        className={activeTab === 'description' ? 'active' : ''}
                        onClick={() => setActiveTab('description')}
                    >
                        Description
                    </button>
                    <button
                        className={activeTab === 'reviews' ? 'active' : ''}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Reviews
                    </button>
                    {product?.paymentPaid && (
                        <button
                            className={activeTab === 'addReview' ? 'active' : ''}
                            onClick={handleAddReview}
                        >
                            Add Review
                        </button>
                    )}
                </div>

                <div className="tab-content">
                    {activeTab === 'description' && (
                        <div className="description-content">
                            {product?.description}
                        </div>
                    )}
                    
                    {activeTab === 'reviews' && (
                        <div className="reviews-content">
                            {product?.reviews?.length > 0 ? (
                                product.reviews.map((rev) => (
                                    <div key={rev._id} className="review-card">
                                        <img 
                                            src={rev?.avatar || '/default-avatar.png'} 
                                            alt="User Avatar" 
                                            className="review-avatar"
                                        />
                                        <div className="review-info">
                                            <p className="reviewer-name">{rev.name}</p>
                                            <ReactStars
                                                edit={false}
                                                value={rev.rating}
                                                count={5}
                                                size={24}
                                                color2={'#ffd700'}
                                            />
                                            <p className="review-comment">{rev.comment}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-reviews">No reviews yet</p>
                            )}
                        </div>
                    )}
                    
                    {activeTab === 'addReview' && isAuthenticated && product?.paymentPaid && (
                        <CreateReview
                            productId={product._id}
                            onClose={() => setActiveTab('reviews')}
                        />
                    )}
                </div>
            </div>

            {showPayment && (
                <Payment
                    product={product}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
};

export default ProductDetails;
