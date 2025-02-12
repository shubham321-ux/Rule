import React, { useState } from 'react';
import './css/Community.css';
import stamp from "../assest/stamp.png"
import books from "../assest/3books.png"

const Community = () => {
    const [email, setEmail] = useState('');

    const customerdata = [
        {count:180, name:"Customers"},
        {count:120, name:"Authors"},
        {count:100, name:"Books"},
        {count:10, name:"Awards"},
    ]

    const handleSubscribe = () => {
        console.log('Subscribed email:', email);
        setEmail('');
    }

    return (
        <div className='community-main-div'>
            <div className='community-div1'>
                <div className='community-div1-under'>
                    <div className='community-div1-under-div1'>
                        <h2 className='main-heading main-head-community'>Join The Community</h2>
                        <p className='normal-para'>Newsletter to get inTouch</p>
                    </div>
                    <div className="footer-input-div">
                        <div className="contain-input">
                            <input
                                type="text"
                                className="footer-input"
                                placeholder="Enter Your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button 
                            className="footer-input-btn"
                            onClick={handleSubscribe}
                        >
                            Subscribe
                        </button>
                    </div>
                </div>
                <div className='community-stamp-img-div'>
                    <img src={stamp} alt="" />
                </div>
                <div className='community-books-img-div'>
                    <img src={books} alt="" />
                </div>
            </div>
            <div className='community-div2-map'>
                {customerdata.map((customer, index) => (
                    <div key={index} className='community-div2-map-div'>
                        <h1 className='community-div2-map-div-h1'>{customer.count}+</h1>
                        <p className='normal-para'>{customer.name}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Community
