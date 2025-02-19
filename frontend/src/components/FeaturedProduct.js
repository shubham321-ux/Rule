import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReactStars from 'react-rating-stars-component';
import demoimge1 from "../assest/pdemoimage.png";
import demoimge2 from "../assest/horrorimg.png";
import './css/FeaturedProduct.css';
import Title from './Title';

const FeaturedProduct = () => {
  const navigate = useNavigate();
  const { products } = useSelector((state) => state.products);

  const demoData = {
    mainProduct: {
      _id: 'demo1',
      name: 'The Art of Programming',
      author: 'John Doe',
      description: 'A comprehensive guide to modern programming practices and principles. Learn the fundamentals and advanced concepts of software development.',
      price: '999',
      images: [{ url: demoimge1 }],
      ratings: 4.5
    },
    sideProducts: [
      {
        _id: 'demo2',
        name: 'Web Development Mastery',
        author: 'Jane Smith',
        price: '799',
        images: [{ url: demoimge2 }],
        ratings: 4.2
      },
      {
        _id: 'demo3',
        name: 'Data Structures Simplified',
        author: 'Mike Johnson',
        price: '899',
        images: [{ url: demoimge2 }],
        ratings: 4.8
      },
      {
        _id: 'demo4',
        name: 'Python for Beginners',
        author: 'Sarah Wilson',
        price: '699',
        images: [{ url: demoimge2 }],
        ratings: 4.6
      }
    ]
  };

  const randomProducts = useMemo(() => {
    if (!products || products.length === 0) return demoData;
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return {
      mainProduct: shuffled[0] || demoData.mainProduct,
      sideProducts: shuffled.slice(1, 4).length ? shuffled.slice(1, 4) : demoData.sideProducts
    };
  }, [products]);

  const handleImageError = (e) => {
    e.target.src = demoimge1;
  };

  const handleProductClick = (product) => {
    if (product._id.startsWith('demo')) {
      navigate('/products');
    } else {
      navigate(`/product/${product._id}`);
    }
  };

  return (<>
  <Title title={"Featured Products"} />
    <div className="featured-product-container-featured">
      <div className="main-product" onClick={() => handleProductClick(randomProducts.mainProduct)}>
        <div className="product-image">
          <img
            src={randomProducts.mainProduct?.images[0]?.url}
            alt={randomProducts.mainProduct?.name}
            onError={handleImageError}
          />
        </div>
        <div className="product-info-featured">
          <h2 className="product-name">{randomProducts.mainProduct?.name}</h2>
          <p className="product-author">
            <span className='author-title-style'>Author: </span>
            {randomProducts.mainProduct?.author}
          </p>
          <p className="product-description-feature">
            {randomProducts.mainProduct?.description}
          </p>
          <p className="product-price">
            <span className='price-title-feature'>Price: </span>
            ₹{randomProducts.mainProduct?.price}
          </p>
          <button
            className="view-button"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/products');
            }}
          >
            View All Products
          </button>
        </div>
      </div>

      <div className="side-products">
        {randomProducts.sideProducts?.map((product,index) => (
          <div 
            key={product._id} 
            className="side-product-item"
            onClick={() => handleProductClick(product)}
            style={{border:index===randomProducts.sideProducts.length-1?'none':" "}}
          >
            <div className="side-product-image">
              <img
                src={product.images[0]?.url}
                alt={product.name}
                onError={handleImageError}
              />
            </div>
            <div
          
             className="side-product-details">
              <ReactStars
                count={5}
                value={product.rating}
                size={20}
                edit={false}
                activeColor="#027A36"
              />
              <h3 className="side-product-name">{product.name}</h3>
              <p className="side-product-author">{product.author}</p>
              <p className="side-product-price">₹{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>);
};

export default FeaturedProduct;
