import React from "react";
import { Link } from "react-router-dom";
const Header = () => {
    return (<>
        <header>
            <nav style={{ display: "flex", justifyContent: "space-evenly" }}>
                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>
                <Link to= "/Login">Login</Link>
                <Link to="/create-product">Dashboard</Link>
            </nav>
        </header>

    </>)
}
export default Header;