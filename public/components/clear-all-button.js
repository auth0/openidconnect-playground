import React from 'react'

class ClearAllButton extends React.Component{
	constructor(){
		super();
	}
	render(){
		return <button type="button" onClick={this.clearStorage}>Clear All LocalStorage</button>
	}
	clearStorage(){
		console.log('clearing') 
		localStorage.clear()
	}
}

export default ClearAllButton