import React from 'react';

class CopySnippet extends React.Component {
  constructor() {
    super();
    this.selectText = this.selectText.bind(this);
  }

  selectText() {
    var elem = this._snippet;
    var range, selection;

    if (window.getSelection && document.createRange) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(elem);
        selection.removeAllRanges();
        selection.addRange(range);
    } else if (document.selection && document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(elem);
        range.select();
    }
  }

  render() {
    return (
      <div className="code-snippet light-version">
        <span className="snippet" ref={function(e) {
            if (e != null) {
              return this._snippet = e;
            }
          }.bind(this)}>
            { this.props.value || this.props.defaultValue}
        </span>
        <button className="btn-copy" onClick={this.selectText}>
          <i className="icon-budicon-338"></i>
        </button>
      </div>
    );
  }
}

export default CopySnippet;
