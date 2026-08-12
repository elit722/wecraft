/* ==========================================================================
   WECRAFT — Script partagé (chargé sur toutes les pages)
   ========================================================================== */

/* ---- Registre des thèmes -------------------------------------------------
   Prévu pour la future page de sélection de thème : chaque entrée correspond
   à une valeur de data-theme définie dans css/theme.css. Pour ajouter un
   thème : l'ajouter ici + ajouter le bloc de variables correspondant dans
   theme.css. La page profil lira ce tableau pour construire son sélecteur.
   -------------------------------------------------------------------------- */
const WC_THEMES = [
  { id: "ciel-etoile", label: "Ciel étoilé", swatch: "#5b7fe0" },
  // { id: "aurore", label: "Aurore", swatch: "#8a5bd6" },  // exemple futur thème
];

const WC_THEME_STORAGE_KEY = "wecraft-theme";

function wcApplyStoredTheme() {
  const saved = localStorage.getItem(WC_THEME_STORAGE_KEY);
  const theme = WC_THEMES.find((t) => t.id === saved) ? saved : WC_THEMES[0].id;
  document.documentElement.setAttribute("data-theme", theme);
  return theme;
}

function wcSetTheme(themeId) {
  document.documentElement.setAttribute("data-theme", themeId);
  localStorage.setItem(WC_THEME_STORAGE_KEY, themeId);
}

/* ---- Fond étoilé ---------------------------------------------------------
   Génère un semis d'étoiles scintillantes derrière le contenu. Densité
   raisonnable, tailles/positions/durées aléatoires pour un effet naturel.
   -------------------------------------------------------------------------- */
function wcBuildStarfield() {
  const field = document.querySelector(".wc-starfield");
  if (!field) return;

  const count = window.innerWidth < 720 ? 70 : 140;
  const frag = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const star = document.createElement("span");
    star.className = "wc-star";
    const size = Math.random() * 1.8 + 0.6;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty("--o", (Math.random() * 0.6 + 0.3).toFixed(2));
    star.style.setProperty("--dur", `${(Math.random() * 4 + 3).toFixed(1)}s`);
    star.style.setProperty("--delay", `${(Math.random() * 5).toFixed(1)}s`);
    frag.appendChild(star);
  }
  field.appendChild(frag);
}

/* ---- Navigation active ---------------------------------------------------
   Marque le bouton de la sidebar correspondant à la page courante.
   -------------------------------------------------------------------------- */
function wcMarkActiveNav() {
  const current = document.body.dataset.page;
  document.querySelectorAll(".wc-navbtn[data-page]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.page === current);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  wcApplyStoredTheme();
  wcBuildStarfield();
  wcMarkActiveNav();
});
