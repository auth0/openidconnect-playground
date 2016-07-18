import React from 'react';
import ServerURLs from './server-urls';
import ClearAllButton from './clear-all-button';
import ClientInfo from './client-info';

const ConfigurationModal = (props) =>
    <div className="configuration-modal" id="configuration-modal">
      <div className="configuration-modal-backdrop"></div>
      <div className="configuration-modal-dialog">
        <span
          onClick={props.closeModal}
          className="configuration-modal-close icon-budicon-501"
        >
        </span>
        <h2 className="configuration-modal-title">OpenID Connect Configuration</h2>
        <ServerURLs
          discoveryURL={props.discoveryURL}
          authEndpoint={props.authEndpoint}
          tokenEndpoint={props.tokenEndpoint}
          tokenKeysEndpoint={props.tokenKeysEndpoint}
          userInfoEndpoint={props.userInfoEndpoint}
          domain={props.domain}
          server={props.server}
        />

        <ClientInfo
          clientID={props.clientID}
          clientSecret={props.clientSecret}
          scopes={props.scopes}
        />
        <div className="clear-storage-container">
          <p>
            Hey, just a friendly note: we store stuff like your keys in
            LocalStorage so that when you redirect to authenticate, you don&#47;t lose them.
            You can clear them by clicking on this button:
          </p>
          <ClearAllButton onClick="{ localStorage.clear() }" />
        </div>
      </div>
    </div>;

export default ConfigurationModal;
