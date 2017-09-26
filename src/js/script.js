import * as World from './world';

window.onload = function() {
    let world = new World.World(20, 20, 4);
    world.init();
};
