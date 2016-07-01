import React from 'react';

class ClearAllButton extends React.Component {

  clearStorage() {
    localStorage.clear();
  }

  render() {
    return (
      <button
        type="button"
        className="clear-storage-btn"
        onClick={this.clearStorage}
      >
        Clear LocalStorage
      </button>
    );
  }
}

export default ClearAllButton;
