import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProductDetails, addToCart } from '../actions/productAction'; // Import the addToCart action
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { product, loading, error } = useSelector((state) => state.productDetails);

    useEffect(() => {
        dispatch(getProductDetails(id));
    }, [dispatch, id]);

    const handleAddToCart = () => {
       
    };

    const handleAddReview = () => {
        // Add functionality to navigate to the review form or open a modal
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Product Details</h1>
            <h2>{product?.name}</h2>
            <p>Price: ${product?.price}</p>
            <p>Description: {product?.description}</p>
            <p>Category: {product?.category}</p>

            <button 
                onClick={handleAddToCart} 
                style={{ backgroundColor: product?.stock >=1 ? 'green' : 'red', color: 'white' }}
                disabled={!product?.inStock}
            >
                {product?.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>

            <button onClick={handleAddReview}>
                Add Review
            </button>
        </div>
    );
};

export default ProductDetails;
