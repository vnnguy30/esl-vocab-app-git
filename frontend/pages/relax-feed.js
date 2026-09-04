// pages/relax-feed.js - Feed the Cat mini-game.
// Drag each food item into the bowl. The cat "eats" (a little bounce) each
// time one lands, and gets happier and fuller as the bowl empties.

const FEED_ITEMS = [
  { id: '1', emoji: '🐟', left: 10 },
  { id: '2', emoji: '🍗', left: 82 },
  { id: '3', emoji: '🍤', left: 154 },
  { id: '4', emoji: '🥛', left: 226 },
];

let feedFedCount = 0;
let feedEatingTimeoutId = null;

async function renderFeed(container) {
  feedFedCount = 0;

  container.innerHTML = `
    <section class="card minigame-card">
      <div class="minigame-header">
        <h2>${t('feedHeading')}</h2>
        <a href="#/relax" class="minigame-back-link">${t('minigameBackToRelax')}</a>
      </div>
      <p class="minigame-instructions">${t('feedInstructions')}</p>
      <div class="minigame-progress">
        <div class="minigame-progress-fill" id="feed-progress-fill" style="width: 0%"></div>
      </div>
      <div class="feed-stage feed-hungry" id="feed-stage">
        ${feedCatSvg()}
        <div class="feed-bowl" id="feed-bowl">${feedBowlSvg()}</div>
        ${FEED_ITEMS.map(item => `
          <div class="feed-item" data-food="${item.id}" style="left: ${item.left}px">${item.emoji}</div>
        `).join('')}
      </div>
      <div class="minigame-footer" id="feed-footer" hidden>
        <p class="minigame-done-message">${t('feedDone')}</p>
        <button id="feed-replay-btn" type="button">${t('minigamePlayAgain')}</button>
      </div>
    </section>
  `;

  const bowl = document.getElementById('feed-bowl');
  document.querySelectorAll('.feed-item').forEach(itemEl => makeFoodDraggable(itemEl, bowl));

  document.getElementById('feed-replay-btn').addEventListener('click', () => renderFeed(container));

  return () => {
    if (feedEatingTimeoutId) clearTimeout(feedEatingTimeoutId);
  };
}

function makeFoodDraggable(itemEl, bowlEl) {
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let dx = 0;
  let dy = 0;

  itemEl.addEventListener('pointerdown', (e) => {
    if (itemEl.classList.contains('fed')) return;
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    itemEl.classList.add('dragging');
    itemEl.setPointerCapture(e.pointerId);
  });

  itemEl.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    dx = e.clientX - startX;
    dy = e.clientY - startY;
    itemEl.style.transform = `translate(${dx}px, ${dy}px)`;
  });

  itemEl.addEventListener('pointerup', () => {
    if (!dragging) return;
    dragging = false;
    itemEl.classList.remove('dragging');

    if (rectsOverlap(itemEl.getBoundingClientRect(), bowlEl.getBoundingClientRect())) {
      dropFoodInBowl(itemEl, bowlEl, dx, dy);
    } else {
      itemEl.style.transform = 'translate(0, 0)'; // snap back
    }
  });
}

function rectsOverlap(a, b) {
  return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
}

function dropFoodInBowl(itemEl, bowlEl, dx, dy) {
  const itemRect = itemEl.getBoundingClientRect();
  const bowlRect = bowlEl.getBoundingClientRect();
  const nudgeX = (bowlRect.left + bowlRect.width / 2) - (itemRect.left + itemRect.width / 2);
  const nudgeY = (bowlRect.top + bowlRect.height / 2) - (itemRect.top + itemRect.height / 2);

  itemEl.classList.add('fed');
  itemEl.style.transform = `translate(${dx + nudgeX}px, ${dy + nudgeY}px) scale(0.3)`;

  feedFedCount += 1;
  updateFeedProgress();
  playEatingBounce();

  if (feedFedCount === FEED_ITEMS.length) {
    finishFeeding();
  }
}

function playEatingBounce() {
  const stage = document.getElementById('feed-stage');
  if (!stage) return;
  stage.classList.add('eating');
  if (feedEatingTimeoutId) clearTimeout(feedEatingTimeoutId);
  feedEatingTimeoutId = setTimeout(() => stage.classList.remove('eating'), 500);
}

