import { createStore } from 'redux';

let initialState = {
  started: false,
  keys: {},
  width: 1000,
  height: 500
};

function reducer(state, action) {
  state = state || initialState;
  switch (action.type) {
  case 'START':
    return Object.assign({}, state, {started: true });
  case 'END':
    return Object.assign({}, state, {started: false });
  case 'KEY_PRESSED':
    let newState = Object.assign({}, state, {keys: action.keys });
    return newState;
  default:
    return state;
  }
}

export default createStore(reducer);

