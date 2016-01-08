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


class Box {
  constructor(props, context) {
    this.max_width = props.width;
    this.max_height = props.height;
    this.position = {
      x: 0,
      y: 0
    }
    this.velocity = {
      x: 0,
      y: 0
    }
    this.width = 10;
    this.height = 70;
    this.speed = 12;
    this.friction = 0.9;
  }
  render(keys, context) {
    move(keys, this);
    if (this.position.x + 500 >= this.max_width) {
      this.position.x = this.max_width - 500;
    }
    if (this.position.x - 50 <= 0) {
      this.position.x = 0 + 50;
    }
    if (this.position.y + 100 >= this.max_height) {
      this.position.y = this.max_height - 100;
    }
    if (this.position.y - 50 <= 0) {
      this.position.y = 0 + 50;
    }
    rect(context, this.position.x, this.position.y, this.width, this.height);
  }
}


function rect(ctx, x, y, w, h) {
  ctx.beginPath();
  ctx.fillStyle = "#222";
  ctx.rect(x,y,w,h);
  ctx.closePath();
  ctx.fill();
}


function move(keys, obj) {
  if (keys.up) {
    if (obj.velocity.y > -obj.speed) {
      obj.velocity.y--;
    }
  }
  if (keys.right) {
    if (obj.velocity.x < obj.speed) {
      obj.velocity.x++;
    }
  }
  if (keys.down) {
    if (obj.velocity.y < obj.speed) {
      obj.velocity.y++;
    }
  }
  if (keys.left) {
    if (obj.velocity.x > -obj.speed) {
      obj.velocity.x--;
    }
  }
  obj.velocity.y *= obj.friction;
  obj.position.y += obj.velocity.y;
  obj.velocity.x *= obj.friction;
  obj.position.x += obj.velocity.x;
}


class Ball {
  constructor(props, context) {
    let image = new Image();
    this.image = image;
    this.max_width = props.width;
    this.max_height = props.height;
    this.position = {
      x: 150,
      y: 50
    }
    this.velocity = {
      x: 0,
      y: 0
    }
    this.speed = 10;
    this.width = 40;
    this.height = 40;
    this.friction = 0.95;
    image.onload = () => {
      // storage.getState()
      context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
    image.src = '/img/bball.png';
  }
  render(keys, context) {
    var time = new Date();
    context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

export class App extends Component {
  constructor(props) {
    super(props);
    this.keys = {};
  }
  handleKeys(value, e) {
    // https://github.com/chriz001/Reacteroids/blob/master/src/Reacteroids.js#L5
    let keys = this.keys;
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
    this.box = new Box(this.props, context);
    this.updateCanvas();
  }
  updateCanvas() {
    let canvas = this.refs.canvas;
    let context = canvas.getContext('2d');
    context.clearRect(0, 0, this.props.width, this.props.height);
    this.ball.render(this.keys, context);
    this.box.render(this.keys, context);
    requestAnimationFrame(() => {this.updateCanvas()});
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
