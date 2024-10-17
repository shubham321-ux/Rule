import React, { useEffect, useState } from "react";
import Header from "../componenets/Header"; 
import { getProduct } from "../actions/productAction";
import { useSelector, useDispatch } from "react-redux";

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
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                allProducts?.map((product) => (
                    <div key={product?._id}>
                        <h1>{product?.name}</h1>
                        <h1>{product?.price}</h1>
                        <h1>{product?.description}</h1>
                    </div>
                ))
            )}
        </>
    );
};

export default Home;
