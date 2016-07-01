import React from 'react';

class StepThree extends React.Component {
  render() {
    return (
      <div className="playground-step">
        <span className="step-number">3</span>
        <div className="step-content">
          <h2 className="step-title">Exchange Code from Token</h2>
          <div>
            <div className="snippet-description pull-left">Your “id_token” is</div>
            <button className="btn-view-jwt">View on JWT.io</button>
          </div>
          <div className="code-snippet">
            “hjvcbhvbjvchbjcvhbjcvhbjvchbjcvhbjcvbhcjvxcvcvcvcvcvcvcvcvcc
          </div>
          <p>
            Now, we need to turn that access code into an access token,
            by having our server make a request to your token endpoint
          </p>
          <p>Your “access_token” is</p>
          <div className="code-snippet">“SIAV32hkKG”</div>
          <div className="code-box">
            <div className="code-box-title">Request</div>
            <div className="code-box-content">
              <div className="code-block">
                GET https://sample-oidc.auth0.com/userinfo
                ? access_token= “SIAV32hkKG”
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

export default StepThree;
