import React from 'react';

const IntroductionPage = () =>
  <main className="introduction-page">
    <div className="introduction-container">
      <div className="introduction-section">
        <h2 className="section-title">Welcome to the OpenID Connect Playground!</h2>
        <p>
          This project was created at Auth0 to educate developers about OpenID Connect
          (also known as OIDC) and allow users to play with and test every step of the OpenID
          Connect login process.
        </p>
      </div>
      <div className="introduction-section">
        <h2 className="section-title">What is OpenID Connect/OIDC?</h2>
        <p>
          OIDC was created as an identity layer for OAuth 2.0-- because while OAuth provides a
          solid standard for user Authentication (proving they are who they say they are),
          developers needed a standard way of expressing user identity. Before, getting the
          same pieces of user information could be a completely different proccess for each
          OAuth provider. But with OIDC, you get the same fields in the same format, from any
          provider (as long as they implement OIDC!).
        </p>
        <p>
          You can learn even more about OIDC at the following resources:
        </p>
        <ul>
          <li><a href="https://auth0.com/resources/ebooks/the-openid-connect-handbook?ref=oidc-microsite">The OpenID Connect Handbook - free eBook</a></li>
          <li><a href="http://openid.net/">The OpenID Connect Standards site</a></li>
          <li><a href="http://openid.net/connect/faq/">OpenID Connect FAQ and Q&As</a></li>
          <li><a href="https://auth0.com/blog/openid-connect-final-spec-10/">OpenID Connect Specs are Final! - Auth0 Blog</a></li>
        </ul>
      </div>
      <div className="introduction-section">
        <h2 className="section-title">How will the playground help?</h2>
        <p>
          The playground allows users to see and test each step in the OIDC, with an Auth0
          template, a Google Accounts API template, or adding your own OIDC URLs.
          This is so users can not only learn more about OIDC, but test their own
          implementation and see each step working in series to create a robust login solution.
        </p>
      </div>
    </div>
  </main>;

export default IntroductionPage;
