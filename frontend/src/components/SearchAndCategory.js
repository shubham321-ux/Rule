import React, { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./css/SearchAndCategory.css";
import { FaSearch } from 'react-icons/fa';
import { debounce } from "lodash";  // Importing debounce from Lodash

const SearchAndCategory = ({ categories, onCategoryChange }) => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchParams, setSearchParams] = useSearchParams();

  // Debounce the search function
  const debouncedSearch = useCallback(
    debounce((searchTerm, category) => {
      const params = new URLSearchParams();
      if (searchTerm) params.set("keyword", searchTerm);
      if (category !== "All") params.set("category", category);
      setSearchParams(params);
      navigate(`/products?${params.toString()}`);
    }, 500), // Delay of 500ms after user stops typing
    []
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const newKeyword = e.target.value;
    setKeyword(newKeyword);
    debouncedSearch(newKeyword, selectedCategory); // Trigger the debounced search
  };

  // Handle category selection change
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    onCategoryChange(category === "All" ? null : category);

    const params = new URLSearchParams(searchParams);
    params.set("category", category === "All" ? " " : category);
    setSearchParams(params);
    navigate(`/products?${params.toString()}`);
  };

  // Handle search submit (on button click)
  const handleSearchSubmit = () => {
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    setSearchParams(params);
    navigate(`/products?${params.toString()}`);

    // Clear the input box after submitting
    setKeyword("");  // Reset keyword state to empty string
  };

  return (
    <div className="search-container-main">
      <div className="search-container">
        <div className="select-container">
          <select onChange={handleCategoryChange} value={selectedCategory} style={{ padding: "8px", width: "200px" }}>
            <option value="All">All</option>
            {categories?.map((item) => (
              <option key={item._id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={keyword}
          onChange={handleSearchChange}
          className="input-field"
          required
        />
      </div>
      <button onClick={handleSearchSubmit} className="button">
        <FaSearch color="#fff" size={18} />
      </button>
    </div>
  );
};

export default SearchAndCategory;
