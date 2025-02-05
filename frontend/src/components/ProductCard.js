import React from "react";
import { Link } from "react-router-dom";
import LazyImage from "../components/Lazyimage";
import errorImage from "../assest/error.avif";

const ProductCard = ({ product }) => {
  if (!product) return null;

  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0].url 
    : errorImage;

  return (
    <Link key={product._id} to={`/product/${product._id}`}>
      <div
        style={{
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
          textAlign: "center",
          backgroundColor: "#f9f9f9",
          height: "250px",
          overflow: "hidden",
        }}
      >
        <h4>{product.name}</h4>
        <p>{product?.description}</p>
        <div>
          <LazyImage
            src={imageUrl}
            alt={product.name}
          />
        </div>
        <p>
          <strong>{product?.price}</strong>
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
