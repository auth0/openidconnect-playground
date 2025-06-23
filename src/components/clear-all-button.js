import React from 'react';

class ClearAllButton extends React.Component {

  constructor(){
    super()

    this.clearStorage = this.clearStorage.bind(this);

    this.state = {
      buttonText: 'Clear LocalStorage'
    }
  }

  clearStorage() {
    var c = this;

    localStorage.clear();

    c.setState({ buttonText: 'LocalStorage Cleared' });

    setTimeout(function() {
      c.setState({ buttonText: 'Clear LocalStorage' });
    }, 600);
  }

  render() {
    return (
      <button
        type="button"
        className="clear-storage-btn"
        onClick={this.clearStorage}
      >
        {this.state.buttonText}
      </button>
    );
  }
}

export default ClearAllButton;
