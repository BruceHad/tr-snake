/*global expect Square Grid Segment World*/

const assert = require('assert');
const rewire = require('rewire');
const world = rewire('../src/js/world.js');

describe('Square', function() {
  const Square = world.__get__('Square');
  it('Returns a new square on the grid', function() {
    let s = new Square(10, 10);
    assert.equal(s.x, 10);
    assert.equal(s.y, 10);
  });

  it('can shift to a new position', function(){
    let s = new Square(10, 10);
    s = s.shift('n');
    assert.equal(s.y, 9);
    s = s.shift('s');
    assert.equal(s.y, 10);
    s = s.shift('e');
    assert.equal(s.x, 11);
  });
  
  it('can check whether the position matches', function(){
    let s = new Square(10, 10);
    assert.equal(s.matches(new Square(10,10)), true);
    assert.equal(s.matches(new Square(10,9)), false);
  });
});

describe('Grid', function() {
  const Grid = world.__get__('Grid');
  const Square = world.__get__('Square');

  describe('isOutside()', function() {
    it('is true if the square outside of the grid', function() {
      let grid = new Grid(3, 3, 5);
  //     assert(!grid.isOutside(new Square(0, 0)));
  //     assert(!grid.isOutside(new Square(2, 2)));
  //     assert(grid.isOutside(new Square(0, 3)));
  //     assert(grid.isOutside(new Square(3, 0)));
    });
  });
});

// describe('Segment', function() {
//   const Segment = world.__get__('Segment');
//   const Square = world.__get__('Square');
//   global.document = { addEventListener: function() { return null; } };
//   let segment = new Segment('o', true, new Square(5,5));
//   describe('move()', function(){
//     it('moves the segment to a new position', function(){
//       let oldPosition = segment.square;
//       segment.move();
//       assert(segment.square != oldPosition);
//     });
//   });
// });

describe('Snake', function(){
  // const Snake = world.__get__('Snake');
  // const Grid = world.__get__('Grid');
  // let snake = new Snake(new Grid(100, 100));
  // snake.changeDirection('n');
  // assert.equal(snake.)
});