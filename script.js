const repositoryList = document.querySelector('#repository-list');
const repositoryCount = document.querySelector('#repository-count');

function formatDate(dateString) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(`${dateString}T00:00:00`));
}

function formatStars(stars) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(stars);
}

function renderRepositories(repositories) {
  repositoryCount.textContent = `${repositories.length} ${repositories.length === 1 ? 'repository' : 'repositories'}`;
  repositoryList.innerHTML = repositories.map((repository) => `
    <article class="repository-card">
      <div class="card-topline">
        <span class="repo-mark" aria-hidden="true">★</span>
        <time datetime="${repository.starredAt}">Starred ${formatDate(repository.starredAt)}</time>
      </div>
      <h3><a href="${repository.url}" target="_blank" rel="noreferrer">${repository.repository}</a></h3>
      <p>${repository.description}</p>
      <div class="repository-meta">
        <span><i class="language-dot" aria-hidden="true"></i>${repository.language}</span>
        <span>★ ${formatStars(repository.stars)} stars</span>
      </div>
    </article>
  `).join('');
}

async function loadRepositories() {
  try {
    const response = await fetch('events.json');
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const repositories = await response.json();
    renderRepositories(repositories);
  } catch (error) {
    repositoryList.innerHTML = '<p class="status status-error">The repository list could not be loaded. Try again from a local web server.</p>';
    console.error('Unable to load starred repositories:', error);
  }
}

loadRepositories();