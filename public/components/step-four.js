import React from 'react';
import Ajax from 'simple-ajax';

class StepFour extends React.Component{
  constructor(){
    super()
    this.getUserProfile = this.getUserProfile.bind(this)
  }
  getUserProfile(){
    console.log('profile time!')
    this.setState({ stepState: 'wait' })
		let validateToken = new Ajax({
			url: this.props.userInfoEndpoint,
			method: 'GET',
      headers: {
        Authorization: 'Bearer ' + this.props.accessToken
      }
		})

		validateToken.on('success', function(event){
      this.setState({ stepState: 'initial'})
			let result = JSON.parse(event.currentTarget.response)
    	window.dispatchEvent(new CustomEvent('configChange', {
        detail: {
          userProfile: result,
          currentStep: 5
        }
      }))
		}.bind(this))

    validateToken.send()
  }
  render(){ 
    return (
      <div className="playground-step">
        <span className="step-number">4</span>
        <div className="step-content">
          <h2 className="step-title">Get User Profile</h2>
          <p>
            Let's use our verified ID Token to get user profile information!
          </p>
          <div className="code-box-title">Validate ID Token</div>
          <div className="code-box-content">
            <div className="code-block">
              GET {this.props.userInfoEndpoint}
              <br />
              Authorization: Bearer {this.props.accessToken}
            </div>
            <hr />
            <button onClick={this.getUserProfile} className="code-box-btn">Get User Profile</button>
          </div>
        </div>
      </div>
    )
  }
}

export default StepFour;