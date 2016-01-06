import React, { Component } from 'react';
import { NICE, SUPER_NICE } from './colors';
import store from './store';


class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.interval = setInterval(() => this.tick(), 1000);
  }

  tick() {
    this.setState({
      counter: this.state.counter + this.props.increment
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <h1 style={{ color: this.props.color }}>
        Counter ({this.props.increment}): {this.state.counter}
      </h1>
    );
  }
}


class Controls extends Component {
  render() {
    return (
    <div>
      <button onClick={ () => store.dispatch({ type: 'START' })}>Start</button>
      <button onClick={ () => store.dispatch({ type: 'END' })}>End</button>
    </div>
    );
  }
}

class Ball {
  constructor() {
    this.image = new Image();
    this.image.src = '/img/bball.png';
  }
  update() {
    console.info('updating ball');
  }
  render() {
    var ctx = this.props.context;
    ctx.fillStyle = "rgb(200,0,0)";
    ctx.fillRect (10, 10, 20, 20);
    ctx.drawImage(this.image,0,0);
  }
}

export class App extends Component {
  componentDidMount() {
    //this.setState(Object.assign({}, this.state, {context: this.refs.canvas.getContext("2d") }));
  }
  render() {
    let started = this.props.started;
    started = started ? 'yes' : 'no';
    return (
      <div>
        <span>{started}</span>
        <canvas ref="canvas" width="500" height="500" />
        <Controls />
      </div>
    );
  }
}
