import React from 'react'

class InputPanel extends React.Component{
	constructor(){
		super()
		this.update = this.update.bind(this)
		let oldState = localStorage.getItem('app-state')
		this.state = JSON.parse(oldState) || {}
		this.state.warning = false
	}
	render(){
		return (
			<div>
				<div class="inputs">
					<ServerPicker ref="server" name="server" server={this.state.server} label="OpenID Connect Server" update={this.update} />
					<ServerURLInput ref="serverURL" val={this.state.serverURL} update={this.update} />
					<p id="warning" style={{display:(this.state.warning ? 'block' : 'none')}}>Remember to set {this.state.serverURL}/callback as an allowed callback with your application!</p>
					<InputValue ref="authEndpoint" name="authEndpoint" label="Authorization Endpoint" val={this.state.authEndpoint} pholder="/authorize" update={this.update} />
					<InputValue ref="tokenEndpoint" name="tokenEndpoint" label="Token Endpoint" pholder="/token" val={this.state.tokenEndpoint} update={this.update} />
					<InputValue ref="clientID" name="clientID" label="Client ID" val={this.state.clientID} update={this.update} />
					<InputValue ref="clientSecret" name="clientSecret" label="Client Secret" val={this.state.clientSecret} update={this.update} />
					<InputValue ref="scope" name="scope" label="Scope" val={this.state.scope} pholder="openid name email" update={this.update} />
				</div>
				<OIDCURL server={this.state.serverURL} authEndpoint={this.state.authEndpoint} clientID={this.state.clientID} scope= {this.state.scope} stateToken={this.state.stateToken} />
				<RedirectButton redirect={this.authRedirect.bind(this)} />
			</div>
		)
	}
	componentDidMount(){
		this.updateServerURL(this.refs.server.refs.value.value, this.refs.serverURL.refs.value.value);
		this.updateStateToken();
	}
	update(e){
		if(!localStorage.getItem('app-state')){
			this.setState({
				server: null,
				authEndpoint: null,
				tokenEndpoint: null,
				clientID: null,
				clientSecret: null,
				scope: null
			})
		}
		this.updateServerURL(this.refs.server.refs.value.value, this.refs.serverURL.refs.value.value);

		document.querySelector("select[name=server]").removeAttribute('value')

		this.setState({
			server: this.refs.server.refs.value.value,
			authEndpoint: this.refs.authEndpoint.refs.value.value,
			tokenEndpoint: this.refs.tokenEndpoint.refs.value.value,
			clientID: this.refs.clientID.refs.value.value,
			clientSecret: this.refs.clientSecret.refs.value.value,
			scope: this.refs.scope.refs.value.value,
			stateToken: document.querySelector('input[name=stateToken]').value	
		})

		this.updateServerURL(this.refs.server.refs.value.value, this.refs.serverURL.refs.value.value);
	}
	updateServerURL(type, URL){
		if(type !== 'none'){
			this.refs.serverURL.refs.value.disabled = false;
		} else {
			this.refs.serverURL.refs.value.disabled = true;
		}

		let changed = !(type == this.state.server)

		if(type == 'Auth0'){
			this.refs.serverURL.updateLabel("Your Auth0 Domain", "https://domain.auth0.com");
			this.setState({
				serverURL: changed ? 'https://' : (URL || 'https://'),
				clientID:  this.refs.clientID.refs.value.value || this.state.savedClientID || 'BUIJSW9x60sIHBw8Kd9EmCbj8eDIFxDC',
				clientSecret: this.refs.clientSecret.refs.value.value || this.state.savedSecret || 'gcyGiDHsIE6bUT9oAs6ghuynjt8usUqTRglg8n8eWqw9SgnGJ5cRLCUz03gJ_s_X',
				authEndpoint: '/authorize',
				tokenEndpoint: '/oauth/token',
				completeURL: URL + '/authorize?client_id='+ encodeURIComponent(this.refs.clientID.refs.value.value) +'&scope='+ encodeURIComponent(this.refs.scope.refs.value.value) + '&response_type=code&redirect_uri=' + document.querySelector("[name=redirect-uri]").value  + '&state=' + this.state.stateToken,
				warning: !this.state.clientID || this.state.clientID == 'BUIJSW9x60sIHBw8Kd9EmCbj8eDIFxDC' ? false : true
			})
		} else if(type == 'custom'){
			this.refs.serverURL.updateLabel("Server URL", "https://sample-oidc.com");
			this.setState({
				serverURL: changed ? 'https://' : (URL || 'https://'),
				clientID: this.refs.clientID.refs.value.value || this.state.savedClientID || '',
				clientSecret: this.refs.clientSecret.refs.value.value || this.state.savedSecret || '',
				authEndpoint: '/authorize',
				tokenEndpoint: '/oauth/token',
				completeURL: URL + '/' + encodeURIComponent(this.refs.authEndpoint.refs.value.value) +'?client_id='+  encodeURIComponent(this.refs.clientID.refs.value.value) +'&scope='+ encodeURIComponent(this.refs.scope.refs.value.value) + '&response_type=code&redirect_uri=' + document.querySelector("[name=redirect-uri]").value + '&state=' + this.state.stateToken,
				warning: true
			})
		} else if(type == 'google'){
			this.refs.serverURL.updateLabel("Server URL", "https://sample-oidc.com");
			this.refs.serverURL.refs.value.disabled = true
			this.refs.authEndpoint.refs.value.disabled = true
			this.refs.tokenEndpoint.refs.value.disabled = true
			this.setState({
				serverURL: "https://accounts.google.com/o/oauth2/v2",
				authEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
				tokenEndpoint: "https://www.googleapis.com/oauth2/v4/token",
				clientID: changed ? (this.state.savedClientID || '') : (this.refs.clientID.refs.value.value || this.state.savedClientID || ''),
				clientSecret: changed ? (this.state.savedClientID || '') : (this.refs.clientSecret.refs.value.value || this.state.savedSecret || ''),
				completeURL: 'https://accounts.google.com/o/oauth2/v2/auth?client_id='+  encodeURIComponent(this.refs.clientID.refs.value.value) +'&scope='+ encodeURIComponent(this.refs.scope.refs.value.value) + '&response_type=code&redirect_uri=' + document.querySelector("[name=redirect-uri]").value + '&state=' + this.state.stateToken,
				warning: true
			})
		}
	}
	updateStateToken(){
		if(!this.state.stateToken){
			this.setState({
				stateToken: document.querySelector('input[name=stateToken]').value
			});
		}
	}
	authRedirect(){
		this.setState({
			savedClientID: this.state.clientID,
			savedClientSecret: this.state.clientSecret
		})
		localStorage.setItem('app-state', JSON.stringify(this.state))
		window.location = this.state.completeURL
	}
}

