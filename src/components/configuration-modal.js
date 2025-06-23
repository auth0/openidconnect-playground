import React from 'react';
import ServerURLs from './server-urls';
import ClearAllButton from './clear-all-button';
import ClientInfo from './client-info';

const ConfigurationModal = (props) =>
    <div className="configuration-modal" id="configuration-modal">
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
          focus={props.focus}
        />

        <ClientInfo
          clientID={props.clientID}
          clientSecret={props.clientSecret}
          scopes={props.scopes}
          focus={props.focus}
          audience={props.audience}
        />

        <div className="row">
          <div className="col-md-3 col-xs-12">
          </div>
          <div className="col-md-9 col-xs-12">
            <p>
              <button onClick={props.closeModal} className="code-box-btn is-alt">Save</button>
            </p>
          </div>
        </div>

        <div className="clear-storage-container">
          <p>
            Hey, just a friendly note: we store stuff like your keys in
            LocalStorage so that when you redirect to authenticate, you don’t lose them.
            You can clear them by clicking on this button:
          </p>
          <ClearAllButton />
        </div>

      </div>
    </div>;

export default ConfigurationModal;
