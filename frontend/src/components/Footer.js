import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import "./css/Footer.css";
import {
  AiOutlineInstagram,
  AiOutlineFacebook,
  AiOutlineTwitter,
} from "react-icons/ai";
const Footer = () => {
  return (
    <>
      <footer className="footer-main-div">
        <main className="footer-main-div-main">
          <div className="footer-main-div-main-div1">
            <div className="logo-para-div">
              <Logo />
              <p style={{ textWrap: "wrap" }} className="normal-para">
                Bokifa draws book lovers of all ages into a community, engage
                with booklovers and meet their favourite literary personalities.
              </p>
            </div>
            <div className="footer-main-div-contact">
              <div className="footer-main-div-contact">
                <p className="contact-number">+(91) 98765 – 46351</p>
                <p className="normal-para">info@bokifa.com</p>
              </div>
            </div>
          </div>
          <div className="footer-main-div-main-div2">
            <div className="footer-links-div1">
              <h2 className="footer-links-div1-h2">Quick Links</h2>
              <ul className="footer-links-div1-ul">
                <li className="footer-links-div1-ul-li">
                  <Link to="/" className="footer-links-div1-ul-li-link">
                    Action Books
                  </Link>
                </li>
                <li className="footer-links-div1-ul-li">
                  <Link to="/" className="footer-links-div1-ul-li-link">
                    Adventure Books
                  </Link>
                </li>
                <li className="footer-links-div1-ul-li">
                  <Link to="/" className="footer-links-div1-ul-li-link">
                    Comic Books
                  </Link>
                </li>
                <li className="footer-links-div1-ul-li">
                  <Link to="/" className="footer-links-div1-ul-li-link">
                    Drama Books
                  </Link>
                </li>
              </ul>
            </div>
            <div className="footer-links-div1">
              <h2 className="footer-links-div1-h2">Usefull Links</h2>
              <ul className="footer-links-div1-ul">
                <li className="footer-links-div1-ul-li">
                  <Link to="/products" className="footer-links-div1-ul-li-link">
                    Product
                  </Link>
                </li>
                <li className="footer-links-div1-ul-li">
                  <Link
                    to="/favorite-products"
                    className="footer-links-div1-ul-li-link"
                  >
                    Fevorite
                  </Link>
                </li>
                <li className="footer-links-div1-ul-li">
                  <Link to="/myorders" className="footer-links-div1-ul-li-link">
                    My Orders
                  </Link>
                </li>
              </ul>
            </div>
            <div className="footer-links-div1 add-size-footer">
              <h2 className="footer-links-div1-h2">Stay in Touch</h2>
              <p className="normal-para-footer">
                Subscribe to our newsletter and stay updated on latest offers,
                discounts and events near you.
              </p>
              <div className="footer-input-div">
                <div className="contain-input">
                  <input
                    type="text"
                    className="footer-input"
                    placeholder="Enter Your Email"
                  />
                </div>
                <button className="footer-input-btn">Subscribe</button>
              </div>
            </div>
          </div>
        </main>
        <div className="footer-main-div-main2">
          <p className="footer-copyright">
            Copyright © 2024 Bokifa. All rights reserved
          </p>
          <div className="logo-div-footer">
  <Link to="/">
    <div className="footer-social-media-icons">
      <AiOutlineInstagram size={32} color="white" />
    </div>
  </Link>
  
  <Link to="/">
    <div className="footer-social-media-icons">
      <AiOutlineFacebook size={32} color="white" />
    </div>
  </Link>
  
  <Link to="/">
    <div className="footer-social-media-icons">
      <AiOutlineTwitter size={32} color="white" />
    </div>
  </Link>
</div>

        </div>
      </footer>
    </>
  );
};
export default Footer;
