import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import LogoutButton from "./LogoutButton";
const Header = () => {
    const { isAuthenticated, user } = useSelector((state) => state.user);
const { favorites } = useSelector((state) => state.favorites);
    return (<>
        <header>
            <nav style={{ display: "flex", justifyContent: "space-evenly" }}>
                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>
                <Link to="/myorders">My orders</Link>
                {isAuthenticated &&  user.user.role === "admin" && <Link to="/create-product">Create Product</Link>}
<div style={{display:"flex",alignItems:"center",gap:"10px"}}>                <Link to="/favorite-products">Favorites</Link><p>{ isAuthenticated && favorites?.length}</p></div>
                {!isAuthenticated ? <Link to="/login">Login</Link> : <LogoutButton />}
            </nav>
        </header>

    </>)
}
export default Header;