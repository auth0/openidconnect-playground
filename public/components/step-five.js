import React from 'react';

const StepFive = (props) =>
  <div className="playground-step last-step">
    <span className="step-number">
      <i className="icon-budicon-470"></i>
    </span>
    <div className="step-content">
      <h2 className="step-title">Here's your User Profile! Congrats! You are a OpenID expert!</h2>
      <div className="code-box-title">User Profile</div>
        <div className="code-box-content">
          <div className="code-block">
            { JSON.stringify(props.userProfile) }
          </div>
        </div>
      </div>
    </div>

export default StepFive;