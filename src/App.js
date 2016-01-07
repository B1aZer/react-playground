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

const KEY = {
  LEFT:  37,
  RIGHT: 39,
  UP: 38,
  DOWN: 40,
  A: 65,
  D: 68,
  W: 87,
  S: 83,
  SPACE: 32
};


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
  constructor(props, context) {
    let image = new Image();
    this.width = props.width;
    this.height = props.height;
    this.image = image;
    this.position = {
      x: 0,
      y: 0
    }
    this.velocity = {
      x: 0,
      y: 0
    }
    this.speed = 12;
    this.friction = 0.9;
    image.onload = () => {
      // storage.getState()
      context.drawImage(this.image, 0, 0, 20, 20);
    }
    image.src = '/img/bball.png';
  }
  render(keys, context) {
    if (keys.up) {
      //this.position.y -= 10;
      if (this.velocity.y > -this.speed) {
        this.velocity.y--;
      }
    }
    if (keys.right) {
      //this.position.x += 10;
      if (this.velocity.x < this.speed) {
        this.velocity.x++;
      }
    }
    if (keys.down) {
      //this.position.y += 10;
      if (this.velocity.y < this.speed) {
        this.velocity.y++;
      }
    }
    if (keys.left) {
      //this.position.x -= 10;
      if (this.velocity.x > -this.speed) {
        this.velocity.x--;
      }
    }

    this.velocity.y *= this.friction;
    this.position.y += this.velocity.y;
    this.velocity.x *= this.friction;
    this.position.x += this.velocity.x;

    if (this.position.x + 50 >= this.width) {
      this.position.x = this.width - 50;
    }
    if (this.position.x - 50 <= 0) {
      this.position.x = 0 + 50;
    }
    if (this.position.y + 50 >= this.height) {
      this.position.y = this.height - 50;
    }
    if (this.position.y - 50 <= 0) {
      this.position.y = 0 + 50;
    }

    //context.save();
    context.clearRect(0, 0, this.width, this.height);
    //context.fillStyle = "#eee";
    //context.fillRect(0, 0, 500, 500);
    context.drawImage(this.image, this.position.x, this.position.y, 20, 20);
    //context.translate(this.position.x, this.position.y);
    //context.restore();
  }
}

export class App extends Component {
  constructor(props) {
    super(props);
    this.keys = {};
  }
  handleKeys(value, e) {
    // https://github.com/chriz001/Reacteroids/blob/master/src/Reacteroids.js#L5
    let keys = {};
    if(e.keyCode === KEY.LEFT   || e.keyCode === KEY.A) keys.left  = value;
    if(e.keyCode === KEY.RIGHT  || e.keyCode === KEY.D) keys.right = value;
    if(e.keyCode === KEY.UP     || e.keyCode === KEY.W) keys.up    = value;
    if(e.keyCode === KEY.DOWN   || e.keyCode === KEY.S) keys.down  = value;
    if(e.keyCode === KEY.SPACE) keys.space = value;
    //store.dispatch({ type: 'KEY_PRESSED', keys: keys });
    this.keys = keys;
  }
  componentWillMount() {
  }
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeys.bind(this, true));
    window.addEventListener('keyup', this.handleKeys.bind(this, false));
    this.startScene();
  }
  componentWillUnmount() {
    // create PR
    window.removeEventListener('keydown', this.handleKeys);
    window.removeEventListener('keyup', this.handleKeys);
  }
  shouldComponentUpdate() {
    // return false if nothing changed
    // request frame #2
    //this.updateCanvas();
    return true;
  }
  startScene() {
    let canvas = this.refs.canvas;
    let context = canvas.getContext('2d');
    context.fillStyle = "#eee";
    context.fillRect(0,0,500,500);
    this.ball = new Ball(this.props, context);
    this.updateCanvas();
  }
  updateCanvas() {
    let canvas = this.refs.canvas;
    let context = canvas.getContext('2d');
    this.ball.render(this.keys, context);
    requestAnimationFrame(() => {this.updateCanvas()});
     //setTimeout(() => this.updateCanvas, 10);
  }
  render() {
    var canvasStyle = {
      border: '1px solid #eee'
    };
    let started = this.props.started;
    started = started ? 'yes' : 'no';
    return (
      <div>
        <span>{started}</span>
        <canvas ref="canvas" style={canvasStyle} width={this.props.width} height={this.props.height} />
        <Controls />
      </div>
    );
  }
}
