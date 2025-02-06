import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import LogoutButton from "./LogoutButton";
import SearchAndCategory from "./SearchAndCategory";
import "./css/Header.css";
import Logo from "./Logo";
import { AiOutlineUser } from "react-icons/ai";  // User Icon
import { AiOutlineShoppingCart } from "react-icons/ai";  // Shopping Bag Icon
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { categories } = useSelector((state) => state.category);
  const { favorites } = useSelector((state) => state.favorites);
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);  // For mobile menu toggle

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category); // Update selected category
  };
  
  const userrole = user?.role || user?.user?.role || user?.user?.user?.role;
  
  return (
    <>
      <header>
        <nav className="navbar-div">
          <div className="search-div">
            <Logo />
            <div className="search-category-div1">
            <SearchAndCategory categories={categories} onCategoryChange={handleCategoryChange} />
            </div>
            <div className="profile-fev-div">
              <div className="relative-div" >
                <Link to="/favorite-products">  <AiOutlineHeart size={25} color="#919191" /></Link>
                <p className="absolute-div">{isAuthenticated ? favorites?.length : 0}</p>
              </div>
              <AiOutlineUser size={25} color="#919191" />
              <AiOutlineShoppingCart size={25} color="#919191" />
            </div>
          </div>
          
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/myorders">My Orders</Link>
            {isAuthenticated && userrole === "admin" && <Link to="/dashboard">Create Product</Link>}
            {!isAuthenticated ? <Link to="/login">Login</Link> : <LogoutButton />}
          </div>
          
          {/* Mobile Menu Toggle Icon */}
          <div className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className={isMenuOpen ? "line active" : "line"}></span>
            <span className={isMenuOpen ? "line active" : "line"}></span>
            <span className={isMenuOpen ? "line active" : "line"}></span>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="mobile-nav">
              <Link to="/">Home</Link>
              <Link to="/products">Products</Link>
              <Link to="/myorders">My Orders</Link>
              {isAuthenticated && userrole === "admin" && <Link to="/dashboard">Create Product</Link>}
              {!isAuthenticated ? <Link to="/login">Login</Link> : <LogoutButton />}
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header;
