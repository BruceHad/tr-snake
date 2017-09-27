import * as World from './world';

window.onload = function() {
    let world = new World.World(30, 30, 7);
    world.init();
};
