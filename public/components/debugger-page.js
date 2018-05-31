import React from 'react';
import Ajax from 'simple-ajax';
import offset from 'document-offset';
import ReactDOM from 'react-dom';
import StepOne from './step-one';
import StepTwo from './step-two';
import StepThree from './step-three';
import StepFour from './step-four';
import ConfigurationModal from './configuration-modal';

class DebuggerPage extends React.Component {
  constructor() {
    super();
    this.update = this.update.bind(this);
    this.startOver = this.startOver.bind(this);
    this.scrollAnimated = this.scrollAnimated.bind(this);
    this.scrollToCurrentStep = this.scrollToCurrentStep.bind(this);
    this.openConfigurationModal = this.openConfigurationModal.bind(this);
    let savedState = localStorage.getItem('app-state') || '{}';
    savedState = JSON.parse(savedState);
    this.state = savedState;
    this.state.currentStep = this.state.currentStep || 1;
    this.state.server = this.state.server || 'Auth0';
    this.state.domain = this.state.domain || 'samples.auth0.com';
    this.state.authEndpoint = this.state.authEndpoint || 'https://samples.auth0.com/authorize';
    this.state.tokenEndpoint = this.state.tokenEndpoint || 'https://samples.auth0.com/oauth/token';
    this.state.tokenKeysEndpoint = this.state.tokenKeysEndpoint || '';
    this.state.userInfoEndpoint = this.state.userInfoEndpoint || 'https://samples.auth0.com/userinfo';
    this.state.scopes = this.state.scopes || 'openid profile email phone address';
    this.state.stateToken = this.state.stateToken || document.querySelector('input[name=stateToken]').value;
    this.state.redirectURI = this.state.redirectURI ||  document.querySelector('input[name=redirect-uri]').value;
    this.state.clientID = this.state.clientID ||  document.querySelector('input[name=auth0ClientID]').value;
    this.state.clientSecret = this.state.clientSecret ||  document.querySelector('input[name=auth0ClientSecret]').value;
    this.state.authCode = this.state.authCode || document.querySelector('input[name=code]').value;
    this.state.idTokenHeader = this.state.idTokenHeader || '';
    this.state.configurationModalOpen = false;
    this.state.configurationModalFocus = '';
    this.state.validated = this.state.validated || false;
    this.state.exchangeResult = this.state.exchangeResult || '';
    this.saveState();
  }

  componentDidMount() {
    // figure out what step we're on
    this.configureStep();
    // listen for config changes
    window.addEventListener('configChange', this.update.bind(this));
    window.addEventListener('discovery', this.updateURLs.bind(this));
  }

  setStep(step) {
    this.setState({ currentStep: step });
  }

  saveState() {
    localStorage.setItem('app-state', JSON.stringify(this.state));
  }

  configureStep() {
    let code = document.querySelector('input[name=code]').value;
    let token = this.state.idToken;
    let newStep = 0;

    if (code) {
      newStep = 2
      this.setState({
        currentStep: 2,
        authCode: code
      });

      window.dispatchEvent(new CustomEvent('returnFromAuth'));
    }

    if (token) {
      newStep = 3;
      this.setState({
        currentStep: 3
      });
    }

    if (this.state.validated) {
      newStep = 4;
      this.setState({
        currentStep: 4
      });
    }
    if (this.state.userProfile) {
      newStep = 5;
      this.setState({
        currentStep: 5
      });
    }
  }

  scrollAnimated(to, duration) {
    var doc = document.documentElement;
    var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    var start = top;
    var change = to - start;
    var currentTime = 0;
    var increment = 20;

    function easeInOut(currentTime, startValue, change, duration) {
      currentTime /= duration / 2;

      if (currentTime < 1) {
        return change / 2 * currentTime * currentTime + startValue;
      }

      currentTime--;

      return -change / 2 * (currentTime * (currentTime - 2) - 1) + startValue;
    }

    function animateScroll() {
      currentTime += increment;

      var val = easeInOut(currentTime, start, change, duration);

      window.scrollTo(0, val);

      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    }

    animateScroll();
  }

