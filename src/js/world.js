const blank = " ";

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
}

function ChangePoint(square, direction) {
  // Represents a point on which the segment should change direction
  this.point = square;
  this.newDir = direction;
}

function Grid(width, height) {
  this.width = width;
  this.height = height;
  this.isOutside = (square) => {
    return square.x < 0 || square.x >= width || square.y < 0 || square.y >= height;
  };
}

function Segment(symbol, leader, square) {
  this.symbol = symbol;
  this.direction = 'e';
  this.square = square;

  this.move = () => {
    this.square = this.square.shift(this.direction);
  };

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

function Snake(grid, squareSize) {
  let leader = new Segment('o', true, new Square(10, 10));
  let changePoints = []; // list of positions that the snake changes dir
  let opposite = { 'n': 's', 's': 'n', 'e': 'w', 'w': 'e' };
  let segments = [leader, ];
  this.gameOver = false;



  this.changeDirection = (dir) => {
    if (checkChangeDir(dir)) {
      leader.direction = dir;
      changePoints.push(new ChangePoint(leader.position, dir));
    }
  };

  let checkChangeDir = (newDir) => {
    if (leader.direction === newDir ||
      leader.direction === opposite[newDir]) return false;
    else return true;
  };

  this.update = () => {
    for (var i in segments)
      segments[i].move(grid, changePoints);
    if (grid.isOutside(leader.square)) {
      this.gameOver = true;
    }
  };
  this.draw = (ctx) => {
    for (var i in segments)
      segments[i].draw(ctx, squareSize);
  };
}


function Message(grid, squareSize) {
  let text = 'Snake! Press W, A, S or D to begin.';
  
  this.setText = (t) => {
    text = t;
  }

  this.draw = (ctx) => {
    ctx.font = '10px sans-serif';
    ctx.fillText(text, 20, 100);
  };
}

export function World(width, height, squareSize) {
  let grid = new Grid(width, height);
  let canvasElem = document.getElementById('canvas');
  let ctx = canvasElem.getContext('2d');
  canvasElem.height = height * squareSize;
  canvasElem.width = width * squareSize;

  let snake = new Snake(grid, squareSize);
  snake.draw(ctx);
  
  let message = new Message(grid, squareSize);
  message.draw(ctx);

  let turn = () => {
    snake.update();
    ctx.clearRect(0, 0, width * squareSize, height * squareSize);
    if (! snake.gameOver) {
      snake.draw(ctx);
    }
    else {
      this.gameOver();
      this.intId.clearInterval();
    }
  };

  this.init = () => {
    function update() {
      turn();
    }
    document.addEventListener('keydown', (event) => {
      let k = event.key;
      if ('wsad'.indexOf(k) != -1) {
        if (k === 'w') snake.changeDirection('n');
        else if (k === 's') snake.changeDirection('s');
        else if (k === 'a') snake.changeDirection('w');
        else if (k === 'd') snake.changeDirection('e');
      }
      if (typeof this.intId === 'undefined')
        this.intId = window.setInterval(update, 250);
    });
  };
  
  this.gameOver = () => {
    message.setText('Game Over!');
    message.draw(ctx);
  };
}
