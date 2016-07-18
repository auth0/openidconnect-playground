import React from 'react';

const StepFour = (props) =>
  <div className="playground-step last-step">
    <span className="step-number">
      <i className="icon-budicon-470"></i>
    </span>
    <div className="step-content">
      <h2 className="step-title">The token is valid!</h2>
      <div className="code-box-title">Decoded Token Payload</div>
        <div className="code-box-content">
          <div className="code-block">
            { props.idTokenDecoded}
          </div>
        </div>
      </div>
    </div>

export default StepFour;