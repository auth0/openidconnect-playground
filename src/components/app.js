import React from 'react';
import Hero from './hero';
import Footer from './footer';

class OpenIDPage extends React.Component {
  render() {
    return (
      <div className="openid-page">
        <Hero mobileNavigationOpen={this.mobileNavigationOpen} />
        { this.props.children }
        <Footer />
      </div>
    );
  }
}

export default OpenIDPage;
