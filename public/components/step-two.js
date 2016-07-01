import React from 'react';

class StepTwo extends React.Component {
  render() {
    return (
      <div className="playground-step">
        <span className="step-number">2</span>
        <div className="step-content">
          <h2 className="step-title">Exchange Code from Token</h2>
          <p className="snippet-description">Your Code is </p>
          <div className="code-snippet">#4/SXjuF3gzD04OouqY_6-mfKyqV2VqoXF717ASRBTtL8w</div>
          <p>
            Now, we need to turn that access code into an access token,
            by having our server make a request to your token endpoint
          </p>
          <div className="code-box">
            <div className="code-box-title">
              Request
            </div>
            <div className="code-box-content">
              <div className="code-block">
                POST https://sample-oidc.auth0.com/oauth/token HTTP/1.1
                grant_type=authorization_code&
                client_id=7eruHypvzyvEjF5dNt2TN4tzKBE98PTc&
                client_secret=1fGXdsJnPfhodhwWCNQ_W7HpwrGGz
                redirect_url=https://openidconnect.net/callback&
                code=XXXXX
              </div>
              <hr />
              <button className="code-box-btn">Exchange</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StepTwo;
