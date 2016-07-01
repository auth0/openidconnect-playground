import React from 'react';

class StepOne extends React.Component {
  render() {
    return (
      <div className="playground-step active">
        <span className="step-number">1</span>
        <div className="step-content">
          <h2 className="step-title">Redirect to OpenID Connector Server</h2>
          <div className="code-box">
            <h3 className="code-box-title">Request</h3>
            <div className="code-box-content">
              <div className="code-block">
                <a href=""> https://sample-oidc.auth0.com/authorize? </a>
                <br />
                client_id=
                <a href=""> {"7eruHypvzyvEjF5dNt2TN4tzKBE98PTc"} </a>
                <br />
                redirect_uri=https://openidconnect.net/callback 
                <br />
                scope=
                <a href=""> openid name email response_type=code </a>
                <br />
                state=poifhjoeif2
              </div>
              <hr />
              <div className="code-block">
                https://openidconnect.net/callback?code=#4/SXjuF3gzD04Oouq
              </div>
              <button className="code-box-btn">Start</button>
            </div>
          </div>
        </div>
        <button className="skip-tutorial btn-link">Skip this tutorial. Show me the complete flow.</button>
      </div>
    );
  }
}

export default StepOne;
