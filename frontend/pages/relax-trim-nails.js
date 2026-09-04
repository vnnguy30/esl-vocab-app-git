// pages/relax-trim-nails.js - Trim Nails mini-game.
// Click each of the cat's 5 claws to trim it. The cat's mood improves as
// more claws are done; finishing all 5 shows a happy "Done!" state.

const TRIM_NAILS_CLAW_COUNT = 5;

let trimmedClaws = new Set();

async function renderTrimNails(container) {
  trimmedClaws = new Set();

  container.innerHTML = `
    <section class="card minigame-card">
      <div class="minigame-header">
        <h2>${t('trimNailsHeading')}</h2>
        <a href="#/relax" class="minigame-back-link">${t('minigameBackToRelax')}</a>
      </div>
      <p class="minigame-instructions">${t('trimNailsInstructions')}</p>
      <div class="trim-nails-stage" id="trim-nails-stage">
        ${trimNailsCatSvg()}
      </div>
      <div class="minigame-footer" id="trim-nails-footer" hidden>
        <p class="minigame-done-message">${t('trimNailsDone')}</p>
        <button id="trim-nails-replay-btn" type="button">${t('minigamePlayAgain')}</button>
      </div>
    </section>
  `;

  document.querySelectorAll('.claw').forEach(clawEl => {
    clawEl.addEventListener('click', () => trimClaw(clawEl));
  });
  document.getElementById('trim-nails-replay-btn').addEventListener('click', () => renderTrimNails(container));

  updateTrimNailsMood();
}

function trimClaw(clawEl) {
  const clawId = clawEl.dataset.claw;
  if (trimmedClaws.has(clawId)) return;

  trimmedClaws.add(clawId);
  clawEl.classList.add('trimmed');
  updateTrimNailsMood();

  if (trimmedClaws.size === TRIM_NAILS_CLAW_COUNT) {
    finishTrimNails();
  }
}

function updateTrimNailsMood() {
  const stage = document.getElementById('trim-nails-stage');
  if (!stage) return;

  stage.classList.remove('mood-annoyed', 'mood-relaxed', 'mood-happy');
  if (trimmedClaws.size === 0) {
    stage.classList.add('mood-annoyed');
  } else if (trimmedClaws.size < TRIM_NAILS_CLAW_COUNT) {
    stage.classList.add('mood-relaxed');
  } else {
    stage.classList.add('mood-happy');
  }
}

function finishTrimNails() {
  const stage = document.getElementById('trim-nails-stage');
  const footer = document.getElementById('trim-nails-footer');
  if (stage) stage.classList.add('trim-nails-complete');
  if (footer) footer.hidden = false;
}

