import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from 'react-redux';
import LogoutButton from "./LogoutButton";
import SearchAndCategory from "./SearchAndCategory";
import "./css/Header.css";
import Logo from "./Logo";
import { AiOutlineUser, AiOutlineShoppingCart, AiOutlineHeart, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { categories } = useSelector((state) => state.category);
  const { favorites } = useSelector((state) => state.favorites);
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const userrole = user?.role || user?.user?.role || user?.user?.user?.role;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <nav className="navbar-div">
        <div className="search-div">
          <Logo />
          <div className="search-category-div1">
            <SearchAndCategory categories={categories} onCategoryChange={handleCategoryChange} />
          </div>
          <div className="profile-fev-div">
            <div className="relative-div">
              <NavLink to="/favorite-products" onClick={handleLinkClick}>
                <AiOutlineHeart size={25} color="#919191" />
              </NavLink>
              <p className="absolute-div">{isAuthenticated ? favorites?.length : 0}</p>
            </div>
            <AiOutlineUser size={25} color="#919191" />
           
            <div className="menu-icon" onClick={toggleMenu}>
              {isMenuOpen ? (
                <AiOutlineClose size={25} color="#919191" />
              ) : (
                <AiOutlineMenu size={25} color="#919191" />
              )}
            </div>
          </div>
        </div>

        <div className={`nav-links ${isMenuOpen ? 'show' : ''}`}>
          <NavLink onClick={handleLinkClick} to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
          <NavLink onClick={handleLinkClick} to="/products" className={({ isActive }) => isActive ? 'active' : ''}>Products</NavLink>
          <NavLink onClick={handleLinkClick} to="/myorders" className={({ isActive }) => isActive ? 'active' : ''}>My Orders</NavLink>
          <NavLink onClick={handleLinkClick} to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>
          {isAuthenticated && userrole === "admin" && 
            <NavLink onClick={handleLinkClick} to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Create Product</NavLink>
          }
          {!isAuthenticated ? 
            <NavLink onClick={handleLinkClick} to="/login" className={({ isActive }) => isActive ? 'active' : ''}>Login</NavLink> 
            : <LogoutButton onClick={handleLinkClick} />
          }
        </div>
      </nav>
    </header>
  );
};

export default Header;
