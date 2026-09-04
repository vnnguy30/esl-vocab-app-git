// pages/relax-brush.js - Brush the Cat mini-game.
// Drag across the cat to brush it; every bit of drag movement adds a
// little progress. Filling the bar all the way smooths out the fur.

const BRUSH_TARGET_DISTANCE = 1400; // total px of drag movement needed to finish

let brushProgress = 0; // 0-100
let brushDragging = false;
let brushLastX = 0;
let brushLastY = 0;

async function renderBrush(container) {
  brushProgress = 0;
  brushDragging = false;

  container.innerHTML = `
    <section class="card minigame-card">
      <div class="minigame-header">
        <h2>${t('brushHeading')}</h2>
        <a href="#/relax" class="minigame-back-link">${t('minigameBackToRelax')}</a>
      </div>
      <p class="minigame-instructions">${t('brushInstructions')}</p>
      <div class="minigame-progress">
        <div class="minigame-progress-fill" id="brush-progress-fill" style="width: 0%"></div>
      </div>
      <div class="brush-stage brush-messy" id="brush-stage">
        <div class="purr-notes" aria-hidden="true"><span>🎵</span><span>💜</span><span>🎵</span></div>
        ${brushCatSvg()}
      </div>
      <div class="minigame-footer" id="brush-footer" hidden>
        <p class="minigame-done-message">${t('brushDone')}</p>
        <button id="brush-replay-btn" type="button">${t('minigamePlayAgain')}</button>
      </div>
    </section>
  `;

  const stage = document.getElementById('brush-stage');
  stage.addEventListener('pointerdown', startBrushing);
  stage.addEventListener('pointermove', continueBrushing);
  stage.addEventListener('pointerup', stopBrushing);
  stage.addEventListener('pointerleave', stopBrushing);
  stage.addEventListener('pointercancel', stopBrushing);

  document.getElementById('brush-replay-btn').addEventListener('click', () => renderBrush(container));

  // Make sure dragging can't keep running (or add progress) after leaving this page.
  return () => {
    brushDragging = false;
  };
}

function startBrushing(e) {
  if (brushProgress >= 100) return;
  brushDragging = true;
  brushLastX = e.clientX;
  brushLastY = e.clientY;
  const stage = document.getElementById('brush-stage');
  if (stage) stage.classList.add('brushing');
}

function continueBrushing(e) {
  if (!brushDragging || brushProgress >= 100) return;

  const dx = e.clientX - brushLastX;
  const dy = e.clientY - brushLastY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  brushLastX = e.clientX;
  brushLastY = e.clientY;

  updateBrushProgress(distance);
}

function stopBrushing() {
  brushDragging = false;
  const stage = document.getElementById('brush-stage');
  if (stage) stage.classList.remove('brushing');
}

function updateBrushProgress(distance) {
  brushProgress = Math.min(100, brushProgress + (distance / BRUSH_TARGET_DISTANCE) * 100);

  const fill = document.getElementById('brush-progress-fill');
  if (fill) fill.style.width = `${brushProgress}%`;

  const stage = document.getElementById('brush-stage');
  if (!stage) return;

  stage.classList.remove('brush-messy', 'brush-half', 'brush-smooth');
  if (brushProgress < 33) {
    stage.classList.add('brush-messy');
  } else if (brushProgress < 100) {
    stage.classList.add('brush-half');
  } else {
    stage.classList.add('brush-smooth');
  }

  if (brushProgress >= 100) {
    finishBrushing();
  }
}

function finishBrushing() {
  brushDragging = false;
  const stage = document.getElementById('brush-stage');
  const footer = document.getElementById('brush-footer');
  if (stage) {
    stage.classList.remove('brushing');
    stage.classList.add('brush-complete');
  }
  if (footer) footer.hidden = false;
}

function brushCatSvg() {
  return `
    <svg class="brush-cat" viewBox="0 0 200 190" xmlns="http://www.w3.org/2000/svg">
      <path class="brush-tail" d="M156,130 Q186,120 178,84" stroke="#d97a3d" stroke-width="14" fill="none" stroke-linecap="round"/>

      <ellipse cx="100" cy="118" rx="66" ry="50" fill="#e0873c"/>
      <ellipse cx="100" cy="132" rx="34" ry="26" fill="#fffaf0"/>

      <ellipse cx="70" cy="168" rx="22" ry="16" fill="#fffaf0"/>
      <ellipse cx="130" cy="168" rx="22" ry="16" fill="#fffaf0"/>

      <circle cx="100" cy="58" r="46" fill="#e0873c"/>
      <polygon points="58,40 66,4 84,36" fill="#e0873c"/>
      <polygon points="63,32 68,12 76,30" fill="#fbd7c4"/>
      <polygon points="142,40 134,4 116,36" fill="#e0873c"/>
      <polygon points="137,32 132,12 124,30" fill="#fbd7c4"/>

      <!-- messy fur tufts: shown only while brush-messy -->
      <g class="fur-tuft">
        <path d="M50,90 l-4,-8 M56,86 l-2,-9 M62,88 l-3,-8" stroke="#b95f22" stroke-width="2" stroke-linecap="round"/>
        <path d="M138,88 l3,-8 M144,86 l2,-9 M150,90 l4,-8" stroke="#b95f22" stroke-width="2" stroke-linecap="round"/>
        <path d="M92,20 l-2,-8 M100,18 l0,-9 M108,20 l2,-8" stroke="#b95f22" stroke-width="2" stroke-linecap="round"/>
      </g>

      <!-- shine sparkles: shown only once fully brushed -->
      <g class="fur-shine">
        <text x="38" y="80" font-size="16">✨</text>
        <text x="150" y="70" font-size="14">✨</text>
        <text x="98" y="150" font-size="14">✨</text>
      </g>

      <path d="M30,62 L58,60 M30,70 L58,68" stroke="#f3c9a8" stroke-width="2" stroke-linecap="round"/>
      <path d="M170,62 L142,60 M170,70 L142,68" stroke="#f3c9a8" stroke-width="2" stroke-linecap="round"/>

      <ellipse cx="82" cy="58" rx="5" ry="6.5" fill="#2f2a25"/>
      <ellipse cx="118" cy="58" rx="5" ry="6.5" fill="#2f2a25"/>

      <polygon points="100,70 94,78 106,78" fill="#8a4a2a"/>

      <!-- mouths: one shown per brush stage -->
      <g class="mouth-dull">
        <path d="M88,84 Q100,88 112,84" stroke="#8a4a2a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      </g>
      <g class="mouth-half">
        <path d="M100,82 Q90,90 82,84 M100,82 Q110,90 118,84" stroke="#8a4a2a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      </g>
      <g class="mouth-happy2">
        <path d="M76,80 Q100,104 124,80" stroke="#8a4a2a" stroke-width="3" fill="none" stroke-linecap="round"/>
      </g>
    </svg>
  `;
}
