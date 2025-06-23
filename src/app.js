import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';
import DebuggerPage from './components/debugger-page';
import IntroductionPage from './components/introduction-page';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
require('./styles.styl');

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<DebuggerPage />} />
        <Route path="/introduction" element={<IntroductionPage />} />
      </Route>
    </Routes>
  </BrowserRouter>,
  document.getElementById('content')
);