class InputValue extends React.Component{
	render(){
		return (
			<div>
				<label for={this.props.name}>{this.props.label}:</label>
				<input name={this.props.name} ref="value" value={this.props.val} onChange={this.props.update} placeholder={this.props.pholder} />
			</div>
		)		
	}
}

class ServerURLInput extends React.Component{
	constructor(){
		super();
		this.state = {
			label: "Server URL",
			placeholder: "https://sample-oidc.com"
		}
	}
	render(){
		return(
			<div>
				<label for="serverUrl">{this.state.label}:</label>
				<input name="serverUrl" ref="value" value={this.props.val} onChange={this.props.update} placeholder={this.state.pholder} />
			</div>
		)
	}
	updateLabel(label, pholder){
		this.setState({
			label,
			pholder
		});
	}
}

class ServerPicker extends React.Component{
	render(){
		return (
			<div>
				<label for={this.props.name}>{this.props.label}:</label>
				<select name={this.props.name} value={this.props.server} ref="value" onChange={this.props.update}>
					<option value="none">SELECT A SERVER</option>
					<option value="Auth0">Auth0</option>
					<option value="google">Google</option>
					<option value="custom">Custom</option>
				</select>
			</div>
		)		
	}
}

const OIDCURL = (props) => {
	return (
		<div>
			<h2>Redirect to OpenID Connect Server:</h2>
			<p>{props.server}{props.authEndpoint}?</p>
			<p>client_id={encodeURIComponent(props.clientID)}&amp;</p>
			<p>{encodeURIComponent('redirect_uri=' + document.querySelector("[name=redirect-uri]").value)}&amp;</p>
			<p>scope={encodeURIComponent(props.scope)}&amp;</p>
			<p>response_type=code&amp;</p>
			<p>state={encodeURIComponent(props.stateToken)}</p>
		</div>
	)
}

const RedirectButton = (props) => {
	return <button type="button" onClick={props.redirect}>Redirect to Auth</button>
}

export default InputPanel