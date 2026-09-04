// components/navbar.js - Top nav bar shown on every page.
// router.js calls onRouteChanged(path) after each navigation so the
// matching link can be highlighted as active.

const NAV_ITEMS = [
  { path: '/home', labelKey: 'navHome' },
  { path: '/study', labelKey: 'navStudy' },
  { path: '/dictionary', labelKey: 'navDictionary' },
  { path: '/relax', labelKey: 'navRelax' },
  { path: '/settings', labelKey: 'navSettings' },
  { path: '/help', labelKey: 'navHelp' },
];

function renderNavbar(activePath) {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  nav.innerHTML = NAV_ITEMS.map(item => {
    // Sub-pages like "/relax/trim-nails" should still highlight "Relax".
    const isActive = activePath === item.path || activePath.startsWith(item.path + '/');
    return `
      <a href="#${item.path}" class="nav-link${isActive ? ' active' : ''}">
        ${t(item.labelKey)}
      </a>
    `;
  }).join('');
}

function onRouteChanged(path) {
  renderNavbar(path);
}
