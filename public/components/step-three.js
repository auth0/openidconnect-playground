import React from 'react';
import Ajax from 'simple-ajax';

class StepThree extends React.Component {
  constructor(){
    super();
    this.verify = this.verify.bind(this)

    let savedState = localStorage.getItem('app-state') || '{}'
    savedState = JSON.parse(savedState)

    this.state = savedState
    this.state.stepState = 'initial'
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

    validateToken.on('error', function(event) {
      this.setState({ stepState: 'error' })
    }.bind(this));

		validateToken.on('success', function(event){
      this.setState({ stepState: 'initial'})
			let result = JSON.parse(event.currentTarget.response)
      window.dispatchEvent(new CustomEvent('configChange', {
        detail: {
          validated: true,
          idTokenDecoded: JSON.stringify(result, null, ' '),
          currentStep: 4
        }
      }))
		}.bind(this))

    // TODO: Add error case

		validateToken.send()
  }
  render() {
    return (
      <div className={`playground-step ${this.props.isActive ? 'active' : '' }`}>
        <span className="step-number">3</span>
        <div className="step-content">
          <a id="step3"></a>
          <h2 className="step-title">Verify User Token</h2>
          <p>
            Now, we need to verify that the ID Token sent was from the correct place by validating the JWT's signature
          </p>

          <div className={this.props.idToken ? 'id-and-access-tokens' : 'hide'}>
            <div>
              <div className="snippet-description pull-left">Your “id_token” is</div>
              <a target="_" href={'https://jwt.io/#debugger?&id_token=' + this.props.idToken}><button className="btn-view-jwt">View on JWT.io</button></a>
            </div>
            <div className="code-snippet">
              {this.props.idToken}
            </div>

            <p style={{ display: (this.props.idTokenHeader == 'HS256') ? 'block': 'none'}}>
              {"This token is cryptographically signed with the"} <strong>HS256</strong> {"algorithm. We'll use the client secret to validate it."}
            </p>
            <p style={{ display: (this.props.idTokenHeader == 'RS256') ? 'block': 'none'}}>
              {"This token is cryptographically signed with the"} <strong>RS256</strong> {"algorithm. We'll use the public key of the OpenID Connect server to validate it. In order to do that, we'll fetch the public key from "}
              <strong>{this.props.tokenKeysEndpoint}</strong>{", which is found in the discovery document or configuration menu options."}
            </p>
            <div className="snippet-description pull-left hide">Your “access_token” is</div>
            <div className="code-snippet hide">{this.props.accessToken}</div>

            { this.state.stepState === 'wait' ?
              <div className="step-spinner-container">
                <div className="spinner spinner-md step-spinner">
                  <div className="circle"></div>
                </div>
              </div>
              : null }
            { this.state.stepState === 'error' ?
              <button onClick={this.verify} className="code-box-btn is-error">There was an error verifying your token. Try again.</button>
              : null }
            { this.state.stepState !== 'wait' && this.state.stepState !== 'error' ?
              <button onClick={this.verify} className="code-box-btn is-alt">Verify</button>
            : null }
        </div>

        </div>
      </div>
    );
  }
}

export default StepThree;
