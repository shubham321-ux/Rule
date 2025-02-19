// Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

// Layout Component
const Layout = () => {
  return (<>
   
      <Header />
  <div style={{zIndex:200}}>
        <Outlet /> 
        </div>
      <Footer />
  
  </>);
};

export default Layout;
