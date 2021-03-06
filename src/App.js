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


function rect(ctx, x, y, w, h) {
  ctx.beginPath();
  ctx.fillStyle = "#222";
  ctx.rect(x,y,w,h);
  ctx.closePath();
  ctx.fill();
}



function RectCircleColliding(circle, rect) {
    var distX = Math.abs(circle.position.x - rect.position.x - rect.width/2);
    var distY = Math.abs(circle.position.y - rect.position.y - rect.height/2);
    let distance = {
      x: distX,
      y: distY
    }

    if (distX > (rect.width/2 + circle.radius)) {
      distance.x = distX + (rect.width/2 + circle.radius);
      distance.y = distY;
      console.info('noX');
      console.info(distance);
      return distance;
    }
    if (distY > (rect.height/2 + circle.radius)) {
      distance.x = distX;
      distance.y = distY - (rect.height/2 + circle.radius);
      console.info('noY');
      console.info(distance);
      return distance;
    }

    if (distX <= (rect.width/2)) {
      distance.x = -distX;
      distance.y = -distY;
      console.info('yesX');
      console.info(distance);
      return distance;
    }
    if (distY <= (rect.height/2)) {
      distance.x = -distX;
      distance.y = -distY;
      console.info('yesY');
      console.info(distance);
      return distance;
    }

    var dx=distX-rect.width/2;
    var dy=distY-rect.height/2;

    if ((dx*dx+dy*dy) <= (circle.radius*circle.radius)) {
      distance.x = -dx;
      distance.y = -dy;
      console.info('pif');
    }
    console.info(distance);
    return distance;
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
    this.max_speed = 20;
    this.speed = 0.5;
    this.friction = 0.9;
  }
  move(keys) {
    if (keys.up) {
      if (this.velocity.y > -this.max_speed) {
        this.velocity.y = this.velocity.y - this.speed;
      }
    }
    if (keys.right) {
      if (this.velocity.x < this.max_speed) {
        this.velocity.x = this.velocity.x + this.speed;
      }
    }
    if (keys.down) {
      if (this.velocity.y < this.max_speed) {
        this.velocity.y = this.velocity.y + this.speed;
      }
    }
    if (keys.left) {
      if (this.velocity.x > -this.max_speed) {
        this.velocity.x = this.velocity.x - this.speed;
      }
    }
    this.velocity.y *= this.friction;
    this.position.y += this.velocity.y;
    this.velocity.x *= this.friction;
    this.position.x += this.velocity.x;
  }
  render(keys, context) {
    this.move(keys);
    if (this.position.x + this.max_width/2 >= this.max_width) {
      this.position.x = this.max_width - this.max_width/2;
    }
    if (this.position.x - this.width <= 0) {
      this.position.x = 0 + this.width;
    }
    if (this.position.y + this.height >= this.max_height) {
      this.position.y = this.max_height - this.height;
    }
    if (this.position.y - this.width <= 0) {
      this.position.y = 0 + this.width;
    }
    rect(context, this.position.x, this.position.y, this.width, this.height);
  }
}


class Ball {
  constructor(props, context) {
    let image = new Image();
    this.image = image;
    this.max_width = props.width;
    this.max_height = props.height;
    this.position = {
      x: 150,
      y: 180
    }
    this.velocity = {
      x: 0,
      y: 0
    }
    this.speed = 10;
    this.width = 40;
    this.height = 40;
    this.radius = 20;
    this.friction = 0.98;
    image.onload = () => {
      context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
    image.src = '/img/bball.png';
  }
  render(keys, context) {
    //context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();

    this.velocity.y *= this.friction;
    this.position.y += this.velocity.y;
    this.velocity.x *= this.friction;
    this.position.x += this.velocity.x;

    if (this.position.x + this.radius > this.max_width) {
      this.velocity.x = -this.velocity.x
    }
    if (this.position.x - this.radius <= 0) {
      this.velocity.x = -this.velocity.x
    }
    if (this.position.y + this.radius >= this.max_height) {
      this.velocity.y = -this.velocity.y;
    }
    if (this.position.y - this.radius <= 0) {
      this.velocity.y = -this.velocity.y;
    }

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
    return true;
  }
  startScene() {
    let canvas = this.refs.canvas;
    this.context = canvas.getContext('2d');
    this.context.fillStyle = "#eee";
    this.context.fillRect(0,0,500,500);
    this.ball = new Ball(this.props, this.context);
    this.box = new Box(this.props, this.context);
    this.updateCanvas();
  }
  updateCanvas() {
    this.context.clearRect(0, 0, this.props.width, this.props.height);
    this.ball.render(this.keys, this.context);
    this.box.render(this.keys, this.context);
    let distance = RectCircleColliding(this.ball, this.box);
    if (distance.x < 0 || distance.y < 0) {
      let massBox = 1.1;
      let massBall = 0.4;
      let collisionMomentum = 5.98;
      //console.info(this.ball.velocity);
      //console.info(this.box.velocity);
      //this.ball.position.x += distance.x;
      //this.ball.position.y += distance.y;
      /*
      if (this.ball.velocity.x * this.ball.velocity.y > this.box.velocity.x * this.box.velocity.y) {
        this.box.velocity.x = this.ball.velocity.x * massBall * collisionMomentum;
        this.box.velocity.y = this.ball.velocity.y * massBall * collisionMomentum;
      } else {
        this.ball.velocity.x = this.box.velocity.x * massBox * collisionMomentum;
        this.ball.velocity.y = this.box.velocity.y * massBox * collisionMomentum;
      }
     */
    }
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
