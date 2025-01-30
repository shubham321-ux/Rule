import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import { getProduct } from "../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";

const Home = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [allProducts, setAllProducts] = useState([]);
    const [searchKeyword, setSearchKeyword] = useSearchParams();

    const keyword = searchKeyword.get("keyword") || "";

    useEffect(() => {
        dispatch(getProduct(currentPage, keyword));
    }, [dispatch, currentPage, keyword]);

    useMemo(() => {
        if (products && Array.isArray(products.products)) {
            setTotalPages(products.totalPages);

            const existingProductIds = new Set(allProducts.map(product => product._id));
            const newProducts = products.products.filter(product => !existingProductIds.has(product._id));

            setAllProducts((prev) => [...prev, ...newProducts]);
        }
    }, [products, currentPage]);

    // Scroll event listener
    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 10) {
            if (currentPage < totalPages) {
                setCurrentPage((prev) => prev + 1);
            }
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [currentPage, totalPages]);

    const handleSearchChange = (e) => {
        const newKeyword = e.target.value;
        setSearchKeyword({ keyword: newKeyword });
        setCurrentPage(1); // Reset to the first page on new search
        setAllProducts([]); // Clear previous products
    };

    return (
        <>
            <Header />
            <h1>Home</h1>
            <input
                type="text"
                placeholder="Search..."
                value={keyword}
                onChange={handleSearchChange}
            />
            <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "column" }}>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : (
                    allProducts.map((product) => (
                        <Link key={product?._id} to={`/product/${product?._id}`}>
                            <div style={{ margin: "3rem", display: "flex", justifyContent: 'center', background: "red", alignItems: "center", flexDirection: "column", width: "150px" }}>
                                <p style={{ textWrap: "wrap" }}>{product?._id}</p>
                                <h4>{product?.name}</h4>
                                <h4>{product?.price}</h4>
                                <h4>{product?.description}</h4>
                            </div>
                        </Link>
                    ))
                )}
            </div>
            <div style={{ marginTop: "20px", display: 'flex', justifyContent: 'space-between', width: '200px' }}>
                <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                    Previous Page
                </button>
                <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                    Next Page
                </button>
            </div>
        </>
    );
};

export default Home;
