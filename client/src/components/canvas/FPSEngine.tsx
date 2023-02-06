export const Time = {
  t: 0,
  dt: 0,
  loop: 0,
  frame: 0,
  frameTime: 0,
  fps: 0,
};

export const TimeMath = {
  _startTime: performance.now(),
  _lastTick: performance.now(),
  _timestep: 1000/60,
  _currentFrame: 0,
  _fps: 60,
  _lastFpsUpdate: 0,
  _framesSinceFPSUpdate: 0,
};