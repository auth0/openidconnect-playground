import React from 'react';
import Ajax from 'simple-ajax'

class StepThree extends React.Component {
  constructor(){
    super();
    this.verify = this.verify.bind(this)
  }
  verify(){
    this.setState({ stepState: 'wait' })
		let validateToken = new Ajax({
			url: '/validate',
			method: 'POST',
			data: JSON.stringify({
				clientSecret: this.props.clientSecret,
        idToken: this.props.idToken,
        tokenKeysEndpoint: this.props.tokenKeysEndpoint,
        server: this.props.server
			})
		})

		validateToken.on('success', function(event){
      console.log('validated!')
      this.setState({ stepState: 'initial'})
			let result = JSON.parse(event.currentTarget.response)
      window.dispatchEvent(new CustomEvent('configChange', {
        detail: {
          validated: true,
          decodedId: result,
          currentStep: 4
        }
      }))
		}.bind(this))

    // TODO: Add error case

		validateToken.send()
  }
  render() {
    return (
      <div className="playground-step">
        <span className="step-number">3</span>
        <div className="step-content">
          <h2 className="step-title">Verify User Token</h2>
          <p>
            Now, we need to verify that the ID Token sent was from the correct place by validating the JWT's signature
          </p>
          <div>
            <div className="snippet-description pull-left">Your “id_token” is</div>
            <button className="btn-view-jwt">View on JWT.io</button>
          </div>
          <div className="code-snippet">
            {this.props.idToken}
          </div>
          <div className="snippet-description pull-left">Your “access_token” is</div>
          <div className="code-snippet">{this.props.accessToken}</div>
          <div className="code-box">
            <div className="code-box-title">Validate ID Token</div>
            <div className="code-box-content">
              <div className="code-block">
                POST https://openidconnect.net/validate?provider={this.props.server}&amp;tokenKeysEndpoint={this.props.tokenKeysEndpoint}&amp;clientSecret={this.props.clientSecret}
              </div>
              <hr />
              <button onClick={this.verify} className="code-box-btn">Verify</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StepThree;
