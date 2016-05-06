import React from 'react'

const InputValue = (props) => {
	return (
		<div>
			<label for={this.props.name}>{this.props.label}:</label>
			<input name={this.props.name} ref="value" value={this.props.val} onChange={this.props.update} placeholder={this.props.pholder} />
		</div>
	)		
}

export default InputValue