import React from 'react';
import { Link } from 'react-router-dom';
import "./css/Home.css";
import Header from '../components/Header';
import Banner from '../components/Banner';
import banner from "../assest/banner.svg";
import TrendingBooks from '../components/TrendingBooks';
import BookDetails from '../components/BookDetails';
import HeroSection from '../components/HeroSection';
import FeaturedSection from '../components/FeaturedSection';
import FeaturedProduct from '../components/FeaturedProduct';
import LimitedProduct from '../components/LimitedProduct';
import AuthorSection from '../components/AuthorSection';
import Buy3 from '../components/Buy3';
import Community from '../components/Community';

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
   <div className='featured-section-home'>
   <FeaturedSection/>
   <FeaturedProduct/>

   </div>
   <LimitedProduct title=' This week highlights'/>
   <AuthorSection/>
   <Buy3/>
   <Community/>
    </div>
   
    </>)
}
export default Home;