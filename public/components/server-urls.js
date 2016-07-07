import React from 'react'
import Ajax from 'simple-ajax'
import _ from 'lodash'

class ServerURLs extends React.Component{
	constructor(){
		super()
		this.update = this.update.bind(this)
		let savedState = localStorage.getItem('app-state') || '{}'
		savedState = JSON.parse(savedState)
		this.state = savedState
	}
	render(){
		return (
			<div>
				<label for="server">Server Template:</label>
				<select name="server" ref="server" onChange={this.update}>
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
					<span>Authorization Endpoint:&nbsp; <span ref="authEndpoint">{this.state.authEndpoint}</span></span><br/>
					<span>Token Endpoint:&nbsp; <span ref="tokenEndpoint">{this.state.tokenEndpoint}</span></span><br/>
				</p>
				<p style={{display:(this.state.server != 'Auth0' ? 'block' : 'none')}}>
					<label for="discoveryURL">Discovery Document URL:&nbsp;</label>
					<input name="discoveryURL" onChange={this.update} disabled={this.state.server == 'google' ? 'disabled' : ''} value={this.state.discoveryURL} ref="discoveryURL" placeholder="https://my-oidc.com/.well-known/oidc-configuration" />
					<button style={{display:(this.state.server != 'google' ? 'inline-block' : 'none')}} onClick={this.updateDiscovery.bind(this)}>Use Discovery Document</button>
					<br/>
					<label for="authEndpoint">Authorization Endpoint:&nbsp;</label>
					<input name="authEndpoint" onChange={this.update} disabled={this.state.server == 'google' ? 'disabled' : ''} value={this.state.authEndpoint} ref="authEndpoint" placeholder="https://my-oidc.com/.well-known/oidc-configuration" />
					<br/>
					<label for="Token Endpoint">Token Endpoint:&nbsp;</label>
					<input name="tokenEndpoint" onChange={this.update} disabled={this.state.server == 'google' ? 'disabled' : ''} value={this.state.tokenEndpoint} ref="tokenEndpoint" placeholder="https://my-oidc.com/.well-known/oidc-configuration" />
				</p>
				<p id="warning" style={{display:(this.state.server != 'Auth0' ? 'block' : 'none')}}>Remember to set https://openidconnect.net/callback as an allowed callback with your application!</p>

			</div>
		)
	}
	componentDidMount(){
		this.updateServerURL(true, function(){
			this.update()
		}.bind(this))
	}
	update(){
		this.setState({
			server: this.refs.server.value,
			authEndpoint: this.refs.authEndpoint.value,
			tokenEndpoint: this.refs.tokenEndpoint.value,
			domain: this.refs.domain.value,
			discoveryURL: this.refs.discoveryURL.value
		});
		this.updateServerURL(true)
	}
	updateServerURL(load, callback){
		let type = this.refs.server.value, domain, authEndpoint, tokenEndpoint, warning, discoveryURL

		if(type == 'google'){
			let googleDiscoveryURL = 'https://accounts.google.com/.well-known/openid-configuration';
			this.discover('https://accounts.google.com/.well-known/openid-configuration', function(discovered){
				this.setNewState({
					server: type,
					discoveryURL: googleDiscoveryURL,
					warning: true,
					authEndpoint: discovered.authorization_endpoint,
					tokenEndpoint: discovered.token_endpoint,
					domain: null
				})
			}.bind(this))
		} else if(load) {
			document.querySelector('option[value=' + (this.state.server || 'Auth0' )+ ']').setAttribute('selected', 'true')
			domain = this.state.domain || ''
			authEndpoint = this.state.authEndpoint || ''
			tokenEndpoint = this.state.tokenEndpoint || ''
			discoveryURL = this.state.discoveryURL || ''
			warning = (type === 'Auth0' && domain === 'samples.auth0.com') ? false : true

			this.setNewState({
				server: type,
				discoveryURL,
				warning,
				authEndpoint,
				tokenEndpoint
			})
		} else {
			domain = this.refs.domain.value || ''
			authEndpoint = this.refs.authEndpoint.value || ''
			tokenEndpoint = this.refs.tokenEndpoint.value || ''
			discoveryURL = this.refs.discoveryURL.value || ''
			warning = (type === 'Auth0' && domain === 'samples.auth0.com') ? false : true
			this.setNewState({
				server: type,
				domain,
				discoveryURL,
				warning,
				authEndpoint,
				tokenEndpoint
			})	
		}
		if(callback) callback()
	}
	updateAuth0(){
		let documentURL = 'https://' + this.refs.domain.value + '/.well-known/openid-configuration'
		this.discover(documentURL, function(discovered){
			this.setNewState({
				discoveryURL: documentURL,
				authEndpoint: discovered.authorization_endpoint,
				tokenEndpoint: discovered.token_endpoint
			})
		}.bind(this))
	}
	updateDiscovery(){
		let documentURL = this.refs.discoveryURL.value
		this.discover(documentURL, function(discovered){
			this.setNewState({
				discoveryURL: documentURL,
				authEndpoint: discovered.authorization_endpoint,
				tokenEndpoint: discovered.token_endpoint
			})
		}.bind(this))
	}
	discover(url, callback){

		let serviceDiscovery = new Ajax({
			url: '/discover',
			method: 'GET',
			data: {
				url
			}
		})

		serviceDiscovery.on('success', function(event){
			callback(JSON.parse(event.currentTarget.response))
		})

		serviceDiscovery.send()
	}
	setNewState(changes, reload){
		this.setState(changes)
		this.dispatchChangeEvent(this.state)
		this.saveState()	
	}
	dispatchChangeEvent(config){
		window.dispatchEvent(new CustomEvent('configChange', { detail: config || this.state }))
	}
	saveState(){
		localStorage.setItem('app-state', JSON.stringify(this.state))
	}

}

export default ServerURLs