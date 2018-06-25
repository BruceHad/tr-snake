To Do
=====

v1.0.0:

1. [x] Improve interface/game over screens (fix restart).
1. [x] Move event listeners outside objects.
1. [x] Fix Pill generation so it doesn't sit on the tail.
...

v1.0.1:

1. [ ] Refactor...
1. [ ] Improve test suite

v1.0.2:


v1.0.3:

1. [ ] Improve Message display.
1. [ ] Add in score/high score.

Docs
====

Square
------

(World.js)

Square represents any discrete position on the grid as represented by variables x and y.

Public:

* this.x, this.y - represents the x/y co-ords of the square.
* this.shift direction - Return a new square, shifted on square in a given direction.
* this.matches square - Checks if the co-ords of the square match.

Grid
----

The Grid is representative of a grid overlayed on a canvas as well as elements placed on the grid (e.g. Snake and Pill).

It has width and height variables and contains the pill and the snake elements, and contains the code to generate a new pill whenever the snake eats it.

The grid can check if a square is outside of the grid (i.e. game over).

The Grid also controls the regular update and drawing of the elements on the grid.

Public:

* this.width, this.height - width and height of the grid
* this.isOutside(square) - returns true or false depending if the square is outside the boundaries of the grid.
* this.getSnake - returns the snake.
* this.update - updates the state of the grid and the snake. Return true or false depending on if the game is over.
* this.draw - draws the grid and all elements to the canvas.


Pill
----

A Pill represents the pill that the Snake eats to grow. It has a position on the grid and doesn't do much except for draw itself.

Public:

* this.square - current square on the grid.
* this.draw (ctx, squareSize) - draws the pill on the grid.

Segment
-------

Segment is a section of the snake. Each segment keeps track of its position (square) on the grid as well as that of its parent segment (so it can follow?).

There are three types of segement: leader, tail and blank.

The leader is the head of the snake. It is the only segment not to have a parent. Instead, it has a direction, which can be changed (via Snake).

The tail segments represent the rest of the snake, following the leader.

A blanks are just placeholder segments that keep track of where the snake has been. When the snake 'grows', blanks are converted to tails.

Each turn, the leader shifts to a new square based on the direction it is facing. All following segments (tail or blank) shift to the position their parent just vacated.

Pill
----

A Pill is a object that is placed on the grid in semi-random position. The position is somewhere on the grid that isn't already occupied by the snake.

When the snake's head collides with the Pill it eats it, prompting the snake to grow additional Segments. A new Pill is then generated.

The Pill draws itself.

Snake
-----

Snake is a collection of Segments and Blanks that move across the grid in concert. The first segment is called _leader_ and all subsequent segments follow the leader.

The leader can change direction based on keypresses. And moves in that direction on each turn. 

Every time the head moves, a blank segment is inserted in the start position, thereby attaching itself to the tail of the snake. 

When the snake 'eats' a pill, the snake grows, adding a given number of segments to its 'tail' (by converting a Blank to a Tail type segment).

Message
-------

Message is a simple object that draws text on screen. It has the ability to change the Text message and then draw it. 

Note that the canvas is cleared with each 'update' cycle so the message will be cleared unless it is drawn again.

World
-----

World is the container for the game world and links the Grid to the Canvas.

It controls the animation, which (when started) updates the grid with regular 'turns'.

