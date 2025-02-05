import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { getProduct } from "../actions/productAction";
import { addToFavorites } from "../actions/favoritebooksAction";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.user);
  const { favorites } = useSelector((state) => state.favorites);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [allProducts, setAllProducts] = useState([]);
  const [searchKeyword, setSearchKeywords] = useSearchParams();

  const keyword = searchKeyword.get("keyword") || "";

  useEffect(() => {
    dispatch(getProduct(currentPage, keyword));
  }, [dispatch, currentPage, keyword]);

  useEffect(() => {
    if (products && Array.isArray(products)) {
      setTotalPages(products.totalPages || 0);
      setAllProducts((prev) => {
        const existingProductIds = new Set(prev.map((product) => product._id));
        const newProducts = products.filter(
          (product) => !existingProductIds.has(product._id)
        );
        return [...prev, ...newProducts];
      });
    }
  }, [products]);

  const handleSearchChange = (e) => {
    const newKeyword = e.target.value;
    setSearchKeywords({ keyword: newKeyword });
    setCurrentPage(1);
    setAllProducts([]);
  };

  const handleAddToFavorites = (productId) => {
    dispatch(addToFavorites(productId));
  };

  const isProductInFavorites = (productId) => {
    return favorites.some(fav => fav.product === productId);
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : allProducts.length === 0 ? (
          <p>No products found</p>
        ) : (
          allProducts?.map((product) => (
            <div key={product._id}>
              <ProductCard product={product} />
              {user && (
                <button
                  onClick={() => handleAddToFavorites(product._id)}
                  disabled={isProductInFavorites(product._id)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: isProductInFavorites(product._id) ? "#cccccc" : "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: isProductInFavorites(product._id) ? "not-allowed" : "pointer",
                    marginTop: "8px"
                  }}
                >
                  {isProductInFavorites(product._id) ? "Added to Favorites" : "Add to Favorites"}
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "space-between",
          width: "200px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || loading}
        >
          Previous Page
        </button>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || loading}
        >
          Next Page
        </button>
      </div>
    </>
  );
};

export default Home;
