// script.js - App bootstrap: load the UI language, register every page's
// route, then start the router. All actual page logic lives in pages/*.js.

async function init() {
  await initI18n();

  registerRoute('/home', renderHome);
  registerRoute('/study', renderStudy);
  registerRoute('/dictionary', renderDictionary);
  registerRoute('/relax', renderRelax);
  registerRoute('/relax/trim-nails', renderTrimNails);
  registerRoute('/settings', renderSettings);
  registerRoute('/help', renderHelp);

  initRouter();
}

init();
