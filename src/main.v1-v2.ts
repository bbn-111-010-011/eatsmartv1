import './style.css';

// ÉTAPE 1 / V2 : récupérer les articles depuis l'API et afficher la carte automatiquement.
interface ArticleDTO {
  article_id: number;
  nom: string;
  prix: number | string;
  description: string;
}

const API_BASE_URL = 'http://localhost/aymen_EatSmart_backend/index.php?page=';

async function fetchArticles(): Promise<ArticleDTO[]> {
  const response = await fetch(`${API_BASE_URL}articles`);

  if (!response.ok) {
    throw new Error(`Erreur API articles : ${response.status}`);
  }

  return await response.json();
}

function afficherMenu(articles: ArticleDTO[]): string {
  return `
    <header class="app-header">
      <h1>EatSmart - Carte du restaurant</h1>
      <p>Liste des plats récupérés depuis l'API.</p>
    </header>

    <main class="menu-container">
      ${articles
        .map(
          (article) => `
            <article class="card">
              ${Number(article.prix) < 10 ? '<span class="badge">Bon Plan</span>' : ''}
              <h3>${article.nom}</h3>
              <p>${article.description}</p>
              <p class="price">${Number(article.prix).toFixed(2)} €</p>
              <p class="article-id">ID : ${article.article_id}</p>
            </article>
          `,
        )
        .join('')}
    </main>
  `;
}

async function init(): Promise<void> {
  const appDiv = document.querySelector<HTMLDivElement>('#app');

  if (!appDiv) {
    return;
  }

  appDiv.innerHTML = '<p class="loading">Chargement du menu...</p>';

  try {
    const articles = await fetchArticles();
    console.log('Articles reçus depuis l API :', articles);
    appDiv.innerHTML = afficherMenu(articles);
  } catch (error) {
    console.error(error);
    appDiv.innerHTML = '<p class="error">Impossible de charger les articles depuis l API.</p>';
  }
}

init();
