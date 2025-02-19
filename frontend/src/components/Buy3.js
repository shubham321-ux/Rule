import React from 'react'
import "./css/Buy3.css"
import Title from './Title'
import buybook1 from  "../assest/buybook1.png"
import buybook2 from "../assest/buybook2.png"
import mulybooks from "../assest/mulybooks.png"
import { useNavigate } from 'react-router-dom'
const Buy3 = () => {
    const navigate = useNavigate();
    const handleExploreNow = () => {
        navigate('/products');
    };
  return (
    <div className='buy3-main-div'>
     <Title title="Buy 3 Get 1 Free" />
     <div className='buy3-div'>
        <div className='buy3-img-div1'>
            <div className='buy3-img-div1-under1'>
                <img src={buybook1} alt="" />
                <div className='buy3-text-under'>
                    <h1 className='buy3-text-under-h1'>The Book</h1>
                    <p className='buy3-text-under-p'>Available Worldwide</p>
                    <button onClick={handleExploreNow} className='buy3-text-under-btn'>Buy Now</button>
                </div>
                <img src={buybook2} alt="" />
            </div>
        </div>
        <div className='buy3-img-div2'>
        <div className='buy3-text-under'>
                    <h1 className='buy3-text-under-h1'>BUY 3. GET FREE 1.</h1>
                    <p className='buy3-text-under-p'>50% off for selected products in Smartbook</p>
                    <button onClick={handleExploreNow} className='buy3-text-under-btn see-more-btn'>see more</button>
                </div>
                <img src={mulybooks} alt=""/>
        </div>
     </div>
    </div>
  )
}
export default Buy3