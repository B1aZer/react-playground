import React, { Component } from 'react';
import { NICE, SUPER_NICE } from './colors';

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
    <button onClick={ this.props.start }>Start</button>
    <button onClick={ this.props.end }>End</button>
    </div>
    );
  }
}

class Ball {
  constructor(props) {
    this.props = {};
  }
  update(props) {
    this.props = props;
    this.render();
  }
  render() {
    var ctx = this.props.context;
    ctx.fillStyle = "rgb(200,0,0)";
    ctx.fillRect (10, 10, 55, 50);
  }
}

export class App extends Component {
  constructor(props) {
    super(props);
    console.info(this.refs);
    this.state = { context: null };
    this.ball = new Ball();
    this.startGame = this.startGame.bind(this);
    this.endGame = this.endGame.bind(this);
  }
  componentDidMount() {
    this.setState(Object.assign({}, this.state, {context: this.refs.canvas.getContext("2d") }));
    requestAnimationFrame(() => {this.update()});
  }
  update() {
    this.ball.update(this.state);
  }
  render() {
    var started = this.state.started ? 'yes' : 'no';
    return (
      <div>
        <span>{started}</span>
        <canvas ref="canvas" width="500" height="500" />
        <Controls start={this.startGame} end={this.endGame}/>
      </div>
    );
  }
  startGame() {
    this.setState(Object.assign({}, this.state, {started: true}));
  }
  endGame() {
    this.setState(Object.assign({}, this.state, {started: false}));
  }
}
