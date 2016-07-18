import React from 'react';
import Ajax from 'simple-ajax'
import StepOne from './step-one';
import StepTwo from './step-two';
import StepThree from './step-three';
import StepFour from './step-four';
import ConfigurationModal from './configuration-modal';

class OpenIDPage extends React.Component {

  constructor() {
    super();
    this.update = this.update.bind(this)
		let savedState = localStorage.getItem('app-state') || '{}'
		savedState = JSON.parse(savedState)
		this.state = savedState
    this.state.currentStep = this.state.currentStep || 1
    this.state.server = this.state.server || 'Auth0'
    this.state.domain = this.state.domain || 'samples.auth0.com'
    this.state.authEndpoint = this.state.authEndpoint || 'https://samples.auth0.com/authorize'
    this.state.tokenEndpoint = this.state.tokenEndpoint || 'https://samples.auth0.com/oauth/token'
    this.state.tokenKeysEndpoint = this.state.tokenKeysEndpoint || ''
    this.state.userInfoEndpoint = this.state.userInfoEndpoint || 'https://samples.auth0.com/userinfo'
    this.state.scopes = this.state.scopes || 'openid profile email'
    this.state.stateToken = this.state.stateToken || document.querySelector('input[name=stateToken]').value
    this.state.redirectURI = this.state.redirectURI ||  document.querySelector('input[name=redirect-uri]').value
    this.state.clientID = this.state.clientID ||  document.querySelector('input[name=auth0ClientID]').value
    this.state.clientSecret = this.state.clientSecret ||  document.querySelector('input[name=auth0ClientSecret]').value
    this.state.authCode = this.state.authCode || document.querySelector('input[name=code]').value
    this.state.configurationModalOpen = false
    this.saveState()
  }

  componentDidMount(){
    // figure out what step we're on
    this.configureStep()
    //listen for config changes
    window.addEventListener('configChange', this.update.bind(this))
    window.addEventListener('discovery', this.updateURLs.bind(this))
  }

  configureStep(){
      let code = document.querySelector('input[name=code]').value
      let token = this.state.idToken
      if(code){
        this.setState({
          currentStep: 2,
          authCode: code
        })
      }
      if(token){
        this.setState({
          currentStep: 3
        })
      }
  }

  update(event){
    if(event && event.detail){
      this.setState(event.detail)
      if(event.detail.server && event.detail.server == 'custom' && this.state.server !== 'custom'){
        this.setState({
          discoveryURL: '',
          authEndpoint: '',
          tokenEndpoint: '',
          tokenKeysEndpoint: '',
          userInfoEndpoint: '',
          currentStep: 1
        })
      } else if(event.detail.server && event.detail.server == 'Auth0' && this.state.server !== 'Auth0'){
        this.setState({
          domain: 'samples.auth0.com',
          currentStep: 1
        })
      } else if(event.detail.server && event.detail.server !== this.state.server){
        this.setState({
          currentStep: 1
        })
      }
    }
    setTimeout(this.saveState.bind(this), 250)
  }

  updateURLs(){
    console.log(this.state.server)
    if(this.state.server == 'google'){
      this.updateDiscovery('https://accounts.google.com/.well-known/openid-configuration')
    } else if (this.state.server == 'Auth0'){
      this.updateDiscovery('https://' + this.state.domain + '/.well-known/openid-configuration')
    } else {
      this.updateDiscovery(this.state.discoveryURL)
    }
  }
	updateDiscovery(documentURL){
    documentURL = documentURL || this.state.discoveryURL
    console.log('discovering...', documentURL)
		this.discover(documentURL, function(discovered){
			this.setState({
				discoveryURL: documentURL,
				authEndpoint: discovered.authorization_endpoint,
				tokenEndpoint: discovered.token_endpoint,
        userInfoEndpoint: discovered.userinfo_endpoint,
        tokenKeysEndpoint: discovered.jwks_uri
			})
      this.saveState()
		}.bind(this))
	}
	discover(url, cb){
		let serviceDiscovery = new Ajax({
			url: '/discover',
			method: 'GET',
			data: {
				url
			}
		})

		serviceDiscovery.on('success', function(event){
			let discovered = JSON.parse(event.currentTarget.response)
      if(cb && typeof cb == 'function') cb(discovered)
		}.bind(this))

    // TODO: Add error case

		serviceDiscovery.send()
	}

