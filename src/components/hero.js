import React from "react";
import { Link } from "react-router";
import Auth0Logo from "./auth0-logo";

class Hero extends React.Component {
  constructor() {
    super();

    this.toggleMobileNav = this.toggleMobileNav.bind(this);
    this.state = {};
    this.state.navMobileOpen = false;
  }

  toggleMobileNav() {
    this.setState({
      navMobileOpen: !this.state.navMobileOpen,
    });
  }

  render() {
    return (
      <header className="main-header">
        <nav
          className={`main-navigation ${
            this.state.navMobileOpen ? "mobile-open" : ""
          }`}
        >
          <div className="container">
            <a href="" className="openid-logo">
              <h1 className="logo-text">OpenID</h1>
            </a>
            <ul className="navigation">
              <li className="navigation-item">
                <Link to="/">Debugger</Link>
              </li>
              <li className="navigation-item">
                <Link to="/introduction">Introduction</Link>
              </li>
              <li className="navigation-item">
                <a href="https://ask.auth0.com/category/openidconnect">Ask</a>
              </li>
              <li className="navigation-item">
                <a href="http://shop.spreadshirt.com/auth0/">Get a T-shirt!</a>
              </li>
            </ul>
            <div className="social-icons">
              <a
                href="https://auth0.com/developers?utm_source=openidconnect&utm_medium=navbar_whats_auth0&utm_campaign=openidconnect_nav_cta_12_2019"
                target="_blank"
              >
                <span className="crafted">Crafted by</span>
                <Auth0Logo />
                <span className="crafted-by__question-mark">?</span>
              </a>
            </div>
            <div className="trigger-nav" onClick={this.toggleMobileNav}>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
          </div>
          <div className="mobile-navigation">
            <ul className="mobile-nav-list">
              <li className="mobile-nav-item">
                <Link to="/" onClick={this.toggleMobileNav}>
                  Debugger
                </Link>
              </li>
              <li className="mobile-nav-item">
                <Link to="/introduction" onClick={this.toggleMobileNav}>
                  Introduction
                </Link>
              </li>
              <li className="mobile-nav-item">
                <a href="https://ask.auth0.com/category/openidconnect">Ask</a>
              </li>
              <li className="mobile-nav-item">
                <a href="http://shop.spreadshirt.com/auth0/">Get a T-shirt!</a>
              </li>
            </ul>
            <div className="mobile-crafted-by">
              <a
                href="https://auth0.com/?utm_source=openidconnect&amp;utm_campaign=craftedby"
                target="_blank"
              >
                <span className="crafted">Crafted by</span>
                <Auth0Logo />
              </a>
            </div>
          </div>
        </nav>
        <section className="hero">
          <div className="container">
            <h1 className="hero-title">OpenID Connect Playground</h1>
            <h2 className="hero-subtitle">
              The OIDC playground is for developers to test and work with OpenID
              Connect calls step-by-step, giving them more insight into how
              OpenID Connect works.
            </h2>
          </div>
        </section>
      </header>
    );
  }
}

export default Hero;
