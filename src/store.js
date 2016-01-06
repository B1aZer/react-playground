import { createStore } from 'redux';

let state = {
  context: null,
  started: false
};

function reducer(state=state, action) {
  switch (action.type) {
  case 'START':
    return Object.assign({}, state, {started: true });
  case 'END':
    return Object.assign({}, state, {started: false });
  default:
    return state;
  }
}

export default createStore(reducer);

