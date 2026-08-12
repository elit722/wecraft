/*
  theme.js — gestion du thème de couleur actif.

  Pour l'instant un seul thème existe ("starlight"), mais toute la
  logique de sélection/persistance est déjà en place : le jour où
  d'autres thèmes seront ajoutés dans css/theme.css, il suffira de :
    1. lister leur nom dans WeCraftTheme.available
    2. construire le sélecteur qui appelle WeCraftTheme.apply(nom)
  Rien d'autre à changer dans le reste du site.
*/
const WeCraftTheme = (function () {
  const STORAGE_KEY = 'wecraft:theme';
  const DEFAULT_THEME = 'starlight';
  const available = ['starlight']; // futurs thèmes ajoutés ici

  function apply(name) {
    const theme = available.includes(name) ? name : DEFAULT_THEME;
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* stockage indisponible, on continue sans persister */
    }
  }

  function init() {
    let saved = DEFAULT_THEME;
    try {
      saved = localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
    } catch (e) {
      /* ignore */
    }
    apply(saved);
  }

  return { apply, init, available };
})();

WeCraftTheme.init();
