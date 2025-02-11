import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Banner from '../components/Banner';
import banner from "../assest/banner.svg";
import TrendingBooks from '../components/TrendingBooks';
import BookDetails from '../components/BookDetails';
import HeroSection from '../components/HeroSection';
const Home = () => {
    const banners = [
        {
          imageUrl: banner,
          productId: '1',
          discount: 50
        },
        {
          imageUrl: banner,
          productId: '2',
          discount: 30
        },
        {
          imageUrl: banner,
          productId: '3',
          discount: 70
        }
      ];
    return (<>
    <div className='main-home-div'>
    <Banner banners={banners} />
    <TrendingBooks/>
    <BookDetails/>
    <HeroSection/>
    </div>
   
    </>)
}
export default Home;