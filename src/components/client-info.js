import React from 'react'
import { sanitizeParam } from '../utils'

class ClientInfo extends React.Component{
  constructor(){
    super()
    this.update = this.update.bind(this);
    let savedState = localStorage.getItem('app-state') || '{}'
    savedState = JSON.parse(savedState)
    this.state = savedState
  }
  componentDidMount(){
    if (this.refs[this.props.focus]) {
      this.refs[this.props.focus].select()
    }
  }
  render(){
    return (
      <div className="form-horizontal">
        <div className="form-group">
          <label className="col-md-3 col-xs-12 control-label" htmlFor="clientID">OIDC Client ID</label>
          <div className="col-md-9 col-xs-12">
            <input className="form-control" name="clientID" onChange={this.update} value={this.props.clientID} ref="clientID" />
          </div>
        </div>

        <div className="form-group">
          <label className="col-md-3 col-xs-12 control-label" htmlFor="clientSecret">OIDC Client Secret</label>
          <div className="col-md-9 col-xs-12">
            <input className="form-control" name="clientSecret" onChange={this.update} value={this.props.clientSecret} ref="clientSecret" />
          </div>
        </div>

        <div className="form-group">
          <label className="col-md-3 col-xs-12 control-label" htmlFor="scopes">Scope</label>
          <div className="col-md-9 col-xs-12">
            <input className="form-control" name="scopes" onChange={this.update} value={this.props.scopes} ref="scopes" />
          </div>
        </div>

        <div className="form-group">
          <label className="col-md-3 col-xs-12 control-label" htmlFor="audience">Audience <span className="small">(optional)</span></label>
          <div className="col-md-9 col-xs-12">
            <input className="form-control" name="audience" onChange={this.update} value={this.props.audience} ref="audience" />
          </div>
        </div>
      </div>
    )
  }
  update() {
    window.dispatchEvent(new CustomEvent('configChange', {
      detail: {
        clientID: sanitizeParam(this.refs.clientID.value),
        clientSecret: sanitizeParam(this.refs.clientSecret.value),
        scopes: sanitizeParam(this.refs.scopes.value),
        audience: sanitizeParam(this.refs.audience.value)
      }
    }));
  }
}

export default ClientInfo
