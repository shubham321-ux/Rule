import React, { useEffect, useState } from "react";
import Header from "../componenets/Header"; 
import { getProduct } from "../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const Home = () => {
    const [allProducts, setAllProducts] = useState([]);
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(getProduct());
    }, [dispatch]);

    useEffect(() => {
        if (products) {
            setAllProducts(products.products);
        }
    }, [products]); 

    return (
        <>
            <Header />
            <h1>Home</h1>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                allProducts?.map((product) => (
                    <Link to={`/product/${product?._id}`}>
                    <div  key={product?._id} style={{margin: "10px",display:"flex",justifyContent:'center',background:"red",alignItems:"center",flexDirection:"column"}}>
                        <h4>{product?.name}</h4>
                        <h4>{product?.price}</h4>
                        <h4>{product?.description}</h4>
                    </div>
                    </Link>
                ))
            )}
            </div>
        </>
    );
};

export default Home;
