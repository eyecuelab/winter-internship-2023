const UPS = 15;
const CANVAS_HEIGHT = 800;
const CANVAS_WIDTH = 800;

function init() {
  
}

function update() {
  
}


const Time = {
  t: 0,
  dt: 0,
  loop: 0,
  frame: 0,
  frameTime: 0,
  fps: 0,
};


let _startTime = performance.now();
let _lastTick = performance.now();
const _timestep = 1000 / UPS;
let _currentFrame = 0;
let _fps = 15;
let _lastFpsUpdate = 0;
let _framesSinceFPSUpdate = 0;
function _mainLoop() {
  const frameID = requestAnimationFrame(_mainLoop);
  
  try {
    const t = performance.now();
    const nextTick = _lastTick + _timestep;
    let numTicks = 0;
    if (t > nextTick) {
      numTicks = Math.floor((t - _lastTick) / _timestep);
    }
    if (numTicks > 4) {
      console.log(`dropping ${numTicks} frames`);
      numTicks = 0;
      _lastTick = t;
    }
    
    if (t - _lastFpsUpdate > 200) {
      _fps = 0.9 * _framesSinceFPSUpdate * 1000 / (t - _lastFpsUpdate) + 0.1 * _fps;
      Time.fps = _fps;
      _lastFpsUpdate = t;
      _framesSinceFPSUpdate = 0;
    }
    
    _framesSinceFPSUpdate++;

    // Update
    for (let i = 0; i < numTicks; i++) {
      _lastTick += _timestep;
      Time.t = _lastTick - _startTime;
      Time.dt = _timestep;
     
      update(); //this does literally nothing
    }

    // Draw
    Time.frame = _currentFrame;
    Time.frameTime = t;
    draw(); //this moves the square in a circle
    _currentFrame++;
  } catch (e) {
    cancelAnimationFrame(frameID);
    throw(e);
  }
}


// Go
console.clear();
_setCanvasSize();
init();
_mainLoop();
