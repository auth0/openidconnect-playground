import React from 'react';
import ReactDOM from 'react-dom';
import OpenIDPage from './components/open-id-page';
require('./styles.styl');

ReactDOM.render(
  <OpenIDPage />,
  document.getElementById('content')
);
