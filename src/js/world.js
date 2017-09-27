// const blank = " ";

function Square(x, y) {
  // Represents a square in the grid
  this.x = x;
  this.y = y;

  let directions = {
    'n': [0, -1],
    's': [0, 1],
    'e': [1, 0],
    'w': [-1, 0]
  };

  this.shift = (direction) => {
    // return new square position, shifted n, s, e or w
    let vector = directions[direction];
    return new Square(
      this.x + vector[0],
      this.y + vector[1]);
  };

  this.matches = (square) => {
    return square.x === this.x && square.y === this.y;
  };
}

function Grid(width, height, squareSize) {
  this.width = width;
  this.height = height;
  let pill = null;
  let snake = new Snake();

  let generatePill = () => {
    let found = false;
    while (!found) {
      let square = new Square(
        Math.floor(Math.random() * this.width),
        Math.floor(Math.random() * this.height));
      if (!this.isOutside(square) && !
        snake.collides(this.isOutside, square)) { found = true; }
      pill = new Pill(square);
    }
  };

  this.isOutside = (square) => {
    return square.x < 0 || square.x >= width || square.y < 0 || square.y >= height;
  };

  let hitsPill = (square) => {
    if (square.matches(pill.square)) {
      return true;
    }
    return false;
  };
  
  this.getSnake = () => {
    return snake;
  };

  this.update = () => {
    let gameOver = false;
    snake.update();
    let square = snake.getPosition();
    if (snake.collides(this.isOutside, square)) {
      gameOver = true;
    }
    else if (hitsPill(square)) {
      snake.grow();
      generatePill();
    }
    return gameOver;
  };

  this.draw = (ctx) => {
    snake.draw(ctx, squareSize);
    pill.draw(ctx, squareSize);
  };

  generatePill(); // init
}

function Pill(square) {
  this.square = square;
  this.draw = (ctx, squareSize) => {
    // calculate centre of grid point
    ctx.fillStyle = '#c5dde2';
    let radius = squareSize / 2;
    let x = this.square.x * squareSize + radius;
    let y = this.square.y * squareSize + radius;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.fill();
  };
}

function Segment(sqr, prnt) {
  let nextSquare;
  let square = sqr;
  let parent = prnt; // leader doesn't have parent
  let type = 'blank'; // default. can also be 'leader' or 'tail'.
  this.direction; // only the leader has a direction
  if (typeof parent != 'undefined') {
    nextSquare = parent.getSquare();
  }

  this.changeType = (typ) => {
    type = typ;
  };

  this.getType = () => {
    return type;
  };

  this.isHittable = () => {
    return type === 'leader' || type === 'tail';
  };

  this.getSquare = () => {
    return square;
  };

  this.move = () => {
    if (typeof parent != 'undefined') {
      // Will move Segment to nextSquare
      square = nextSquare;
      nextSquare = parent.getSquare();
    }
    else {
      // Move the leader in current direction.
      square = square.shift(this.direction);
    }
  };

  this.draw = (ctx, squareSize) => {
    // calculate centre of grid point
    ctx.fillStyle = '#aaa';
    ctx.strokeStyle = '#eee';
    let radius = squareSize / 2;
    let x = square.x * squareSize + radius;
    let y = square.y * squareSize + radius;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    if (type === 'leader' || type === 'tail') {
      ctx.fill();
    }
  };
}

function Snake() {
  let initSquare = new Square(14, 14);
  let leader = new Segment(initSquare);
  leader.changeType('leader');
  let opposite = { 'n': 's', 's': 'n', 'e': 'w', 'w': 'e' };
  let segments = [leader, ];

  let checkChangeDir = (newDir) => {
    if (leader.direction === newDir ||
      leader.direction === opposite[newDir]) return false;
    else return true;
  };

  this.changeDirection = (dir) => {
    if (checkChangeDir(dir)) {
      leader.direction = dir;
    }
  };

  this.grow = () => {
    console.log('it grows!');
    let count = 4;
    for (var i in segments) {
      if (segments[i].getType() === 'blank') {
        segments[i].changeType('tail');
        count -= 1;
        if (count <= 0) { break; }
      }
    }
  };

  this.getPosition = () => {
    return leader.getSquare();
  };

  this.collides = (isOutside, square) => {
    let gameOver = false;
    let leaderSquare = square;
    if (isOutside(leaderSquare)) {
      gameOver = true;
    }

    for (var i = 1; i < segments.length; i++) {
      if (leaderSquare.matches(segments[i].getSquare()) &&
        segments[i].isHittable()) {
        gameOver = true;
        break;
      }
    }
    return gameOver;
  };

  this.update = () => {
    for (var i in segments) {
      segments[i].move();
    }
    let blank = new Segment(initSquare, segments[segments.length - 1]);
    segments.push(blank);
  };

  this.draw = (ctx, squareSize) => {
    for (var i in segments) {
      if (typeof segments[i].draw != 'undefined') {
        segments[i].draw(ctx, squareSize);
      }
    }
  };
}

function Message() {
  let text;

  this.setText = (t) => {
    text = t;
  };

  this.draw = (ctx) => {
    ctx.fillStyle = '#666';
    ctx.strokeStyle = '#666';
    ctx.font = '9px sans-serif';
    ctx.fillText(text, 30, 80);
  };
}

export function World(width, height, squareSize) {
  let grid, snake, gameIsOver, intId, message;
  let canvasElem = document.getElementById('canvas');
  let ctx = canvasElem.getContext('2d');
  canvasElem.height = height * squareSize;
  canvasElem.width = width * squareSize;

  let start = () => {
    if (typeof this.intId === 'undefined') {
      intId = window.setInterval(turn, 150);
    }
  };

  let endGame = () => {
    console.log('Game Over!');
    clearInterval(intId);
    intId = (function () { return; })(); // reset to undefined
    message.setText('Game Over! Press enter to restart.');
    message.draw(ctx);
  };

  let turn = () => {
    gameIsOver = grid.update();
    ctx.clearRect(0, 0, width * squareSize, height * squareSize);
    if (!gameIsOver) {
      grid.draw(ctx);
    }
    else {
      endGame();
    }
  };

  this.init = () => {
    grid = new Grid(width, height, squareSize);
    snake = grid.getSnake();
    gameIsOver = false;
    ctx.clearRect(0, 0, width * squareSize, height * squareSize);
    message = new Message(grid, squareSize);
    message.setText('Snake! Press W, A, S or D to begin.');
    message.draw(ctx);
    grid.draw(ctx);
  };

  /* Event listeners */
  /* Snake */
  document.addEventListener('keydown', (event) => {
    let k = event.key;
    if ('wsad'.indexOf(k) != -1) {
      // Change direction
      if (k === 'w') snake.changeDirection('n');
      else if (k === 's') snake.changeDirection('s');
      else if (k === 'a') snake.changeDirection('w');
      else if (k === 'd') snake.changeDirection('e');

      if (typeof intId === 'undefined') {
        console.log("Let's get going!");
        start();
      }
    }
  });
  /* Restart */
  document.addEventListener('keydown', (event) => {
    if (event.keyCode === 13 && gameIsOver) {
      this.init();
    }
  });
}
