document.addEventListener('DOMContentLoaded', function () {
  const searchContainer = document.getElementById('navbarSearch');
  const input = searchContainer.querySelector('input');
  const form = searchContainer.querySelector('form');
  const resultsContainer = document.getElementById('searchResults');
  const trendingList = document.querySelector('.search-trending-list');

  const allGames = Array.isArray(window.SEARCH_GAMES) ? window.SEARCH_GAMES : [];
// CUSTOM DEFAULT GAMES YOU CHOOSE
const DEFAULT_GAMES = [
  "/g/geometrydashsubzero",

  "/g/bowmasters",
    "/g/braintest",
    "/g/golforbit",


];

  form.addEventListener('submit', function (e) {
    e.preventDefault();
  });

  document.addEventListener('click', (e) => {
    if (searchContainer.contains(e.target)) {
      searchContainer.classList.add('active');
    } else {
      searchContainer.classList.remove('active');
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchContainer.classList.remove('active');
      input.blur();
    }
  });

  function renderResults(list) {
    if (!resultsContainer) return;

    if (!list.length) {
      resultsContainer.innerHTML = `
        <div style="padding:0.4vw 0.2vw; font-size:0.8vw; color:#cccccc;">
          No games found.
        </div>
      `;
      return;
    }

    const html = list.map(game => `
      <a href="${game.url}" class="search-game">
        <img src="${game.image}" alt="${game.name}" class="search-game-thumb">
        <div class="search-game-text">
          <div class="search-game-title">${game.name}</div>
          <div class="search-game-desc">Click to play ${game.name}</div>
        </div>
      </a>
    `).join('');

    resultsContainer.innerHTML = html;
  }

function renderDefaultResults() {
  // find matching game objects by URL
  const list = DEFAULT_GAMES
    .map(url => allGames.find(g => g.url === url))
    .filter(Boolean); // remove missing ones

  renderResults(list);
}


  function handleSearchInput() {
    const query = input.value.trim().toLowerCase();

    if (!query) {
      renderDefaultResults();
      return;
    }

    const filtered = allGames
      .filter(g => g.name.toLowerCase().includes(query))
      .slice(0, 6);

    renderResults(filtered);
  }

  input.addEventListener('input', handleSearchInput);

  input.addEventListener('focus', () => {
    searchContainer.classList.add('active');
    if (!input.value.trim()) {
      renderDefaultResults();
    } else {
      handleSearchInput();
    }
  });

  // Clicking a trending search fills input and triggers search
  if (trendingList) {
    trendingList.addEventListener('click', (e) => {
      const li = e.target.closest('li');
      if (!li) return;
      const q = li.getAttribute('data-query') || li.innerText.trim();
      input.value = q;
      searchContainer.classList.add('active');
      handleSearchInput();
      input.focus();
    });
  }

  renderDefaultResults();
});