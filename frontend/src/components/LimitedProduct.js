import React from "react";
import "./css/LimitedProduct.css";
import Title from "./Title";
import { useSelector } from "react-redux";
import ProductCard from "./ProductCard";
const LimitedProduct = ({title="limited product"}) => {
    const {products,loading}=useSelector((state)=>state.products)
  return (
    <div className="main-limited-product-div">
     <Title title={title} />
     <div className="limited-product-div">
  {products?.slice(0, 6).map((product) => (
    <ProductCard key={product._id} product={product} />
  ))}
</div>


    </div>
  );
};
export default LimitedProduct;