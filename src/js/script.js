import * as World from './world';

window.onload = function() {
    let world = new World.World(20, 20, 8);
    world.init();
};
