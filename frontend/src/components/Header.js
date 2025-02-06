import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import LogoutButton from "./LogoutButton";
import SearchAndCategory from "./SearchAndCategory";

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { categories } = useSelector((state) => state.category);
  const { favorites } = useSelector((state) => state.favorites);
  
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category); // Update selected category
  };

  return (
    <>
      <header>
        <nav style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", gap: "20px" }}>
          <SearchAndCategory categories={categories} onCategoryChange={handleCategoryChange} />

          <div>
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/myorders">My Orders</Link>
            {isAuthenticated && user?.role === "admin" && <Link to="/create-product">Create Product</Link>}

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link to="/favorite-products">Favorites</Link>
              <p>{isAuthenticated ? favorites?.length : 0}</p>
            </div>

            {!isAuthenticated ? <Link to="/login">Login</Link> : <LogoutButton />}
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
