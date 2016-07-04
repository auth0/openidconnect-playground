import React from 'react';
const Ajax = require('simple-ajax');

class TokenPanel extends React.Component {
  constructor() {
    super();
    this.update = this.update.bind(this);
    let oldState = localStorage.getItem('app-state')
    this.state = JSON.parse(oldState) || {};
    this.state.code = document.querySelector('input[name=code]').value;
  }
  render(){
    return (
      <div>
        <h2>Step 1 complete!</h2>
        <p>Your access code is:</p>
        <p>#{this.state.code}</p>
        <p>
					Now, we need to turn that access code into an access token,
					by having our server make a request to your token endpoint:
				</p>
        <GetTokenButton getToken={this.getToken.bind(this)} />
        <TokenResponse token={this.state.tokenResponse} />
      </div>
    )
  }
  getToken(){
    let panel = this
    let tokenRequest = new Ajax({
      url: '/code_to_token',
      method: 'POST',
      data: JSON.stringify(panel.state)
    })

    tokenRequest.on('success', function(event){
      panel.setState({
        tokenResponse: event.currentTarget.response
      })
      panel.update();
    })

    tokenRequest.send()
  }
  update(){

  }
}

const GetTokenButton = (props) => {
  return (
    <button type="button" onClick={props.getToken}>Get Token</button>
  )
}

const TokenResponse = (props) => {
  return (
    <div>{props.token}</div>
  )
}

export default TokenPanel
