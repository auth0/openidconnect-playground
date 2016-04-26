import React from 'react'
import ReactDOM from 'react-dom'

import InputPanel from './components/input-panel'
import ClearAllButton from './components/clear-all-button'

ReactDOM.render(<ClearAllButton />, document.getElementById('clear-all-button'))
ReactDOM.render(<InputPanel />, document.getElementById('app'))
