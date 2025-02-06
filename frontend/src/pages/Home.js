import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
const Home = () => {
    return (<>
    <Header/>
        <h1>Home</h1>
        <Link to="/">Home</Link>
    </>)
}
export default Home;