import React from "react";
import { RouteNavbar } from "overlay-navbar";
import { Link } from "react-router-dom";
const Header = () => {
    return (<>
        <header>
            <nav style={{ display: "flex", justifyContent: "space-evenly" }}>
                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>
            </nav>
        </header>

    </>)
}
export default Header;