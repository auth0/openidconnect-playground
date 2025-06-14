import React from 'react';
import Ajax from 'simple-ajax';


class StepFour extends React.Component {
  render() {
    return (
      <div className={`playground-step ${this.props.isActive ? 'active' : '' } ${this.props.idTokenDecoded ? ' last-step' : ' last-step is-invalid'}`}>
        <span className="step-number">
          <i className={this.props.idTokenDecoded ? 'icon-budicon-470' : 'icon-budicon-471'}></i>
        </span>
        <div className="step-content">
          <a id="step4"></a>
          <h2 className="step-title">{this.props.idTokenDecoded ? 'The token is valid!' : 'The token is invalid. Check your parameters and try verifying again.'}</h2>
          <div className={this.props.idTokenDecoded ? 'decoded-code-box' : 'hide'}>
            <div className="code-box-title">Decoded Token Payload</div>
              <div className="code-box-content">
                <div className="code-block">
                  <pre>
                    {this.props.idTokenDecoded}
                  </pre>
                </div>
              </div>
            </div>
            <br />
            <div className="code-box-btn-group">
              <button onClick={this.props.startOver}  className="code-box-btn is-alt">Start Over</button>
              <button onClick={this.props.logOut}  className="code-box-btn is-subtle">Log Out</button>
            </div>
          </div>
      </div>
    )
  }
}

export default StepFour;
