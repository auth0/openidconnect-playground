import React from 'react';
import ServerURLs from './server-urls';
import ClearAllButton from './clear-all-button';
import TokenPanel from './token-panel';

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
          <div className="row">
            <div className="col-xs-6">

            </div>
            <div className="col-xs-6">
              { document.querySelector('input[name=code]').value ? <TokenPanel /> : null }
            </div>
          </div>
          <ServerURLs />
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
