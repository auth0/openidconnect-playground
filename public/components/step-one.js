import React from 'react';

class StepOne extends React.Component {

  constructor() {
    super();
    this.start = this.start.bind(this);
    this.state = {
      stepState: 'initial'
    };
  }

  start() {
    this.setState({ stepState: 'wait' });

    setTimeout(() => {
      this.setState({ stepState: 'response' });
      this.props.nextStep();
    }, 500);
  }

  render() {
    return (
      <div className={`playground-step ${this.props.isActive ? 'active' : '' }`}>
        <span className="step-number">1</span>
        <div className="step-content">
          <h2 className="step-title">Redirect to OpenID Connector Server</h2>
          <div className="code-box">
            <h3 className="code-box-title">
              Request
              { this.state.showResponse === 'response' ? ' / Response' : null }
            </h3>
            <div className="code-box-content">
              <div className="code-block">
                <a onClick={this.props.openModal} href="#"> { "https://sample-oidc.auth0.com/authorize?" } </a>
                <br />
                client_id=
                <a
                  onClick={this.props.openModal}
                  href="#"
                >
                {"7eruHypvzyvEjF5dNt2TN4tzKBE98PTc"}
                </a>
                <br />
                redirect_uri=https://openidconnect.net/callback 
                <br />
                scope=
                <a onClick={this.props.openModal} href="#"> openid name email response_type=code </a>
                <br />
                state=poifhjoeif2
              </div>
              <hr />
              { this.state.stepState === 'wait' ?
                <div className="theme-dark">
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
        </div>
        <button onClick={this.props.skipTutorial} className="skip-tutorial btn-link">Skip this tutorial. Show me the complete flow.</button>
      </div>
    );
  }
}

export default StepOne;
