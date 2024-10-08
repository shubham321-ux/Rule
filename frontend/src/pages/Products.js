import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../componenets/Header';
const Products = () => {
    return (<>
    <Header/>
        <h1>Products</h1>
        <Link to="/">Home</Link>
    </>)
}
export default Products;