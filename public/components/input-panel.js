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
					<InputValue ref="server" name="server" label="OpenID Connect Server" pholder="https://sample-oidc.auth0.com" update={this.update} />
					<InputValue ref="authEndpoint" name="authEndpoint" label="Authorization Endpoint" pholder="/authorize" update={this.update} />
					<InputValue ref="tokenEndpoint" name="tokenEndpoint" label="Token Endpoint" pholder="/token" update={this.update} />
					<InputValue ref="clientID" name="clientID" label="Client ID" update={this.update} />
					<InputValue ref="clientSecret" name="clientSecret" label="Client Secret" update={this.update} />
					<InputValue ref="scope" name="scope" label="Scope" pholder="openid name email" update={this.update} />
				</div>
				<OIDCURL server={this.state.server} authEndpoint={this.state.authEndpoint} clientID={this.state.clientID} scope= {this.state.scope} />
			</div>
		)
	}
	update(e){
		this.setState({
			server: this.refs.server.refs.value.value,
			authEndpoint: this.refs.authEndpoint.refs.value.value,
			tokenEndpoint: this.refs.tokenEndpoint.refs.value.value,
			clientID: this.refs.clientID.refs.value.value,
			clientSecret: this.refs.clientSecret.refs.value.value,
			scope: this.refs.scope.refs.value.value
		})
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

const OIDCURL = (props) => {
	return (
		<div>
			<h2>Redirect to OpenID Connect Server:</h2>
			<p>{props.server}{props.authEndpoint}?</p>
			<p>client_id={props.clientID}&amp;</p>
			<p>redirect_uri=https://localhost:3000/callback&amp;</p>
			<p>scope={props.scope}&amp;</p>
			<p>response_type=code&amp;</p>
			<p>state=poifhjoeif2</p>
		</div>
	)
}

export default InputPanel