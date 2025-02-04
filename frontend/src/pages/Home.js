import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { getProduct } from "../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

const Home = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [allProducts, setAllProducts] = useState([]);
    const [searchKeyword, setSearchKeyword] = useSearchParams();

    const keyword = searchKeyword.get("keyword") || "";

    // Fetch products on initial load or when search or page changes
    useEffect(() => {
        dispatch(getProduct(currentPage, keyword));
    }, [dispatch, currentPage, keyword]);

    // Update state with new products and total pages when products are fetched
    useEffect(() => {
        if (products && Array.isArray(products.products)) {
            setTotalPages(products.totalPages);
            setAllProducts((prev) => {
                const existingProductIds = new Set(prev.map(product => product._id));
                const newProducts = products.products.filter(product => !existingProductIds.has(product._id));
                return [...prev, ...newProducts];
            });
        }
    }, [products]);

    // Infinite scrolling event listener
    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 10) {
            if (currentPage < totalPages && !loading) {
                setCurrentPage((prev) => prev + 1);
            }
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [currentPage, totalPages, loading]);

    // Handle search input changes
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
            <LogoutButton />
            <input
                type="text"
                placeholder="Search..."
                value={keyword}
                onChange={handleSearchChange}
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : products.length === 0 ? (
                    <p>No products found</p>
                ) : (
                    products?.map((product) => (
                        <Link key={product._id} to={`/product/${product._id}`}>
                            <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px", textAlign: "center", backgroundColor: "#f9f9f9" }}>
                                <h4>{product.name}</h4>
                                <p>{product.description}</p>
                                <p><strong>{product.price}</strong></p>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {/* Pagination Buttons */}
            <div style={{
                marginTop: "20px", 
                display: 'flex', 
                justifyContent: 'space-between', 
                width: '200px', 
                marginLeft: "auto", 
                marginRight: "auto"
            }}>
                <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1 || loading}>
                    Previous Page
                </button>
                <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || loading}>
                    Next Page
                </button>
            </div>
        </>
    );
};

export default Home;
