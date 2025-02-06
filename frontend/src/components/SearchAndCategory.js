import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const SearchAndCategory = ({ categories, onCategoryChange }) => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearchChange = (e) => {
    const newKeyword = e.target.value;
    setKeyword(newKeyword);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    onCategoryChange(category === "All" ? null : category);

    const params = new URLSearchParams(searchParams);
    params.set("category", category === "All" ? " " : category);
    setSearchParams(params);
    navigate(`/products?${params.toString()}`);
  };

  const handleSearchSubmit = () => {
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    setSearchParams(params);
    navigate(`/products?${params.toString()}`);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={keyword}
        onChange={handleSearchChange}
        style={{ marginBottom: "10px", padding: "8px", width: "200px" }}
        required
      />
      <button
        onClick={handleSearchSubmit}
        style={{
          padding: "8px 16px",
          margin: "0 10px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Search
      </button>

      <select onChange={handleCategoryChange} value={selectedCategory} style={{ padding: "8px", width: "200px" }}>
        <option value="All">All</option>
        {categories?.map((item) => (
          <option key={item._id} value={item.name}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchAndCategory;
