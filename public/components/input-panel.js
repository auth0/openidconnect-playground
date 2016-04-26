import React from 'react'

class InputPanel extends React.Component{
	constructor(){
		super()
		this.update = this.update.bind(this)
		let oldState = localStorage.getItem('app-state')
		this.state = JSON.parse(oldState) || {}
	}
	render(){
		return (
			<div>
				<div class="inputs">
					<ServerPicker ref="server" name="server" label="OpenID Connect Server" update={this.update} />
					<ServerURLInput ref="serverURL" update={this.update} />
					<InputValue ref="authEndpoint" name="authEndpoint" label="Authorization Endpoint" val={this.state.authEndpoint} pholder="/authorize" update={this.update} />
					<InputValue ref="tokenEndpoint" name="tokenEndpoint" label="Token Endpoint" pholder="/token" val={this.state.tokenEndpoint} update={this.update} />
					<InputValue ref="clientID" name="clientID" label="Client ID" val={this.state.clientID} update={this.update} />
					<InputValue ref="clientSecret" name="clientSecret" label="Client Secret" val={this.state.clientSecret} update={this.update} />
					<InputValue ref="scope" name="scope" label="Scope" val={this.state.scope} pholder="openid name email" update={this.update} />
				</div>
				<OIDCURL server={this.state.serverURL} authEndpoint={this.state.authEndpoint} clientID={this.state.clientID} scope= {this.state.scope} />
				<RedirectButton redirect={this.authRedirect.bind(this)} />
			</div>
		)
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
		this.setState({
			server: this.refs.server.refs.value.value,
			authEndpoint: this.refs.authEndpoint.refs.value.value,
			tokenEndpoint: this.refs.tokenEndpoint.refs.value.value,
			clientID: this.refs.clientID.refs.value.value,
			clientSecret: this.refs.clientSecret.refs.value.value,
			scope: this.refs.scope.refs.value.value		
		})

		this.updateServerURL(this.refs.server.refs.value.value, this.refs.serverURL.refs.value.value);
	}
	updateServerURL(type, URL){
		if(type !== 'none'){
			this.refs.serverURL.refs.value.disabled = false;
		} else {
			this.refs.serverURL.refs.value.disabled = true;
		}

		if(type == 'Auth0'){
			this.refs.serverURL.updateLabel("Your Auth0 Domain", "domain.auth0.com");
			this.setState({
				serverURL: "https://" + URL,
				authEndpoint: '/authorize',
				tokenEndpoint: '/oauth/token',
				completeURL: "https://" + URL + '/authorize?client_id='+ encodeURIComponent(this.refs.clientID.refs.value.value) +'&client_secret'+ encodeURIComponent(this.refs.clientSecret.refs.value.value) +'&scope='+ encodeURIComponent(this.refs.scope.refs.value.value) + '&response_type=code'
			})
		} else if(type == 'custom'){
			this.refs.serverURL.updateLabel("Server URL", "https://sample-oidc.com");
			this.setState({
				serverURL: URL,
				completeURL: URL + '/' + encodeURIComponent(this.refs.authEndpoint.refs.value.value) +'?client_id='+  encodeURIComponent(this.refs.clientID.refs.value.value) +'&client_secret='+ encodeURIComponent(this.refs.clientSecret.refs.value.value) +'&scope='+ encodeURIComponent(this.refs.scope.refs.value.value) + '&response_type=code'
			})
		}
	}
	authRedirect(){
		localStorage.setItem('app-state', JSON.stringify(this.state))
		window.location = this.state.completeURL
	}
}

class InputValue extends React.Component{
	render(){
		return (
			<div>
				<label for="{this.props.name}">{this.props.label}:</label>
				<input name="{this.props.name}" ref="value" value={this.props.val} onChange={this.props.update} placeholder={this.props.pholder} />
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
				<input disabled="true" name="serverUrl" ref="value" onChange={this.props.update} placeholder={this.state.pholder} />
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
				<label for="{this.props.name}">{this.props.label}:</label>
				<select name="{this.props.name}" ref="value" onChange={this.props.update}>
					<option value="none">SELECT A SERVER</option>
					<option value="Auth0">Auth0</option>
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
			<p>{encodeURIComponent('redirect_uri=https://localhost:5000/auth/callback')}&amp;</p>
			<p>scope={encodeURIComponent(props.scope)}&amp;</p>
			<p>response_type=code&amp;</p>
		</div>
	)
}

const RedirectButton = (props) => {
	return <button type="button" onClick={props.redirect}>Redirect to Auth</button>
}

export default InputPanel