import React from 'react';
import ServerURLs from './server-urls';
import ClearAllButton from './clear-all-button';
import ClientInfo from './client-info';

class ConfigurationModal extends React.Component {

  render() {
    return (
      <div className="configuration-modal" id="configuration-modal">
        <div className="configuration-modal-backdrop"></div>
        <div className="configuration-modal-dialog">
          <span
            onClick={this.props.closeModal}
            className="configuration-modal-close icon-budicon-501"
          >
          </span>
          <h2 className="configuration-modal-title">OpenID Connect Configuration</h2>
          <ServerURLs 
            discoveryURL={this.props.discoveryURL}
            authEndpoint={this.props.authEndpoint}
            tokenEndpoint={this.props.tokenEndpoint}
            domain={this.props.domain}
            server={this.props.server}  
          />

          <ClientInfo 
            clientID={this.props.clientID}
            clientSecret={this.props.clientSecret}
            scopes={this.props.scopes}
          />
          <div className="clear-storage-container">
            <p>
              Hey, just a friendly note: we store stuff like your keys in
              LocalStorage so that when you redirect to authenticate, you don&#47;t lose them.
              You can clear them by clicking on this button:
            </p>
            <ClearAllButton />
          </div>
        </div>
      </div>
    );
  }
}

export default ConfigurationModal;