function trimNailsCatSvg() {
  return `
    <svg class="trim-nails-cat" viewBox="0 0 200 190" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="118" rx="66" ry="50" fill="#a8a6a1"/>
      <ellipse cx="100" cy="132" rx="34" ry="26" fill="#f6f2ea"/>

      <!-- paws -->
      <ellipse cx="70" cy="168" rx="22" ry="16" fill="#ffffff"/>
      <ellipse cx="130" cy="168" rx="22" ry="16" fill="#ffffff"/>

      <!-- claws: 3 on the left paw, 2 on the right. Each has an invisible
           circle behind it so the clickable area is bigger than the tiny
           triangle - easier to tap accurately, especially on touch. -->
      <g class="claw" data-claw="1">
        <circle class="claw-hit-area" cx="54" cy="151" r="14"/>
        <polygon class="claw-shape" points="50,158 58,158 54,144" fill="#f6f2ea" stroke="#c9c6c0" stroke-width="1"/>
        <text class="claw-check" x="54" y="151" text-anchor="middle">✓</text>
      </g>
      <g class="claw" data-claw="2">
        <circle class="claw-hit-area" cx="70" cy="145" r="14"/>
        <polygon class="claw-shape" points="65,154 75,154 70,136" fill="#f6f2ea" stroke="#c9c6c0" stroke-width="1"/>
        <text class="claw-check" x="70" y="148" text-anchor="middle">✓</text>
      </g>
      <g class="claw" data-claw="3">
        <circle class="claw-hit-area" cx="86" cy="151" r="14"/>
        <polygon class="claw-shape" points="82,158 90,158 86,144" fill="#f6f2ea" stroke="#c9c6c0" stroke-width="1"/>
        <text class="claw-check" x="86" y="151" text-anchor="middle">✓</text>
      </g>
      <g class="claw" data-claw="4">
        <circle class="claw-hit-area" cx="116" cy="151" r="14"/>
        <polygon class="claw-shape" points="112,158 120,158 116,144" fill="#f6f2ea" stroke="#c9c6c0" stroke-width="1"/>
        <text class="claw-check" x="116" y="151" text-anchor="middle">✓</text>
      </g>
      <g class="claw" data-claw="5">
        <circle class="claw-hit-area" cx="146" cy="151" r="14"/>
        <polygon class="claw-shape" points="142,158 150,158 146,144" fill="#f6f2ea" stroke="#c9c6c0" stroke-width="1"/>
        <text class="claw-check" x="146" y="151" text-anchor="middle">✓</text>
      </g>

      <!-- head -->
      <circle cx="100" cy="58" r="46" fill="#a8a6a1"/>
      <polygon points="58,40 66,4 84,36" fill="#a8a6a1"/>
      <polygon points="63,32 68,12 76,30" fill="#e8b4b8"/>
      <polygon points="142,40 134,4 116,36" fill="#a8a6a1"/>
      <polygon points="137,32 132,12 124,30" fill="#e8b4b8"/>

      <!-- tabby stripes -->
      <path d="M78,22 Q82,14 90,18" stroke="#847f78" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M122,22 Q118,14 110,18" stroke="#847f78" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M56,90 Q76,82 92,90" stroke="#847f78" stroke-width="3" fill="none" stroke-linecap="round"/>

      <!-- whiskers -->
      <path d="M30,62 L58,60 M30,70 L58,68" stroke="#c9c6c0" stroke-width="2" stroke-linecap="round"/>
      <path d="M170,62 L142,60 M170,70 L142,68" stroke="#c9c6c0" stroke-width="2" stroke-linecap="round"/>

      <!-- eyes -->
      <ellipse cx="82" cy="58" rx="5" ry="6.5" fill="#2f2a25"/>
      <ellipse cx="118" cy="58" rx="5" ry="6.5" fill="#2f2a25"/>

      <!-- eyebrows: annoyed mood only -->
      <g class="eyebrows">
        <line x1="70" y1="42" x2="86" y2="48" stroke="#5b544c" stroke-width="3" stroke-linecap="round"/>
        <line x1="130" y1="42" x2="114" y2="48" stroke="#5b544c" stroke-width="3" stroke-linecap="round"/>
      </g>

      <!-- nose -->
      <polygon points="100,70 94,78 106,78" fill="#e8909a"/>

      <!-- mouths: one shown per mood -->
      <g class="mouth-annoyed">
        <path d="M84,86 Q90,80 96,84 M116,86 Q110,80 104,84" stroke="#5b544c" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      </g>
      <g class="mouth-relaxed">
        <path d="M100,82 Q90,90 82,84 M100,82 Q110,90 118,84" stroke="#5b544c" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      </g>
      <g class="mouth-happy">
        <path d="M76,80 Q100,104 124,80" stroke="#5b544c" stroke-width="3" fill="none" stroke-linecap="round"/>
      </g>

      <!-- sparkles: happy mood only -->
      <g class="sparkle">
        <text x="34" y="30" font-size="18">✨</text>
        <text x="152" y="34" font-size="16">✨</text>
      </g>
    </svg>
  `;
}