  setConfigurationModalVisibility(v) {
    this.setState({ configurationModalOpen: v });
    // Add class to prevent page from scrolling when modal is opened
    document.body.classList.toggle('overflow-hidden', v);
  }

  setStep(step) {
    this.setState({ currentStep: step });
  }

  render() {
    return (
      <div className="openid-page">

        <header className="main-header">
          <nav className="main-navigation">
            <div className="container">
              <a href="" className="openid-logo">
                <h1 className="logo-text">OpenID</h1>
              </a>
              <ul className="navigation">
                <li className="navigation-item">
                  <a href="">Debugger</a>
                </li>
                <li className="navigation-item">
                  <a href="">Libraries</a>
                </li>
                <li className="navigation-item">
                  <a href="">Introduction</a>
                </li>
                <li className="navigation-item">
                  <a href="">Ask</a>
                </li>
                <li className="navigation-item">
                  <a href="">Get a T-shirt!</a>
                </li>
              </ul>
              <div className="social-icons">
                <a href="" className="auth0-icon"></a>
                <a href="" className="twitter-icon"></a>
              </div>
            </div>
          </nav>
          <section className="hero">
            <div className="container">
              <h1 className="hero-title">OpenID Connect Playground</h1>
              <h2 className="hero-subtitle">
                The OIDC playground is so developers can test and work with OpenID
                Connect calls step-by-step, giving them more insight into how OpenID Connect works.
              </h2>
            </div>
          </section>
        </header>

        <main className="playground">
          <div className="container">
            <div className="playground-header">
              <h2 className="playground-header-title">Debugger</h2>
              <button
                onClick={ () => { this.setConfigurationModalVisibility(true); } }
                className="playground-header-config btn btn-link"
                href=""
              >
                <i className="icon-budicon-329"></i>
                Configuration
              </button>
            </div>
            <div className="playground-content">
              { this.state.currentStep >= 1 ?
                <StepOne
                  authEndpoint = {this.state.authEndpoint}
                  clientID = {this.state.clientID}
                  scopes = {this.state.scopes}
                  stateToken = {this.state.stateToken}
                  redirectURI = {this.state.redirectURI}
                  openModal={ () => { this.setConfigurationModalVisibility(true); } }
                  nextStep={ () => { this.setStep(2); } }
                  skipTutorial={ () => { this.setStep(4); }}
                  isActive={ this.state.currentStep === 1 }
                />
                : null
              }
              { this.state.currentStep >= 2 ?
                <StepTwo
                  tokenEndpoint= {this.state.tokenEndpoint}
                  authCode= {this.state.authCode}
                  clientID= {this.state.clientID}
                  clientSecret= {this.state.clientSecret}
                  server={this.state.server}
                  nextStep={ () => { this.setStep(3); } }
                  isActive={ this.state.currentStep === 2 }
                />
                : null
              }
              { this.state.currentStep >= 3 ?
                <StepThree
                  idToken= {this.state.idToken}
                  accessToken= {this.state.accessToken}
                  clientSecret= {this.state.clientSecret}
                  server= {this.state.server}
                  tokenKeysEndpoint= {this.state.tokenKeysEndpoint}
                  isActive={ this.state.currentStep === 3 }
                />
                : null
              }
              { this.state.currentStep >= 4 ?
                <StepFour
                  isActive={ this.state.currentStep === 4 }
                />
                : null
              }
            </div>
          </div>
        </main>
        {this.state.configurationModalOpen ?
          <ConfigurationModal ref="config"
            closeModal={ () => { this.setConfigurationModalVisibility(false); } }
            discoveryURL={this.state.discoveryURL}
            authEndpoint= {this.state.authEndpoint}
            tokenEndpoint= {this.state.tokenEndpoint}
            tokenKeysEndpoint= {this.state.tokenKeysEndpoint}
            userInfoEndpoint= {this.state.userInfoEndpoint}
            domain= {this.state.domain}
            server = {this.state.server}
            clientID= {this.state.clientID}
            clientSecret= {this.state.clientSecret}
            scopes = {this.state.scopes}
          />
          : null }
        <footer className="main-footer">
          <div className="container">
            <span>Crafted by</span>
            <span className="auth0-badge"></span>
            <span>© 2013-2016 Auth0 Inc. All Rights Reserved.</span>
          </div>
        </footer>

      </div>
    );
  }
	saveState(){
    console.log(this.state)
		localStorage.setItem('app-state', JSON.stringify(this.state))
	}
}


export default OpenIDPage;
