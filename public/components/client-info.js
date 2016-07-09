import React from 'react'

class ClientInfo extends React.Component{
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
				<label for="clientID">OIDC Client ID:</label>
                <input name="clientID" onChange={this.update} value={this.props.clientID} ref="clientID" />
                <br/>
				<label for="clientSecret">OIDC Client Secret:</label>
                <input name="clientSecret" onChange={this.update} value={this.props.clientSecret} ref="clientSecret" />
                <br/>
				<label for="scopes">Scope:</label>
                <input name="scopes" onChange={this.update} value={this.props.scopes} ref="scopes" />
			</div>
		)
	}
	update(){
		window.dispatchEvent(new CustomEvent('configChange', { 
			detail: {
            	clientID: this.refs.clientID.value,
            	clientSecret: this.refs.clientSecret.value,
            	scopes: this.refs.scopes.value
        	}
		}))
	}
}

export default ClientInfo