  update(event) {
    if (event && event.detail) {
      this.setState(event.detail);
      if (event.detail.server &&
          event.detail.server === 'custom' &&
          this.state.server !== 'custom') {
        this.setState({
          discoveryURL: '',
          authEndpoint: '',
          tokenEndpoint: '',
          tokenKeysEndpoint: '',
          userInfoEndpoint: '',
          currentStep: 1
        });
      } else if (event.detail.server &&
                event.detail.server === 'Auth0' &&
                this.state.server !== 'Auth0') {
        this.setState({
          domain: 'samples.auth0.com',
          clientID: document.querySelector('input[name=auth0ClientID]').value,
          clientSecret: document.querySelector('input[name=auth0ClientSecret]').value,
          currentStep: 1
        });
      } else if (event.detail.server && event.detail.server !== this.state.server) {
        this.setState({
          currentStep: 1,
          authToken: '',
          accessToken: '',
          idToken: '',
          userProfile: ''
        });
      }
    }

    if (event.detail.skipScroll) return;

    setTimeout(function() {
      this.saveState();

      if(this.state.currentStep > 1){
        this.scrollToCurrentStep()
      }
    }.bind(this), 250);
  }

  scrollToCurrentStep() {
    let c = this.refs['step' + this.state.currentStep];
    let elem = ReactDOM.findDOMNode(c);
    var scrollOffset = -30;

    return this.scrollAnimated(
      offset(elem).top + scrollOffset,
      600
    )
  }

  updateURLs(){
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

    this.discover(documentURL, function(discovered){
      this.setState({
        discoveryURL: documentURL,
        authEndpoint: discovered.authorization_endpoint,
        tokenEndpoint: discovered.token_endpoint,
        userInfoEndpoint: discovered.userinfo_endpoint,
        tokenKeysEndpoint: discovered.jwks_uri
      });
      this.saveState();
    }.bind(this));
  }
  discover(url, cb) {
    const serviceDiscovery = new Ajax({
      url: '/discover',
      method: 'GET',
      data: {
        url
      }
    });

    serviceDiscovery.on('success', function(event){
      let discovered = JSON.parse(event.currentTarget.response)
      if(cb && typeof cb == 'function') cb(discovered)
    }.bind(this))

    // TODO: Add error case

    serviceDiscovery.send();
  }

  openConfigurationModal(visibility, inputFocus) {
    window.dispatchEvent(new CustomEvent('configChange', {
      detail: {
        scopes: this.state.scopes
      }
    }));

    this.setState({
      configurationModalOpen: visibility,
      configurationModalFocus: inputFocus
    });

    // Add class to prevent page from scrolling when modal is opened
    document.body.classList.toggle('overflow-hidden', visibility);
  }

  startOver() {
    localStorage.clear();
    this.setState({ currentStep: 1 });

    window.dispatchEvent(new CustomEvent('startOver'));
  }

  render() {
    return (
      <div>
        <main className="playground">
          <div className="container">
            <div className="playground-header">
              <h2 className="playground-header-title">Debugger</h2>
              <div className="mode-switcher">
                <label>Mode:</label>
                <select className="form-control">
                  <option>OpenID Connect + OAuth2</option>
                  <option disabled>OpenID Connect (Coming soon)</option>
                </select>
              </div>
              <button
                onClick={ () => { this.openConfigurationModal(true); } }
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
                  ref="step1"
                  authEndpoint = {this.state.authEndpoint}
                  clientID = {this.state.clientID}
                  scopes = {this.state.scopes}
                  stateToken = {this.state.stateToken}
                  redirectURI = {this.state.redirectURI}
                  openModal={this.openConfigurationModal}
                  nextStep={ () => { this.setStep(2); } }
                  skipTutorial={ () => { this.setStep(4); }}
                  isActive={ this.state.currentStep === 1 }
                  scrollAnimated={this.scrollAnimated}
                />
                : null
              }
              { this.state.currentStep >= 2 ?
                <StepTwo
                  ref="step2"
                  tokenEndpoint= {this.state.tokenEndpoint}
                  authCode= {this.state.authCode}
                  clientID= {this.state.clientID}
                  clientSecret= {this.state.clientSecret}
                  openModal={this.openConfigurationModal}
                  server={this.state.server}
                  nextStep={ () => { this.setStep(3); } }
                  isActive={ this.state.currentStep === 2 }
                  scrollAnimated={this.scrollAnimated}
                />
                : null
              }
              { this.state.currentStep >= 3 ?
                <StepThree
                  ref="step3"
                  idToken= {this.state.idToken}
                  idTokenHeader= {this.state.idTokenHeader}
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
                  ref="step4"
                  startOver={this.startOver}
                  idTokenDecoded={this.state.idTokenDecoded}
                  isActive={ this.state.currentStep === 4 }
                />
                : null
              }
            </div>
          </div>
        </main>
        { this.state.configurationModalOpen ?
          <ConfigurationModal ref="config"
            closeModal={ () => { this.openConfigurationModal(false); } }
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
            focus = {this.state.configurationModalFocus}
          /> : null }
      </div>
    );
  }
}

export default DebuggerPage;
