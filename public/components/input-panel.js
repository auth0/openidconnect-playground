import React from 'react'

class InputPanel extends React.Component{
	constructor(){
		super()
		this.update = this.update.bind(this)
		this.state ={}
	}
	render(){
		return (
			<div>
				<div class="inputs">
					<ServerPicker ref="server" name="server" label="OpenID Connect Server" update={this.update} />
					<ServerURLInput ref="serverURL" update={this.update} />
					<InputValue ref="authEndpoint" name="authEndpoint" label="Authorization Endpoint" pholder="/authorize" update={this.update} />
					<InputValue ref="tokenEndpoint" name="tokenEndpoint" label="Token Endpoint" pholder="/token" update={this.update} />
					<InputValue ref="clientID" name="clientID" label="Client ID" update={this.update} />
					<InputValue ref="clientSecret" name="clientSecret" label="Client Secret" update={this.update} />
					<InputValue ref="scope" name="scope" label="Scope" pholder="openid name email" update={this.update} />
				</div>
				<OIDCURL server={this.state.serverURL} authEndpoint={this.state.authEndpoint} clientID={this.state.clientID} scope= {this.state.scope} />
				<RedirectButton redirect="{this.authRedirect}" />
			</div>
		)
	}
	update(e){
		this.setState({
			server: encodeURIComponent(this.refs.server.refs.value.value),
			authEndpoint: encodeURIComponent(this.refs.authEndpoint.refs.value.value),
			tokenEndpoint: encodeURIComponent(this.refs.tokenEndpoint.refs.value.value),
			clientID: encodeURIComponent(this.refs.clientID.refs.value.value),
			clientSecret: encodeURIComponent(this.refs.clientSecret.refs.value.value),
			scope: encodeURIComponent(this.refs.scope.refs.value.value)
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
				tokenEndpoint: '/oauth/token'
			})
		} else if(type == 'custom'){
			this.refs.serverURL.updateLabel("Server URL", "https://sample-oidc.com");
			this.setState({
				serverURL: URL 
			})
		}
		console.log(this.state);
	}
}

class InputValue extends React.Component{
	render(){
		return (
			<div>
				<label for="{this.props.name}">{this.props.label}:</label>
				<input name="{this.props.name}" ref="value" onChange={this.props.update} placeholder={this.props.pholder} />
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
			<p>client_id={props.clientID}&amp;</p>
			<p>redirect_uri=https://localhost:5000/auth/callback&amp;</p>
			<p>scope={props.scope}&amp;</p>
			<p>response_type=code&amp;</p>
			<p>state=poifhjoeif2</p>
		</div>
	)
}

const RedirectButton = (props) => {
	return <button type="button" onClick={props.redirect}>Redirect to Auth</button>
}

export default InputPanel