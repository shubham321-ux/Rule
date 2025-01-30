import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProductDetails, addToCart } from '../actions/productAction'; // Import the addToCart action
import { useParams } from 'react-router-dom';
import ReactStars from 'react-stars'

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { product, loading, error } = useSelector((state) => state.productDetails);

    const [quantity, setQuantity] = useState(1); // State for quantity

    useEffect(() => {
        dispatch(getProductDetails(id));
    }, [dispatch, id]);

    const handleAddToCart = () => {

    };

    const handleAddReview = () => {
        // Add functionality to navigate to the review form or open a modal
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
        <div>
            <h1>Product Details</h1>
            <h2>{product?.name}</h2>
            <h3>rating:<ReactStars
                edit={false}
                value={product?.ratings}
                count={5}
                size={24}
                color2={'#ffd700'}
            />
            </h3>
            <p>Price: ${product?.price}</p>
            <p>Description: {product?.description}</p>
            <p>Category: {product?.category}</p>

            <div>
                <button onClick={decrementQuantity} disabled={quantity <= 1}>-</button>
                <span>{quantity}</span>
                <button onClick={incrementQuantity} disabled={quantity >= product?.stock}>+</button>
            </div>

            <button
                onClick={handleAddToCart}
                style={{ backgroundColor: product?.stock > 0 ? 'green' : 'red', color: 'white' }}
                disabled={product?.stock === 0}
            >
                {product?.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            {product?.review && product?.review[0] ? (
                <div>
                    {product.review?.map((rev) => (

                        <div key={rev._id}>
                            <img src={rev.avatar} alt="avatar" />
                            <p>{rev.name}</p>
                            <p>{rev.comment}</p>
                            <ReactStars
                                edit={false}
                                value={rev?.ratings}
                                count={5}
                                size={24}
                                color2={'#ffd700'} />
                        </div>
                    ))}
                </div>
            ) : " no review yet "}

            <button onClick={handleAddReview}>
                Add Review
            </button>
        </div>
    );
};

export default ProductDetails;
