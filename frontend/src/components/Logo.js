import React from "react";
import logo from "../assest/book_logo.svg"
import "./css/Header.css"
import { Link } from "react-router-dom";
const Logo=()=>{
return(<>
<Link to="/">
<div className="logo-div">
    <img src={logo} alt="logo" />
    <h1 className="h1 logo-h1">Bokifa</h1>
</div>
</Link>
</>)
}
export default Logo;