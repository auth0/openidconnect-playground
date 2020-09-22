import React from 'react'
import Ajax from 'simple-ajax'
import offset from 'document-offset'

class StepTwo extends React.Component {
  constructor(){
    super()
    this.start = this.start.bind(this)

    let savedState = localStorage.getItem('app-state') || '{}'
    savedState = JSON.parse(savedState)

    this.state = savedState
    this.state.exchangeResult = '';
    this.state.stepState = 'initial'
  }
  start(){
    this.setState({ stepState: 'wait' })
    const data = {
      code: this.props.authCode,
      clientID: this.props.clientID,
      clientSecret: this.props.clientSecret,
      server: this.props.server,
      tokenEndpoint: this.props.tokenEndpoint
    }

    if(this.props.audience && this.props.audience !== '') {
      data.audience = this.props.audience;
    }

		let serviceDiscovery = new Ajax({
			url: '/code_to_token',
			method: 'POST',
			data: JSON.stringify(data)
		})

		serviceDiscovery.on('success', function(event){
      this.setState({ stepState: 'initial'})
      let result = JSON.parse(JSON.parse(event.currentTarget.response).body)

      let exchangeResult = {
        status: JSON.parse(event.currentTarget.response).response.statusCode,
        body: result
      };

      this.setState({ exchangeResult: exchangeResult });

      if(result.error_description) {
        this._customError = result.error_description;

        return this.setState({ stepState: 'error' });
      }

      let payload = result.id_token.split('.')[0]
      payload = atob(payload)
      payload = JSON.parse(payload).alg
      window.dispatchEvent(new CustomEvent('configChange', {
        detail: {
          accessToken: result.access_token,
          idToken: result.id_token,
          idTokenHeader: payload,
          skipScroll: true
        }
      }))

      this.props.scrollAnimated(
        offset(this.stepCodeBox).top - 20,
        600
      )
		}.bind(this))

    serviceDiscovery.on('error', function(event) {
      return this.setState({ stepState: 'error' })
    }.bind(this))

		serviceDiscovery.send()
  }
  goToNextStep() {
    window.dispatchEvent(new CustomEvent('configChange', {
      detail: {
        currentStep: 3
      }
    }))
  }
  render() {
    return (
      <div className={`playground-step ${this.props.isActive ? 'active' : '' }`} >
        <span className="step-number">2</span>
        <div className="step-content">
          <a id="step2"></a>
          <h2 className="step-title">Exchange Code from Token</h2>
          <p className="snippet-description">Your Code is </p>
        <div className="code-snippet">{this.props.authCode}</div>
          <p>
            Now, we need to turn that access code into an access token,
            by having our server make a request to your token endpoint
          </p>
          <div className="code-box" ref={ node => this.stepCodeBox = node}>
            <div className="code-box-title">
              Request
            </div>
            <div className="code-box-content">
              <div className="code-block">
                POST {this.props.tokenEndpoint}
                  <br />
                  grant_type=authorization_code
                  <br />
                  &amp;client_id=<a onClick={() => { this.props.openModal(true, 'clientID') }} href="#">{this.props.clientID}</a>
                  <br />
                  &amp;client_secret=<a onClick={() => { this.props.openModal(true, 'clientSecret') }} href="#">{this.props.clientSecret}</a>
                  <br />
                  &amp;redirect_uri=https://openidconnect.net/callback
                  <br />
                  &amp;code={this.props.authCode}

                  {this.props.audience&& <br/>}
                  {this.props.audience&& '&audience='}
                  {this.props.audience&& <a onClick={() => { this.props.openModal(true, 'audience') }} href="#">{this.props.audience}</a>}
              </div>
              <hr />
              { this.state.exchangeResult ?
                <div className="exchange-result">
                  <div className="code-block" id="exchangeResponse">
                    {'HTTP/1.1 ' + JSON.stringify(this.state.exchangeResult.status)}
                    <br />
                    {'Content-Type: application/json'}
                    <div className="json-result">
                    {JSON.stringify(this.state.exchangeResult.body, null, 2)}
                    </div>
                  </div>

                  <button onClick={this.goToNextStep} className="code-box-btn">Next</button>
                </div>
                : null }
              { this.state.stepState === 'wait' ?
                <div className="theme-dark step-spinner-container">
                  <div className="spinner spinner-md step-spinner">
                    <div className="circle"></div>
                  </div>
                </div>
                : null }
              { this.state.stepState === 'error' ?
                <button onClick={this.start} className="code-box-btn is-error">{this._customError || 'The exchange could not be performed.'}</button>
                : null }
              { this.state.stepState !== 'wait' && this.state.stepState !== 'error' && !this.state.exchangeResult ?
                <button onClick={this.start} className="code-box-btn">Exchange</button>
              : null }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StepTwo;
