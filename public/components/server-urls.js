import React from 'react'
import _ from 'lodash'

class ServerURLs extends React.Component{
	constructor(){
		super()
		this.update = this.update.bind(this)
	}
	componentDidMount(){
    	document.querySelector('option[value=' + (this.props.server || 'Auth0' )+ ']').setAttribute('selected', 'true')
	}
	update(event){
		let changed = {
			server: this.refs.server.value,
			authEndpoint: this.refs.authEndpoint.value,
			tokenEndpoint: this.refs.tokenEndpoint.value,
			domain: this.refs.domain.value,
			discoveryURL: this.refs.discoveryURL.value
		}
		changed[event.target.name] = event.target.value
		window.dispatchEvent(new CustomEvent('configChange', {
			detail: changed
		}))
	}
	updateDiscovery(){
		setTimeout(() => { window.dispatchEvent(new CustomEvent('discovery')) }, 250)
	}
	render(){
		return (
			<div>
				<label for="server">Server Template:</label>
				<select name="server" ref="server" onChange={ (event) => { this.update(event); this.updateDiscovery() }}>
					<option value="none">SELECT A SERVER TEMPLATE</option>
					<option value="Auth0">Auth0</option>
					<option value="google">Google</option>
					<option value="custom">Custom</option>
				</select>
				<br/>
				<p style={{display:(this.props.server == 'Auth0' ? 'block' : 'none')}}>
					<label for="domain">Auth0 domain:&nbsp;</label>
					<input name="domain" onChange={this.update} ref="domain" value={this.props.domain} placeholder="mydomain.auth0.com" />
					<button onClick={this.updateDiscovery}>Use Auth0 Discovery Document</button>
					<br />
					<span ref="Auth0DiscoveryDocumentURL"></span>
					<span>Authorization Endpoint:&nbsp; <span ref="authEndpoint">{this.props.authEndpoint}</span></span><br/>
					<span>Token Endpoint:&nbsp; <span ref="tokenEndpoint">{this.props.tokenEndpoint}</span></span><br/>
				</p>
				<p style={{display:(this.props.server != 'Auth0' ? 'block' : 'none')}}>
					<label for="discoveryURL">Discovery Document URL:&nbsp;</label>
					<input name="discoveryURL" onChange={this.update} disabled={this.props.server == 'google' ? 'disabled' : ''} value={this.props.discoveryURL} ref="discoveryURL" placeholder="https://my-oidc.com/.well-known/oidc-configuration" />
					<button style={{display:(this.props.server != 'google' ? 'inline-block' : 'none')}} onClick={this.updateDiscovery}>Use Discovery Document</button>
					<br/>
					<label for="authEndpoint">Authorization Endpoint:&nbsp;</label>
					<input name="authEndpoint" onChange={this.update} disabled={this.props.server == 'google' ? 'disabled' : ''} value={this.props.authEndpoint} ref="authEndpoint" placeholder="https://my-oidc.com/.well-known/oidc-configuration" />
					<br/>
					<label for="Token Endpoint">Token Endpoint:&nbsp;</label>
					<input name="tokenEndpoint" onChange={this.update} disabled={this.props.server == 'google' ? 'disabled' : ''} value={this.props.tokenEndpoint} ref="tokenEndpoint" placeholder="https://my-oidc.com/.well-known/oidc-configuration" />
				</p>
				<p id="warning" style={{display:((this.props.server != 'Auth0' || (this.props.server == 'Auth0' && this.props.domain != 'samples.auth0.com')) ? 'block' : 'none')}}>Remember to set https://openidconnect.net/callback as an allowed callback with your application!</p>

			</div>
		)
	}
}

export default ServerURLs