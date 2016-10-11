import React from 'react';
import offset from 'document-offset';
import { validateUrl } from '../utils';

class StepOne extends React.Component {

  constructor() {
    super();

    this.start = this.start.bind(this);
    this.update = this.update.bind(this);
    this.returnFromAuth = this.returnFromAuth.bind(this);

    let savedState = localStorage.getItem('app-state') || '{}'
    savedState = JSON.parse(savedState)

    this.state = savedState
    this.state.stepState = 'initial'
    this.state.isActiveStep = (this.state.currentStep === 1)
  }

  update(){
    this.forceUpdate();
  }

  start() {
    if(!this.props.authEndpoint) {
      return alert('Plase enter an authorization endpoint');
    }

    this.setState({
      stepState: 'wait'
    });

    if (!validateUrl(this.completeURL)) {
      alert('You entered an invalid server address');
      return window.location.reload();
    }

    window.location = this.completeURL
  }

  returnFromAuth() {
    let c = this;

    c.setState({
      stepState: 'wait',
      isActiveStep: c.props.isActive
    });

    setTimeout(function() {
      let step2 = document.getElementById('step2');

      c.setState({
        stepState: 'initial',
        isActiveStep: false
      });

      c.props.scrollAnimated(offset(step2).top - 30, 600);
    }, 1000);
  }

  componentDidMount() {
    var c = this;

    window.addEventListener('returnFromAuth', function() {
      c.returnFromAuth()
    });

    window.addEventListener('startOver', function() {
      c.setState({
        isActiveStep: true
      });
    });
  }

  render() {
    this.completeURL = this.props.authEndpoint + '?client_id=' + this.props.clientID + '&redirect_uri=' + this.props.redirectURI + '&audience=' + encodeURI(this.props.audience) + '&scope=' + encodeURI(this.props.scopes) + '&response_type=code&state=' + this.props.stateToken

    return (
      <div className={`playground-step ${this.state.isActiveStep ? 'active' : '' }`}>
        <span className="step-number">1</span>
        <div className="step-content">
          <h2 className="step-title">Redirect to OpenID Connect Server</h2>
          <div className="code-box">
            <h3 className="code-box-title">
              Request
              { this.state.showResponse === 'response' ? ' / Response' : null }
            </h3>
            <div className="code-box-content">
              <div className="code-block">
                <a onClick={() => { this.props.openModal(true, 'authEndpoint') }} href="#"> { this.props.authEndpoint || "Enter an authorization endpoint"}? </a>
                <div className="code-block-url-params">
                  client_id=
                  <a onClick={() => { this.props.openModal(true, 'clientID') }} href="#">{this.props.clientID}</a>
                  <br />
                  &amp;redirect_uri=
                  https://openidconnect.net/callback 
                  <br />
                  &amp;audience=
                  <a onClick={() => { this.props.openModal(true, 'audience') }} href="#">{this.props.audience}</a>
                  <br />
                  &amp;scope=
                  <a onClick={() => { this.props.openModal(true, 'scopes') }} href="#">{this.props.scopes}</a>
                  <br/>
                  <span>&amp;response_type=code</span>
                  <br />
                  <span>&amp;state={this.props.stateToken}</span>
                </div>
              </div>
              <hr />
              { this.state.stepState === 'wait' ?
                <div className="theme-dark step-spinner-container">
                  <div className="spinner spinner-md step-spinner">
                    <div className="circle"></div>
                  </div>
                </div>
                : null }
              { this.state.stepState === 'response' ?
                <div className="code-block">
                  https://openidconnect.net/callback?code=#4/SXjuF3gzD04Oouq
                </div>
                : null
              }
              { this.state.stepState !== 'wait' ?
                <button onClick={this.start} className="code-box-btn">Start</button>
              : null }
            </div>
          </div>
          <br />
        </div>
        <button
          onClick={this.props.skipTutorial}
          style={this.state.isActiveStep ? {} : {visibility: 'hidden'}}
          className="skip-tutorial btn-link"
        >
          Skip this tutorial. Show me the complete flow.
        </button>
      </div>
    );
  }
}

export default StepOne;
