/*
  app.js — coeur applicatif de la base WeCraft.

  Chaque section vit dans son propre fichier HTML sous /sections/.
  Le shell (index.html) ne charge que celui dont on a besoin, ce qui
  garde le poids initial du site faible : ajouter une nouvelle section
  plus tard = un nouveau fichier + une ligne dans SECTIONS, rien à
  toucher dans index.html.

  Note : le chargement se fait via fetch(), donc le site doit être
  servi par un serveur local (ex. `python3 -m http.server`) plutôt
  qu'ouvert directement en double-clic (file://), sans quoi les
  navigateurs bloquent la requête par sécurité.
*/

const SECTIONS = {
  home: { file: 'sections/home.html', label: 'Accueil' },
  search: { file: 'sections/search.html', label: 'Recherche' },
  calendar: { file: 'sections/calendar.html', label: 'Calendrier' },
};

const contentEl = document.getElementById('app-content');
const navButtons = document.querySelectorAll('.nav-btn[data-section]');
const cache = new Map();

async function loadSection(name) {
  const entry = SECTIONS[name];
  if (!entry) return;

  navButtons.forEach((btn) => {
    if (btn.dataset.section === name) {
      btn.setAttribute('aria-current', 'page');
    } else {
      btn.removeAttribute('aria-current');
    }
  });

  contentEl.classList.remove('is-ready');
  contentEl.classList.add('is-loading');

  try {
    let html = cache.get(name);
    if (!html) {
      const res = await fetch(entry.file);
      if (!res.ok) throw new Error(`Impossible de charger ${entry.file}`);
      html = await res.text();
      cache.set(name, html);
    }
    contentEl.innerHTML = html;
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.title = `WeCraft — ${entry.label}`;
  } catch (err) {
    contentEl.innerHTML = `
      <div class="section">
        <div class="coming-soon">
          <h2>Section indisponible</h2>
          <p>${entry.label} n'a pas pu être chargée. Vérifie que le site est bien servi via un serveur local (et non ouvert en fichier direct).</p>
        </div>
      </div>`;
  } finally {
    requestAnimationFrame(() => {
      contentEl.classList.remove('is-loading');
      contentEl.classList.add('is-ready');
    });
  }

  history.replaceState(null, '', `#${name}`);
}

navButtons.forEach((btn) => {
  btn.addEventListener('click', () => loadSection(btn.dataset.section));
});

/* Barre supérieure : fond au scroll */
const topbar = document.querySelector('.topbar');
window.addEventListener('scroll', () => {
  topbar.classList.toggle('is-scrolled', window.scrollY > 8);
});

/* Menu profil */
const profile = document.querySelector('.profile');
const profileBtn = document.querySelector('.profile-btn');
profileBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  profile.classList.toggle('is-open');
});
document.addEventListener('click', () => profile.classList.remove('is-open'));

/* Point d'entrée */
const initial = window.location.hash.replace('#', '') || 'home';
loadSection(SECTIONS[initial] ? initial : 'home');
