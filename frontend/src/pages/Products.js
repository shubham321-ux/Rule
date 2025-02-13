import React, { useEffect, useState, useMemo } from "react";
import "./css/Products.css";
import { getProduct } from "../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductFilter from "../components/ProductFilter";
import { FaFilter, FaTimes } from 'react-icons/fa';
import Loading from "../components/Loading";

const Product = () => {
  const dispatch = useDispatch();
  const { products, loading, error, totalPages } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.category);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";

  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 100 },
    selectedCategories: [],
    currentPage: 1
  });

  const [selectedProduct, setSelectedProduct] = useState(null);

  const memoizedProducts = useMemo(() => {
    dispatch(getProduct(
      filters.currentPage,
      keyword,
      category,
      filters.priceRange.min,
      filters.priceRange.max,
      filters.selectedCategories
    ));
  }, [dispatch, filters, keyword, category]);

  const handlePriceRangeChange = (min, max) => {
    setFilters(prev => ({
      ...prev,
      priceRange: { min, max },
      currentPage: 1
    }));
  };

  const handleCategoryChange = (selectedCategories) => {
    setFilters(prev => ({
      ...prev,
      selectedCategories,
      currentPage: 1
    }));
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handlePageChange = (direction) => {
    const newPage = direction === "next" ? filters.currentPage + 1 : filters.currentPage - 1;
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="products-page">
      <div 
        className={`filter-overlay ${isFilterOpen ? 'active' : ''}`}
        onClick={() => setIsFilterOpen(false)}
      />
      <div className="main-content">
        <aside className={`filter-sidebar ${isFilterOpen ? 'active' : ''}`}>
          <div className="filter-header">
            <h2>Filters</h2>
            <button className="close-filter" onClick={() => setIsFilterOpen(false)}>
              <FaTimes />
            </button>
          </div>

          <ProductFilter
            initialPriceRange={filters.priceRange}
            initialCategories={filters.selectedCategories}
            onPriceRangeChange={handlePriceRangeChange}
            onCategoryChange={handleCategoryChange}
            categories={categories}
          />
        </aside>

        <button className="filter-toggle" onClick={toggleFilter}>
          <FaFilter />
        </button>

        <main className="product-container-main">
          {loading ? (
            <Loading/>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : products.length === 0 ? (
            <div className="no-products">No products found</div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="product-card-wrapper"
                  onClick={() => handleProductSelect(product)}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-button"
            onClick={() => handlePageChange("previous")}
            disabled={filters.currentPage === 1 || loading}
          >
            Previous
          </button>
          <span className="page-info">
            Page {filters.currentPage} of {totalPages}
          </span>
          <button
            className="pagination-button"
            onClick={() => handlePageChange("next")}
            disabled={filters.currentPage === totalPages || loading}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Product;
