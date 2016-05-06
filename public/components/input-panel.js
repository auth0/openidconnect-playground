import React from 'react'
import Ajax from 'simple-ajax'

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
				serverURL: changed ? 'https://samples.auth0.com' : (URL || 'https://'),
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
			let googleDiscovery = new Ajax({
				url: '/discover',
				method: 'GET',
				data: {
					'service': 'google'
				}
			});

			googleDiscovery.on('success', function(event){
				let discovered = JSON.parse(event.currentTarget.response);
				this.refs.serverURL.updateLabel("Server URL", "https://sample-oidc.com");
				this.refs.serverURL.refs.value.disabled = true
				this.refs.authEndpoint.refs.value.disabled = true
				this.refs.tokenEndpoint.refs.value.disabled = true
				this.setState({
					discovery: true,
					discoveryURL: 'https://accounts.google.com/.well-known/openid-configuration',
					serverURL: discovered.authorization_endpoint,
					authEndpoint:  discovered.authorization_endpoint,
					tokenEndpoint:  discovered.token_endpoint,
					clientID: changed ? (this.state.savedClientID || '') : (this.refs.clientID.refs.value.value || this.state.savedClientID || ''),
					clientSecret: changed ? (this.state.savedClientID || '') : (this.refs.clientSecret.refs.value.value || this.state.savedSecret || ''),
					completeURL: discovered.auth_endpoint + '?client_id='+  encodeURIComponent(this.refs.clientID.refs.value.value) +'&scope='+ encodeURIComponent(this.refs.scope.refs.value.value) + '&response_type=code&redirect_uri=' + document.querySelector("[name=redirect-uri]").value + '&state=' + this.state.stateToken,
					warning: true
				})			
			}.bind(this));

			googleDiscovery.send();
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