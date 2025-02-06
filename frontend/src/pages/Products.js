import React, { useEffect } from "react";
import "./css/Products.css";
import Header from "../components/Header";
import { getProduct } from "../actions/productAction";
import { addToFavorites } from "../actions/favoritebooksAction";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import ProductCard from "../components/ProductCard";
import SearchAndCategory from "../components/SearchAndCategory"; 

const Product = () => {
  const dispatch = useDispatch();
  const { products, loading, error, totalPages, currentPage } = useSelector((state) => state.products);
  console.log("totale page",totalPages, currentPage);
  const { user } = useSelector((state) => state.user);
  const { favorites } = useSelector((state) => state.favorites);
  const { categories } = useSelector((state) => state.category);

  // Correct usage of useSearchParams in react-router-dom v6+
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";

  useEffect(() => {
    // Dispatch the action only when necessary: when the page changes or keyword/category changes
    if ( currentPage === 1) {

      dispatch(getProduct(currentPage, keyword, category));
    }
  }, [dispatch, currentPage, keyword, category, products.length]);

  const handleAddToFavorites = (productId) => {
    dispatch(addToFavorites(productId));
  };

  const isProductInFavorites = (productId) => {
    return favorites.some((fav) => {
      const favProductId = fav.product?._id || fav.product;
      return favProductId === productId;
    });
  };

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      dispatch(getProduct(currentPage + 1, keyword, category)); // Fetch next page
    } else if (direction === "previous" && currentPage > 1) {
      dispatch(getProduct(currentPage - 1, keyword, category)); // Fetch previous page
    }
  };

  return (
    <>
      <Header />
      <h1>Products</h1>

      {/* <LogoutButton /> */}

      {/* <SearchAndCategory categories={categories} /> */}

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
        ) : products.length === 0 ? (
          <p>No products found</p>
        ) : (
          products.map((product) => (
            <div key={product._id} className="product-card">
              <ProductCard product={product} />
              {user && (
                <button
                  onClick={() => handleAddToFavorites(product._id)}
                  disabled={isProductInFavorites(product._id)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: isProductInFavorites(product._id)
                      ? "#cccccc"
                      : "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: isProductInFavorites(product._id)
                      ? "not-allowed"
                      : "pointer",
                    marginTop: "8px",
                  }}
                >
                  {isProductInFavorites(product._id)
                    ? "Added to Favorites"
                    : "Add to Favorites"}
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
          onClick={() => handlePageChange("previous")}
          disabled={currentPage === 1 || loading}
        >
          Previous Page
        </button>
        <button
          onClick={() => handlePageChange("next")}
          disabled={currentPage === totalPages || loading}
        >
          Next Page
        </button>
      </div>
    </>
  );
};

export default Product;
