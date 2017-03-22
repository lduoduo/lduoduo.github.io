/** 
 * webapp 程序主入口
 */

import 'babel-polyfill';
import {AppContainer} from 'react-hot-loader';
import React from 'react';
import {render} from 'react-dom';
import App from './app/home';
// import './common/style/app.scss'

const rootEl = document.getElementById('app');
render(
  <AppContainer>
    <App />
  </AppContainer>,
  rootEl
);

if (module.hot) {
  module.hot.accept('./app/home', () => {
    // If you use Webpack 2 in ES modules mode, you can
    // use <App /> here rather than require() a <NextApp />.
    // const NextApp = require('./js/containers/App').default;
    const RedBox = require('redbox-react').default;
    try {
      render(
        <AppContainer>
          <App />
        </AppContainer>,
        rootEl
      )
    } catch (e) {
      render(
        <RedBox error={e}>
          <AppContainer>
            <App />
          </AppContainer>
        </RedBox>,
        rootEl
      )
    }
  });
}