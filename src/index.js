import React from 'react';
import { render } from 'react-dom';
import { App } from './App';
import store from './store';

store.subscribe(() => {
  renderApp();
});

let renderApp = () => {
  render(<App {...store.getState()}/>, document.getElementById('root'));
};
window.requestAnimationFrame(function () {
  renderApp();
})
