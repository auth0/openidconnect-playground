import React from 'react'
import ReactDOM from 'react-dom'

import InputPanel from './components/input-panel'
import ClearAllButton from './components/clear-all-button'
import TokenPanel from './components/token-panel'

ReactDOM.render(<ClearAllButton />, document.getElementById('clear-all-button'))
ReactDOM.render(<InputPanel />, document.getElementById('app'))
if(document.querySelector('input[name=code]').value){
	ReactDOM.render(<TokenPanel />, document.getElementById('token-panel'))
}
