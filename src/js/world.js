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
      if (!isOutside(square)) { found = true; }
      pill = new Pill(square);
    }
  };

  let isOutside = (square) => {
    return square.x < 0 || square.x >= width || square.y < 0 || square.y >= height;
  };

  let hitsPill = (square) => {
    if (square.matches(pill.square)) {
      return true;
    }
    return false;
  };

  this.update = () => {
    let gameOver = false;
    snake.update();
    let square = snake.getPosition();
    if (snake.collides(isOutside)) {
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
    ctx.strokeStyle = '#eee';
    let radius = squareSize / 2;
    let x = this.square.x * squareSize + radius;
    let y = this.square.y * squareSize + radius;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.stroke();
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
    ctx.fillStyle = '#eee';
    ctx.strokeStyle = '#eee';
    let radius = squareSize / 2;
    let x = square.x * squareSize + radius;
    let y = square.y * squareSize + radius;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    if (type === 'leader' || type === 'tail') {
      ctx.fill();
    }
    else if (type === 'blank') {
      ctx.stroke();
    }
  };
}

function Snake() {
  let initSquare = new Square(10, 10);
  let leader = new Segment(initSquare);
  leader.changeType('leader');
  let opposite = { 'n': 's', 's': 'n', 'e': 'w', 'w': 'e' };
  let segments = [leader, ];

  let checkChangeDir = (newDir) => {
    if (leader.direction === newDir ||
      leader.direction === opposite[newDir]) return false;
    else return true;
  };

  let changeDirection = (dir) => {
    if (checkChangeDir(dir)) {
      leader.direction = dir;
    }
  };

  this.grow = () => {
    console.log('it grows!');
    let count = 2;
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
  
  this.collides = (isOutside) => {
    let gameOver = false;
    let leaderSquare = leader.getSquare();
    if(isOutside(leaderSquare)){
      gameOver = true;
    }
    
    for (var i = 1; i < segments.length; i++) {
      if(leaderSquare.matches(segments[i].getSquare()) 
          && segments[i].isHittable()) {
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

  document.addEventListener('keydown', (event) => {
    let k = event.key;
    if ('wsad'.indexOf(k) != -1) {
      // Change direction
      if (k === 'w') changeDirection('n');
      else if (k === 's') changeDirection('s');
      else if (k === 'a') changeDirection('w');
      else if (k === 'd') changeDirection('e');
    }
  });
}

function Message() {
  let text;

  this.setText = (t) => {
    text = t;
  };

  this.draw = (ctx) => {
    ctx.font = '10px sans-serif';
    ctx.fillText(text, 20, 100);
  };
}

export function World(width, height, squareSize) {
  let grid = new Grid(width, height, squareSize);
  let canvasElem = document.getElementById('canvas');
  let ctx = canvasElem.getContext('2d');
  canvasElem.height = height * squareSize;
  canvasElem.width = width * squareSize;
  let intId, message;

  let start = () => {
    if (typeof this.intId === 'undefined') {
      intId = window.setInterval(turn, 250);
    }
  };

  let endGame = () => {
    clearInterval(intId);
    message.setText('Game Over! Press enter to restart.');
    message.draw(ctx);
    document.addEventListener('keydown', (event) => {
      if (event.keyCode === 13) {
        this.init();
      }
    });
  };

  let turn = () => {
    let gameIsOver = grid.update();
    ctx.clearRect(0, 0, width * squareSize, height * squareSize);
    if (!gameIsOver) {
      grid.draw(ctx);
    }
    else {
      endGame();
    }
  };

  this.init = () => {
    ctx.clearRect(0, 0, width * squareSize, height * squareSize);
    grid.draw(ctx);
    message = new Message(grid, squareSize);
    message.setText('Snake! Press W, A, S or D to begin.');
    message.draw(ctx);

    document.addEventListener('keydown', (event) => {
      let k = event.key;
      if ('wsad'.indexOf(k) != -1 && typeof intId === 'undefined') {
        start();
      }
    });
  };
}
