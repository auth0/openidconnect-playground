import React from 'react';
import Hero from './hero';
import Footer from './footer';
import { Outlet } from 'react-router-dom';

class OpenIDPage extends React.Component {
  render() {
    return (
      <div className="openid-page">
        <Hero mobileNavigationOpen={this.mobileNavigationOpen} />
        <Outlet />
        <Footer />
      </div>
    );
  }
}

export default OpenIDPage;
