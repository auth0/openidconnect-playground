import React from 'react'
import _ from 'lodash'

class ServerURLs extends React.Component{
  constructor(){
    super()
    this.update = this.update.bind(this)
  }
  componentDidMount(){
    document.querySelector('option[value=' + (this.props.server || 'Auth0' )+ ']').setAttribute('selected', 'true')

    if (this.refs[this.props.focus]) {
      this.refs[this.props.focus].focus()
    }
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
  updateDiscovery() {
    setTimeout(() => { window.dispatchEvent(new CustomEvent('discovery')) }, 250)
  }
  render() {
    return (
      <div className="form-horizontal">
        <div className="form-group">
          <label htmlFor="server" className="col-md-3 col-xs-12 control-label">Server Template</label>
          <div className="col-md-9 col-xs-12">
            <select
              className="form-control"
              name="server"
              ref="server"
              onChange={ (event) => { this.update(event); this.updateDiscovery(); }}
            >
              <option value="none">Select a server template</option>
              <option value="Auth0">Auth0</option>
              <option value="google">Google</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>

        <div className="form-horizontal">
          <div className="form-group">
            <div style={{display: this.props.server == 'Auth0' ? 'block': 'none'}}>
              <label htmlFor="domain" className="col-md-3 col-xs-12 control-label">Auth0 domain</label>
              <div className="col-md-9 col-xs-12">
                <button
                  onClick={this.updateDiscovery}
                  className="btn btn-transparent btn-md button-float-right"
                >
                  Use Auth0 Discovery Document
                </button>
                <div style={ { overflow: 'hidden' } }>
                  <input className="form-control input-with-button" name="domain" onChange={this.update} ref="domain" value={this.props.domain} placeholder="mydomain.auth0.com" />
                </div>
              </div>
            </div>
            <div style={{display: this.props.server != 'Auth0' ? 'block': 'none'}}>
              <label htmlFor="discoveryURL" className="col-md-3 col-xs-12 control-label">Discovery Document URL</label>
              <div className="col-md-9 col-xs-12">
                <button className="btn btn-transparent btn-md button-float-right"style={{display:(this.props.server != 'google' ? 'inline-block' : 'none')}} onClick={this.updateDiscovery}>Use Discovery Document</button>
                <div style={ { overflow: 'hidden' } }>
                  <input
                    className={`form-control ${this.props.server != 'google' ? 'input-with-button' : '' }`}
                    name="discoveryURL"
                    onChange={this.update}
                    disabled={this.props.server != 'custom' ? 'disabled' : ''}
                    value={this.props.discoveryURL}
                    ref="discoveryURL"
                    placeholder="https://my-oidc.com/.well-known/openid-configuration"
                    />
                </div>
                <span className="help-text">Use a discovery document to populate your server urls</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="authEndpoint" className="col-md-3 col-xs-12 control-label">Authorization Token Endpoint</label>
            <div className="col-md-9 col-xs-12">
              <input className="form-control" name="authEndpoint" onChange={this.update} disabled={this.props.server != 'custom' ? 'disabled' : ''} value={this.props.authEndpoint} ref="authEndpoint" placeholder="https://my-oidc.com/authorize" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="Token Endpoint" className="col-md-3 col-xs-12 control-label">Token Endpoint</label>
            <div className="col-md-9 col-xs-12">
              <input className="form-control" name="tokenEndpoint" onChange={this.update} disabled={this.props.server != 'custom' ? 'disabled' : ''} value={this.props.tokenEndpoint} ref="tokenEndpoint" placeholder="https://my-oidc.com/oauth/token" />
            </div>
          </div>

          <div className="form-group" style={{ display: (this.props.tokenKeysEndpoint || this.props.server == 'custom') ? 'block': 'none' }}>
            <label htmlFor="tokenKeysEndpoint" className="col-md-3 col-xs-12 control-label">Token Keys Endpoint</label>
            <div className="col-md-9 col-xs-12">
              <input className="form-control" name="tokenEndpoint" onChange={this.update} disabled={this.props.server != 'custom' ? 'disabled' : ''} value={this.props.tokenKeysEndpoint} ref="tokenEndpoint" placeholder="https://my-oidc.com/oauth/token" />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="Token Endpoint" className="col-md-3 col-xs-12 control-label">Token Endpoint</label>
          <div className="col-md-9 col-xs-12">
            <input className="form-control" name="tokenEndpoint" onChange={this.update} disabled={this.props.server != 'custom' ? 'disabled' : ''} value={this.props.tokenEndpoint} ref="tokenEndpoint" placeholder="https://my-oidc.com/oauth/token" />
          </div>
        </div>

        <p id="warning" style={{display:((this.props.server != 'Auth0' || (this.props.server == 'Auth0' && this.props.domain != 'samples.auth0.com')) ? 'block' : 'none')}}>Remember to set https://openidconnect.net/callback as an allowed callback with your application!</p>

      </div>
    )
  }
}

export default ServerURLs
