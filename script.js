/* Snake game - canvas implementation */
(function () {
  const canvas = document.getElementById('game');
  const context = canvas.getContext('2d');

  const scoreEl = document.getElementById('score');
  const highScoreEl = document.getElementById('highScore');
  const speedEl = document.getElementById('speed');

  const overlay = document.getElementById('overlay');
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const restartBtn = document.getElementById('restartBtn');

  const tileSize = 24; // px per grid cell
  const gridWidth = Math.floor(canvas.width / tileSize); // 24 for 576px
  const gridHeight = Math.floor(canvas.height / tileSize); // 20 for 480px

  const colors = {
    backgroundGrid: '#1a1f39',
    snakeHead: '#ffffff',
    snakeBody: '#9ec1ff',
    apple: '#3ad29f',
    wall: '#0c0f1e',
    textShadow: 'rgba(0,0,0,0.25)'
  };

  const initialMoveDelayMs = 140;
  const minMoveDelayMs = 60;
  const speedUpPerAppleMs = 4;

  let rng = mulberry32(Date.now());

  /** Game state */
  let isRunning = false;
  let isPaused = false;
  let hasStartedOnce = false;

  let score = 0;
  let highScore = Number(localStorage.getItem('snake:highscore') || '0');
  updateText(scoreEl, score);
  updateText(highScoreEl, highScore);

  let moveDelayMs = initialMoveDelayMs;
  updateSpeedUi();

  /** Snake represented as array of grid cells [head first] */
  let snakeCells = [];
  /** Current and next movement directions */
  let currentDirection = { x: 1, y: 0 };
  let queuedDirection = { x: 1, y: 0 };

  /** Apple position */
  let apple = { x: 10, y: 10 };

  /** RAF accumulator */
  let lastFrameTs = 0;
  let accumulatorMs = 0;

  function resetGame() {
    score = 0;
    moveDelayMs = initialMoveDelayMs;
    updateSpeedUi();
    updateText(scoreEl, score);

    // Center-start snake length 3
    const startX = Math.floor(gridWidth / 2) - 2;
    const startY = Math.floor(gridHeight / 2);
    snakeCells = [
      { x: startX + 2, y: startY },
      { x: startX + 1, y: startY },
      { x: startX + 0, y: startY },
    ];
    currentDirection = { x: 1, y: 0 };
    queuedDirection = { x: 1, y: 0 };

    apple = spawnApple();

    isPaused = false;
    drawFrame();
  }

  function startGame() {
    overlay.classList.add('hidden');
    if (!hasStartedOnce) {
      hasStartedOnce = true;
    }
    isRunning = true;
    isPaused = false;
    lastFrameTs = 0;
    accumulatorMs = 0;
    loop(0);
  }

  function pauseToggle() {
    if (!isRunning) return;
    isPaused = !isPaused;
    if (!isPaused) {
      lastFrameTs = 0;
      accumulatorMs = 0;
      loop(0);
    }
  }

  function endGame() {
    isRunning = false;
    isPaused = false;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('snake:highscore', String(highScore));
      updateText(highScoreEl, highScore);
    }
    overlay.classList.remove('hidden');
  }

  function loop(ts) {
    if (!isRunning || isPaused) return;

    if (!lastFrameTs) lastFrameTs = ts;
    const deltaMs = ts - lastFrameTs;
    lastFrameTs = ts;

    accumulatorMs += deltaMs;
    while (accumulatorMs >= moveDelayMs) {
      step();
      accumulatorMs -= moveDelayMs;
    }

    drawFrame();
    requestAnimationFrame(loop);
  }

  function step() {
    // Apply queued direction, but disallow 180-degree turns
    if (!isOpposite(queuedDirection, currentDirection)) {
      currentDirection = queuedDirection;
    }

    const newHead = {
      x: snakeCells[0].x + currentDirection.x,
      y: snakeCells[0].y + currentDirection.y,
    };

    // Collisions with walls
    if (
      newHead.x < 0 || newHead.x >= gridWidth ||
      newHead.y < 0 || newHead.y >= gridHeight
    ) {
      endGame();
      return;
    }

    // Collisions with self
    if (snakeCells.some(cell => cell.x === newHead.x && cell.y === newHead.y)) {
      endGame();
      return;
    }

    // Move snake
    snakeCells.unshift(newHead);

    // Apple eaten?
    if (newHead.x === apple.x && newHead.y === apple.y) {
      score += 1;
      updateText(scoreEl, score);
      moveDelayMs = Math.max(minMoveDelayMs, moveDelayMs - speedUpPerAppleMs);
      updateSpeedUi();
      apple = spawnApple();
    } else {
      snakeCells.pop();
    }
  }

  function drawFrame() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // background grid
    drawGrid();

    // apple
    drawCell(apple.x, apple.y, colors.apple, 6);

    // snake
    snakeCells.forEach((cell, index) => {
      const color = index === 0 ? colors.snakeHead : colors.snakeBody;
      const radius = index === 0 ? 6 : 8;
      drawCell(cell.x, cell.y, color, radius);
    });

    // if paused overlay note
    if (isRunning && isPaused) {
      drawBanner('Пауза');
    }
    if (!isRunning && hasStartedOnce) {
      drawBanner('Конец игры');
    }
  }

  function drawGrid() {
    context.save();
    context.strokeStyle = '#20264a';
    context.lineWidth = 1;
    for (let x = 0; x <= gridWidth; x++) {
      const px = x * tileSize;
      context.beginPath();
      context.moveTo(px + 0.5, 0);
      context.lineTo(px + 0.5, canvas.height);
      context.stroke();
    }
    for (let y = 0; y <= gridHeight; y++) {
      const py = y * tileSize;
      context.beginPath();
      context.moveTo(0, py + 0.5);
      context.lineTo(canvas.width, py + 0.5);
      context.stroke();
    }
    context.restore();
  }

  function drawCell(gx, gy, fill, radius = 6) {
    const x = gx * tileSize;
    const y = gy * tileSize;
    const size = tileSize;

    context.save();
    context.fillStyle = fill;
    roundRect(context, x + 3, y + 3, size - 6, size - 6, radius);
    context.fill();
    context.restore();
  }

  function drawBanner(text) {
    context.save();
    context.fillStyle = 'rgba(0,0,0,0.35)';
    const w = canvas.width * 0.7;
    const h = 70;
    const x = (canvas.width - w) / 2;
    const y = (canvas.height - h) / 2;
    roundRect(context, x, y, w, h, 10);
    context.fill();

    context.font = 'bold 28px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#fff';
    context.shadowColor = colors.textShadow;
    context.shadowBlur = 10;
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    context.restore();
  }

  function spawnApple() {
    const free = [];
    outer: for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        if (!snakeCells.some(c => c.x === x && c.y === y)) {
          free.push({ x, y });
        }
      }
    }
    if (free.length === 0) return { x: 0, y: 0 };
    return free[Math.floor(rng() * free.length)];
  }

  function isOpposite(a, b) {
    return a.x === -b.x && a.y === -b.y;
  }

  function updateText(el, value) { el.textContent = String(value); }
  function updateSpeedUi() {
    const factor = (initialMoveDelayMs / moveDelayMs).toFixed(2).replace(/\.00$/, '');
    speedEl.textContent = factor + 'x';
  }

  // Utilities
  function roundRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  // Mulberry32 PRNG for nice apple placement
  function mulberry32(seed) {
    return function() {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
  }

  // Input handling
  const keyToDir = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
    w: { x: 0, y: -1 },
    s: { x: 0, y: 1 },
    a: { x: -1, y: 0 },
    d: { x: 1, y: 0 },
    W: { x: 0, y: -1 },
    S: { x: 0, y: 1 },
    A: { x: -1, y: 0 },
    D: { x: 1, y: 0 },
  };

  window.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      if (!isRunning) { startGame(); }
      else { pauseToggle(); }
      return;
    }
    if (e.key === 'p' || e.key === 'P') {
      pauseToggle();
      return;
    }

    const dir = keyToDir[e.key];
    if (!dir) return;

    // Queue direction if it does not cause immediate reverse
    if (!isOpposite(dir, currentDirection)) {
      queuedDirection = dir;
    }
  });

  // Touch controls
  document.querySelectorAll('[data-dir]')?.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-dir');
      const dir =
        type === 'up' ? { x: 0, y: -1 } :
        type === 'down' ? { x: 0, y: 1 } :
        type === 'left' ? { x: -1, y: 0 } :
        { x: 1, y: 0 };
      if (!isOpposite(dir, currentDirection)) {
        queuedDirection = dir;
      }
    });
  });

  // Buttons
  startBtn.addEventListener('click', () => {
    resetGame();
    startGame();
  });
  pauseBtn.addEventListener('click', () => pauseToggle());
  restartBtn.addEventListener('click', () => {
    resetGame();
    startGame();
  });

  // Init first draw
  resetGame();
})();