function updateFeedProgress() {
  const progress = (feedFedCount / FEED_ITEMS.length) * 100;

  const fill = document.getElementById('feed-progress-fill');
  if (fill) fill.style.width = `${progress}%`;

  const stage = document.getElementById('feed-stage');
  if (!stage) return;

  stage.classList.remove('feed-hungry', 'feed-content', 'feed-full');
  if (feedFedCount === 0) {
    stage.classList.add('feed-hungry');
  } else if (feedFedCount < FEED_ITEMS.length) {
    stage.classList.add('feed-content');
  } else {
    stage.classList.add('feed-full');
  }
}

function finishFeeding() {
  const stage = document.getElementById('feed-stage');
  const footer = document.getElementById('feed-footer');
  if (stage) stage.classList.add('feed-complete');
  if (footer) footer.hidden = false;
}

function feedBowlSvg() {
  return `
    <svg viewBox="0 0 80 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="40" cy="24" rx="38" ry="14" fill="#c9c6c0"/>
      <ellipse cx="40" cy="20" rx="30" ry="10" fill="#8a5a35"/>
      <ellipse cx="40" cy="18" rx="26" ry="7" fill="#a8683f"/>
    </svg>
  `;
}

function feedCatSvg() {
  return `
    <svg class="feed-cat" viewBox="0 0 200 190" xmlns="http://www.w3.org/2000/svg">
      <path class="feed-tail" d="M156,130 Q186,120 178,84" stroke="#8b8a86" stroke-width="14" fill="none" stroke-linecap="round"/>

      <ellipse cx="100" cy="118" rx="66" ry="50" fill="#a8a6a1"/>
      <ellipse cx="100" cy="132" rx="34" ry="26" fill="#f6f2ea"/>

      <ellipse cx="70" cy="168" rx="22" ry="16" fill="#ffffff"/>
      <ellipse cx="130" cy="168" rx="22" ry="16" fill="#ffffff"/>

      <circle cx="100" cy="58" r="46" fill="#a8a6a1"/>
      <polygon points="58,40 66,4 84,36" fill="#a8a6a1"/>
      <polygon points="63,32 68,12 76,30" fill="#e8b4b8"/>
      <polygon points="142,40 134,4 116,36" fill="#a8a6a1"/>
      <polygon points="137,32 132,12 124,30" fill="#e8b4b8"/>

      <path d="M78,22 Q82,14 90,18" stroke="#847f78" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M122,22 Q118,14 110,18" stroke="#847f78" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M56,90 Q76,82 92,90" stroke="#847f78" stroke-width="3" fill="none" stroke-linecap="round"/>

      <path d="M30,62 L58,60 M30,70 L58,68" stroke="#c9c6c0" stroke-width="2" stroke-linecap="round"/>
      <path d="M170,62 L142,60 M170,70 L142,68" stroke="#c9c6c0" stroke-width="2" stroke-linecap="round"/>

      <ellipse cx="82" cy="58" rx="5" ry="6.5" fill="#2f2a25"/>
      <ellipse cx="118" cy="58" rx="5" ry="6.5" fill="#2f2a25"/>

      <polygon points="100,70 94,78 106,78" fill="#e8909a"/>

      <!-- mouths: one shown per fullness tier -->
      <g class="mouth-hungry">
        <ellipse cx="100" cy="86" rx="7" ry="6" fill="#5b544c"/>
      </g>
      <g class="mouth-content">
        <path d="M100,82 Q90,90 82,84 M100,82 Q110,90 118,84" stroke="#5b544c" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      </g>
      <g class="mouth-full">
        <path d="M76,80 Q100,104 124,80" stroke="#5b544c" stroke-width="3" fill="none" stroke-linecap="round"/>
      </g>

      <!-- sparkles: shown only once full -->
      <g class="feed-sparkle">
        <text x="34" y="30" font-size="18">✨</text>
        <text x="152" y="34" font-size="16">✨</text>
      </g>
    </svg>
  `;
}
