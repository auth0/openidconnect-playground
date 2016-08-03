import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';
import DebuggerPage from './components/debugger-page';
import IntroductionPage from './components/introduction-page';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
require('./styles.styl');

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={DebuggerPage} />
      <Route path="/introduction" component={IntroductionPage} />
    </Route>
  </Router>,
  document.getElementById('content')
);
