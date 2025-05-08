import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <div className="footer-width-container">
        <Navbar />
      </div>
      
      <main className="content-width">
        {children}
      </main>
      
      <div className="footer-width-container">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;