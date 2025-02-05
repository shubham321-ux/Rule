import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFavorites, removeFromFavorites } from '../actions/favoritebooksAction';
import { getProductDetails } from '../actions/productAction';
import ProductCard from './ProductCard';
import './css/FavoriteProducts.css';

const FavoriteProducts = () => {
  const dispatch = useDispatch();
  const { favorites, loading } = useSelector((state) => state.favorites);
  const [removingItems, setRemovingItems] = useState(new Set());

  useEffect(() => {
    dispatch(getFavorites());
  }, [dispatch]);

  const handleRemoveFavorite = async (productId) => {
    setRemovingItems(prev => new Set(prev).add(productId));
    
    // Wait for animation to complete
    setTimeout(async () => {
      await dispatch(removeFromFavorites(productId));
      dispatch(getFavorites());
    }, 300); // Match this with CSS animation duration
  };

  return (
    <div className="favorite-products">
      <h2>My Favorite Products</h2>
      
      {loading ? (
        <div>Loading...</div>
      ) : favorites?.length === 0 ? (
        <div>No favorite products found</div>
      ) : (
        <div className="favorites-grid">
          {favorites?.map((favorite) => (
            <div 
              key={favorite._id} 
              className={`favorite-item ${removingItems.has(favorite._id) ? 'removing' : ''}`}
            >
              <ProductCard product={favorite.product} />
              <button
                onClick={() => handleRemoveFavorite(favorite._id)}
                className="remove-button"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteProducts;
