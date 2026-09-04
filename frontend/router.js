// router.js - Minimal hash-based client-side router.
//
// Why hash routing (URLs like "#/study" instead of "/study"): the part
// after "#" never gets sent to the server, so it works with zero server
// config - both with `npx serve` locally and on any static host later
// (Netlify/Vercel). The browser already treats hash changes as history
// entries, so back/forward work for free.

const routes = {};
let currentCleanup = null;

// Called once per page (e.g. from script.js) to map a path to a render function.
// renderFn receives the <main id="app"> element and may return a cleanup
// function, which runs right before the user navigates away from that page.
function registerRoute(path, renderFn) {
  routes[path] = renderFn;
}

function getCurrentPath() {
  const hash = window.location.hash.slice(1); // remove leading '#'
  return hash || '/home';
}

async function renderRoute() {
  // Let the outgoing page cancel any pending timers/listeners first,
  // so they don't fire later against DOM that's no longer on screen.
  if (typeof currentCleanup === 'function') {
    currentCleanup();
    currentCleanup = null;
  }

  // A cat popup menu (components/cats.js) should never survive a page
  // change - close it here so its "click outside" listener can't leak.
  if (typeof closeAllCatMenus === 'function') closeAllCatMenus();

  const path = getCurrentPath();
  const page = routes[path] || routes['/home'];
  const app = document.getElementById('app');
  app.innerHTML = '';

  const cleanup = await page(app);
  if (typeof cleanup === 'function') {
    currentCleanup = cleanup;
  }

  // Let the navbar know which link should show as active.
  if (typeof onRouteChanged === 'function') onRouteChanged(path);
}

function initRouter() {
  window.addEventListener('hashchange', renderRoute);

  if (!window.location.hash) {
    // Setting the hash triggers 'hashchange', which calls renderRoute().
    window.location.hash = '/home';
  } else {
    renderRoute();
  }
}
