import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import LogoutButton from "./LogoutButton";
const Header = () => {
    const { isAuthenticated, user } = useSelector((state) => state.user);
    return (<>
        <header>
            <nav style={{ display: "flex", justifyContent: "space-evenly" }}>
                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>
                <Link to="/myorders">My orders</Link>
                {isAuthenticated && user.role === "admin" && <Link to="/create-product">Create Product</Link>}
                {!isAuthenticated ? <Link to="/login">Login</Link> : <LogoutButton />}
            </nav>
        </header>

    </>)
}
export default Header;