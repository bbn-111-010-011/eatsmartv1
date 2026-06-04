import './style.css';

// ÉTAPE 2 / V3 : ajouter les événements, le panier dynamique et le total.
interface ArticleDTO {
  article_id: number;
  nom: string;
  prix: number | string;
  description: string;
}

const API_BASE_URL = 'http://localhost/aymen_EatSmart_backend/index.php?page=';
let articles: ArticleDTO[] = [];
let panier: ArticleDTO[] = [];

async function fetchArticles(): Promise<ArticleDTO[]> {
  const response = await fetch(`${API_BASE_URL}articles`);

  if (!response.ok) {
    throw new Error(`Erreur API articles : ${response.status}`);
  }

  return await response.json();
}

function calculerTotalPanier(): number {
  return panier.reduce((total, article) => total + Number(article.prix), 0);
}

function afficherArticles(): string {
  return articles
    .map(
      (article) => `
        <article class="card">
          ${Number(article.prix) < 10 ? '<span class="badge"> </span>' : ''}
          <h3>${article.nom}</h3>
          <p>${article.description}</p>
          <p class="price">${Number(article.prix).toFixed(2)} €</p>
          <p class="article-id">ID : ${article.article_id}</p>
          <button class="btn-order" type="button">Ajouter</button>
        </article>
      `,
    )
    .join('');
}

function afficherPanier(): string {
  if (panier.length === 0) {
    return '<p>Votre panier est vide</p>';
  }

  return panier
    .map(
      (article) => `
        <div class="cart-item">
          <span>${article.nom}</span>
          <strong>${Number(article.prix).toFixed(2)} €</strong>
        </div>
      `,
    )
    .join('');
}

function render(): void {
  const appDiv = document.querySelector<HTMLDivElement>('#app');

  if (!appDiv) {
    return;
  }

  appDiv.innerHTML = `
    <header class="app-header">
      <h1>EatSmart - Carte du restaurant</h1>
      <p>Choisissez vos plats et consultez votre panier.</p>
    </header>

    <div class="content-wrapper">
      <main class="menu-container">
        ${afficherArticles()}
      </main>

      <aside class="cart-container">
        <h2>Votre Panier</h2>
        <div id="cart-items">
          ${afficherPanier()}
        </div>
        <hr>
        <div class="cart-total">
          <strong>Total : <span id="total-prix">${calculerTotalPanier().toFixed(2)}</span> €</strong>
        </div>
      </aside>
    </div>
  `;

  brancherEvenementsPanier();
}

function brancherEvenementsPanier(): void {
  // Important : les boutons existent seulement après le innerHTML, donc on branche les événements ici.
  const boutonsAjouter = document.querySelectorAll<HTMLButtonElement>('.btn-order');

  boutonsAjouter.forEach((bouton, index) => {
    bouton.addEventListener('click', () => {
      const articleChoisi = articles[index];

      if (!articleChoisi) {
        return;
      }

      panier.push(articleChoisi);
      console.log(`Bouton n°${index} cliqué`);
      console.log('Plat ajouté :', articleChoisi.nom);
      console.log('État du panier :', panier);

      render();
    });
  });
}

async function init(): Promise<void> {
  const appDiv = document.querySelector<HTMLDivElement>('#app');

  if (!appDiv) {
    return;
  }

  appDiv.innerHTML = '<p class="loading">Chargement du menu...</p>';

  try {
    articles = await fetchArticles();
    console.log('Articles reçus depuis l API :', articles);
    render();
  } catch (error) {
    console.error(error);
    appDiv.innerHTML = '<p class="error">Impossible de charger les articles depuis l API.</p>';
  }
}

init();
