import React from 'react'
import ReactDOM from 'react-dom'
var css = require('./file.styl');

import ServerURLs from './components/server-urls'
import ClearAllButton from './components/clear-all-button'
import TokenPanel from './components/token-panel'

ReactDOM.render(<ClearAllButton />, document.getElementById('clear-all-button'))
ReactDOM.render(<ServerURLs />, document.getElementById('server-urls'))
if(document.querySelector('input[name=code]').value){
	ReactDOM.render(<TokenPanel />, document.getElementById('token-panel'))
}
