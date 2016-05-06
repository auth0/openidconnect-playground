import React from 'react'
import Ajax from 'simple-ajax'

class ServerURLs extends React.Component{
	constructor(){
		super()
		this.update = this.update.bind(this)
		let savedState = localStorage.getItem('app-state') || '{}'
		savedState = JSON.parse(savedState)
		this.state = {
			domain: 'samples.auth0.com',
			authEndpoint: '',
			tokenEndpoint: '',
			savedState
		}
	}
	render(){
		return (
			<div>
				<label for="server">Server Template:</label>
				<select name="server" ref="server" onChange={this.updateServerURL.bind(this)}>
					<option value="none">SELECT A SERVER TEMPLATE</option>
					<option value="Auth0">Auth0</option>
					<option value="google">Google</option>
					<option value="custom">Custom</option>
				</select>
				<br/>
				<p style={{display:(this.state.server == 'Auth0' ? 'block' : 'none')}}>
					<label for="domain">Auth0 domain:&nbsp;</label>
					<input name="domain" onChange={this.update}ref="domain" placeholder="mydomain.auth0.com" />
					<button onClick={this.updateAuth0.bind(this)}>Use Auth0 Discovery Document</button>
					<p ref="Auth0DiscoveryDocumentURL"></p>
				</p>
				<p style={{display:(this.state.server == 'custom' ? 'block' : 'none')}}>
					<label for="discoveryURL">Discovery Document URL:&nbsp;</label>
					<input name="discoveryURL" value={this.state.discoveryURL} ref="discoveryURL" placeholder="https://my-oidc.com/.well-known/oidc-configuration" />
					<button style={{display:(this.state.server != 'google' ? 'inline-block' : 'none')}} onClick={this.updateDiscovery.bind(this)}>Use Discovery Document</button>
					<span ref="DiscoveryDocumentURL"></span>
				</p>
				<p style={{display:(this.state.server == 'google' ? 'block' : 'none')}}>
					<span>Discovery Document:&nbsp;{this.state.discoveryURL}</span><br/>
				</p>
				<p id="warning" style={{display:(this.state.warning ? 'block' : 'none')}}>Remember to set https://openidconnect.net/callback as an allowed callback with your application!</p>
				<span>Authorization Endpoint:&nbsp; <span ref="authEndpoint">{this.state.authEndpoint}</span></span><br/>
				<span>Token Endpoint:&nbsp; <span ref="tokenEndpoint">{this.state.tokenEndpoint}</span></span><br/>
			</div>
		)
	}
	update(){
	}
	updateServerURL(){
		let type = this.refs.server.value

		if(type == 'Auth0'){
			this.setState({
				server: type,
				domain: 'samples.auth0.com',
				authEndpoint: this.state.savedAuthEndpoint || '',
				tokenEndpoint: this.state.savedTokenEndpoint || '',
				clientID:  this.state.savedState.ClientID || 'BUIJSW9x60sIHBw8Kd9EmCbj8eDIFxDC',
				clientSecret: this.state.savedState.ClientSecret || 'gcyGiDHsIE6bUT9oAs6ghuynjt8usUqTRglg8n8eWqw9SgnGJ5cRLCUz03gJ_s_X',
				warning: !this.state.clientID || this.state.clientID == 'BUIJSW9x60sIHBw8Kd9EmCbj8eDIFxDC' ? false : true
			})
			this.refs.domain.value = this.state.savedState.domain || 'samples.auth0.com'
		} else if(type == 'custom'){
			this.setState({
				server: type,	
				warning: true,
				authEndpoint: this.state.savedAuthEndpoint || '',
				tokenEndpoint: this.state.savedTokenEndpoint || '',
			})
		} else if(type == 'google'){
			this.refs.discoveryURL.disabled = true
			this.discover(null, 'google', function(discovered){
				this.setState({
					server: type,
					discovery: true,
					discoveryURL: 'https://accounts.google.com/.well-known/openid-configuration',
					warning: true,
					authEndpoint: discovered.authorization_endpoint,
					tokenEndpoint: discovered.token_endpoint
				})
				this.update()		
			}.bind(this))
		}
	}
	updateAuth0(){
		let documentURL = 'https://' + this.refs.domain.value + '/.well-known/openid-configuration'
		this.discover(documentURL, 'auth0', function(discovered){
				this.setState({
					discovery: true,
					discoveryURL: documentURL,
					authEndpoint: discovered.authorization_endpoint,
					tokenEndpoint: discovered.token_endpoint
				})
				this.update()		
			}.bind(this))
	}
	updateDiscovery(){
		let documentURL = this.refs.discoveryURL.value
		this.discover(documentURL, false, function(discovered){
				this.setState({
					discovery: true,
					discoveryURL: documentURL,
					authEndpoint: discovered.authorization_endpoint,
					tokenEndpoint: discovered.token_endpoint
				})
				this.update()		
			}.bind(this))
	}
	discover(url, service=false, callback){
		let serviceDiscovery = new Ajax({
			url: '/discover',
			method: 'GET',
			data: {
				service,
				url
			}
		})

		serviceDiscovery.on('success', function(event){
			callback(JSON.parse(event.currentTarget.response))
		})

		serviceDiscovery.send()
	}

}

export default ServerURLs