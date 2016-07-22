import React from 'react';

const StepFour = (props) =>
  <div className={props.idTokenDecoded ? 'playground-step last-step' : 'playground-step last-step is-invalid'}>
    <span className="step-number">
      <i className={props.idTokenDecoded ? 'icon-budicon-470' : 'icon-budicon-471'}></i>
    </span>
    <div className="step-content">
      <h2 className="step-title">{props.idTokenDecoded ? 'The token is valid!' : 'The token is invalid. Check your parameters and try verifying again.'}</h2>
      <div className={props.idTokenDecoded ? 'decoded-code-box' : 'hide'}>
        <div className="code-box-title">Decoded Token Payload</div>
          <div className="code-box-content">
            <div className="code-block">
              {props.idTokenDecoded}
            </div>
          </div>
        </div>
      </div>
    </div>

export default StepFour;
