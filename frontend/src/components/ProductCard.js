import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import LazyImage from "../components/Lazyimage";
import errorImage from "../assest/error.avif";
import "./css/Productcard.css";
import ReactStars from "react-stars";
import star from "../assest/star2.svg";
import unfillstar from "../assest/unfillstar.svg";
import { AiOutlineEye, AiFillEye } from 'react-icons/ai';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { addToFavorites, removeFromFavorites, getFavorites } from "../actions/favoritebooksAction";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { favorites, loading } = useSelector((state) => state.favorites);
  const { user } = useSelector((state) => state.user);
  const [removing, setRemoving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  if (!product) return null;

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].url
      : errorImage;

  const isProductInFavorites = (productId) => {
    return favorites?.some((fav) => {
      const favProductId = fav.product?._id || fav.product;
      return favProductId === productId;
    });
  };

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    if (!user) return;

    const favoriteItem = favorites.find(
      (fav) => (fav.product?._id || fav.product) === product._id
    );

    if (favoriteItem) {
      await dispatch(removeFromFavorites(favoriteItem._id));
    } else {
      await dispatch(addToFavorites(product._id));
    }
    
    dispatch(getFavorites());
  };

  const handleViewDetails = (e) => {
    e.preventDefault();
    navigate(`/product/${product._id}`);
  };

  return (
    <Link key={product._id} to={`/product/${product._id}`}>
      <div
        className={`product-card ${removing ? 'removing' : ''}`}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        <div className="product-image">
          <LazyImage src={imageUrl} alt={product.name} />
        </div>
       
        <div className={`fev-see-div ${isHovered || isMobile ? 'show' : ''}`}>
          <div className="fev-div" onClick={handleFavoriteClick}>
            {isProductInFavorites(product._id) ? (
              <AiFillHeart size={24} color="#E3BD83" />
            ) : (
              <AiOutlineHeart size={24} color="#919191" />
            )}
          </div>
          <div className="see-div" onClick={handleViewDetails}>
            <AiOutlineEye 
              size={24} 
              color="#919191"
              className="eye-icon"
            />
          </div>
        </div>

        <div className="product-rating-div">
          <ReactStars
            edit={false}
            value={product?.rating}
            count={5}
            size={24}
            color2={"#E3BD83"}
            half={true}
            emptyIcon={
              <img src={unfillstar} alt="empty star" width="24" height="24" />
            }
            fullIcon={
              <img src={star} alt="filled star" width="24" height="24" />
            }
            className="product-stars"
          />
        </div>

        <div className="product-details">
          <h4 className="product-heading-name">{product.name}</h4>
          <p className="author-name">{product?.author}</p>
          <p className="product-price">
            <strong>₹</strong>
            <strong>{product?.price}</strong>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
