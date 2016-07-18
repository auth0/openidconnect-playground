import React from 'react'
import Ajax from 'simple-ajax'

class StepTwo extends React.Component {
  constructor(){
    super()
    this.start = this.start.bind(this)
  }
  start(){
    this.setState({ stepState: 'wait' })
		let serviceDiscovery = new Ajax({
			url: '/code_to_token',
			method: 'POST',
			data: JSON.stringify({
				code: this.props.authCode,
        clientID: this.props.clientID,
        clientSecret: this.props.clientSecret,
        server: this.props.server,
        tokenEndpoint: this.props.tokenEndpoint
			})
		})

		serviceDiscovery.on('success', function(event){
      this.setState({ stepState: 'initial'})
      let result = JSON.parse(JSON.parse(event.currentTarget.response).body)
      console.log(result)
      let payload = result.id_token.split('.')[0]
      payload = atob(payload)
      payload = JSON.parse(payload).alg
      window.dispatchEvent(new CustomEvent('configChange', {
        detail: {
          accessToken: result.access_token,
          idToken: result.id_token,
          idTokenHeader: payload,
          currentStep: 3
        }
      }))
		}.bind(this))

    // TODO: Add error case

		serviceDiscovery.send()
  }
  render() {
    return (
      <div className={`playground-step ${this.props.isActive ? 'active' : '' }`} >
        <span className="step-number">2</span>
        <div className="step-content">
          <h2 className="step-title">Exchange Code from Token</h2>
          <p className="snippet-description">Your Code is </p>
        <div className="code-snippet">{this.props.authCode}</div>
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
                POST {this.props.tokenEndpoint} HTTP/1.1
                grant_type=authorization_code&amp;
                client_id={this.props.clientID}&amp;
                client_secret={this.props.clientSecret}
                redirect_url=https://openidconnect.net/callback&amp;
                code={this.props.authCode}
              </div>
              <hr />
              <button onClick={this.start} className="code-box-btn">Exchange</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StepTwo;
