import React from 'react';

const Footer = () =>
  <div>
    <div className="bottom-callout text-center theme-dark">
      <img
        src="//cdn.auth0.com/styleguide/latest/lib/logos/img/logo-grey.png"
        width="130"
        role="presentation"
      />
      <p>The OIDC playground is brought to you by Auth0.</p>
      <p>
        A cloud service, APIs and tools that eliminate the friction
        of identity for your applications and APIs.
      </p>
      <a href="//auth0.com/signup/" className="btn btn-lg btn-success">{'Try Auth0 for Free'}</a>
    </div>
    <footer className="main-footer">
      <div className="container">
        <span>Crafted by</span>
        <span className="auth0-badge"></span>
        <span>© 2013-2016 Auth0 Inc. All Rights Reserved.</span>
      </div>
    </footer>
  </div>;

export default Footer;
