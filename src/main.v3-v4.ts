
// Cela permet d'appliquer le style à la page.
import './style.css';


// -----------------------------------------------------------------------------
// INTERFACES TYPESCRIPT
// -----------------------------------------------------------------------------
// Une interface sert à décrire la forme d'un objet.
// Ici, ArticleDTO représente un article reçu depuis l'API backend.
//
// DTO signifie Data Transfer Object.
// C'est un objet utilisé pour transférer des données entre le backend et le frontend.
interface ArticleDTO {
  article_id: number;          
  nom: string;                 
  prix: number | string;       
  description: string;         
}

// Cette interface représente les données envoyées au backend
// quand l'utilisateur valide une commande.
//


interface CommandeDTO {
  date_commande: string;       
  prix_total: number;         
  etat: 'en cours';            
}


// -----------------------------------------------------------------------------
// VARIABLES GLOBALES DU FRONTEND
// -----------------------------------------------------------------------------

// URL de base de ton API PHP.
// Ensuite on ajoute "articles" ou "commande" à la fin.
const API_BASE_URL = 'http://localhost/aymen_EatSmart_backend/index.php?page=';

// Tableau qui contiendra tous les articles reçus depuis l'API.
let articles: ArticleDTO[] = [];

// Tableau qui représente le panier de l'utilisateur.
// Chaque fois que l'utilisateur clique sur "Ajouter", on ajoute un article ici.
let panier: ArticleDTO[] = [];

// Message affiché après validation de commande.
// Exemple : "Commande validée avec succès."
let messageCommande = '';

// Cette variable permet de savoir si une commande est déjà en cours d'envoi.
// Elle évite que l'utilisateur clique plusieurs fois sur "Valider la commande".
let commandeEnCours = false;


// -----------------------------------------------------------------------------
// RÉCUPÉRATION DES ARTICLES DEPUIS L'API
// -----------------------------------------------------------------------------

// Cette fonction appelle le backend pour récupérer les articles.
// Elle fait une requête GET vers :
// http://localhost/aymen_EatSmart_backend/index.php?page=articles
async function fetchArticles(): Promise<ArticleDTO[]> {
  const response = await fetch(`${API_BASE_URL}articles`);

  // Si le backend répond avec une erreur HTTP, exemple 404 ou 500,
  // on déclenche une erreur côté frontend.
  if (!response.ok) {
    throw new Error(`Erreur API articles : ${response.status}`);
  }

  // Si tout va bien, on convertit la réponse JSON en tableau d'articles.
  return await response.json();
}


// -----------------------------------------------------------------------------
// ENVOI DE LA COMMANDE AU BACKEND
// -----------------------------------------------------------------------------

// Cette fonction envoie la commande au backend.
// Elle fait une requête POST vers :
// http://localhost/aymen_EatSmart_backend/index.php?page=commande
async function envoyerCommande(commande: CommandeDTO): Promise<any> {
  const response = await fetch(`${API_BASE_URL}commande`, {
    method: 'POST',

    // On dit au backend qu'on envoie des données au format JSON.
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },

    // On transforme l'objet TypeScript en texte JSON.
    // Exemple envoyé :
    // {
    //   "date_commande": "2026-06-04 17:03:25",
    //   "prix_total": 7.9,
    //   "etat": "en cours"
    // }
    body: JSON.stringify(commande),
  });

  // On récupère la réponse du backend sous forme de texte.
  // Pourquoi pas directement response.json() ?
  // Parce que si le backend renvoie une erreur ou une réponse vide,
  // response.json() peut planter.
  const texte = await response.text();

  // Si la réponse HTTP n'est pas correcte, exemple 500,
  // on affiche la réponse exacte du backend dans la console.
  if (!response.ok) {
    console.error("Réponse backend :", texte);
    throw new Error(`Erreur API commande : ${response.status}`);
  }

  // Si le backend a renvoyé du texte JSON, on le transforme en objet JS.
  // Sinon, on retourne null.
  return texte ? JSON.parse(texte) : null;
}


// -----------------------------------------------------------------------------
// CRÉATION DE LA DATE AU FORMAT MYSQL
// -----------------------------------------------------------------------------

// Cette fonction crée une date compatible avec MySQL.
// MySQL attend souvent ce format :
// YYYY-MM-DD HH:MM:SS
//
// Exemple :
// 2026-06-04 17:03:25
function creerDateMySQL(): string {
  const maintenant = new Date();

  // toISOString() donne un format comme :
  // 2026-06-04T17:03:25.000Z
  //
  // slice(0, 19) garde seulement :
  // 2026-06-04T17:03:25
  //
  // replace('T', ' ') remplace le T par un espace :
  // 2026-06-04 17:03:25
  return maintenant.toISOString().slice(0, 19).replace('T', ' ');
}


// -----------------------------------------------------------------------------
// CALCUL DU TOTAL DU PANIER
// -----------------------------------------------------------------------------

// Cette fonction additionne le prix de tous les articles dans le panier.
function calculerTotalPanier(): number {
  return panier.reduce((total, article) => total + Number(article.prix), 0);
}


// -----------------------------------------------------------------------------
// CRÉATION DU PAYLOAD DE COMMANDE
// -----------------------------------------------------------------------------

// Cette fonction prépare l'objet qui sera envoyé au backend.
//
// On appelle cet objet le "payload".
// C'est le contenu envoyé dans le body de la requête POST.
function creerPayloadCommande(): CommandeDTO {
  return {
    // Date actuelle au format MySQL
    date_commande: creerDateMySQL(),

    // Total du panier arrondi à 2 chiffres après la virgule
    prix_total: Number(calculerTotalPanier().toFixed(2)),

    // État par défaut de la commande
    etat: 'en cours',
  };
}


// -----------------------------------------------------------------------------
// AFFICHAGE DES ARTICLES
// -----------------------------------------------------------------------------

// Cette fonction transforme le tableau "articles" en HTML.
// Elle retourne une grande chaîne de caractères contenant toutes les cartes.
function afficherArticles(): string {
  return articles
    .map(
      (article) => `
        <article class="card">

          <!-- Si le prix est inférieur à 10 €, on affiche un badge "Bon Plan" -->
          ${Number(article.prix) < 10 ? '<span class="badge">Bon Plan</span>' : ''}
             ${Number(article.prix) > 13 ? '<span class="badge"> CHER </span>' : ''}

          <!-- Nom de l'article -->
          <h3>${article.nom}</h3>

          <!-- Description de l'article -->
          <p>${article.description}</p>

          <!-- Prix formaté avec deux chiffres après la virgule -->
          <p class="price">${Number(article.prix).toFixed(2)} €</p>

          <!-- Identifiant de l'article -->
          <p class="article-id">ID : ${article.article_id}</p>

          <!-- Bouton pour ajouter l'article au panier -->
          <button class="btn-order" type="button">Ajouter</button>
        </article>
      `,
    )

    // join('') permet de coller tous les morceaux HTML ensemble
    // sans virgule entre les éléments.
    .join('');
}


// -----------------------------------------------------------------------------
// AFFICHAGE DU PANIER
// -----------------------------------------------------------------------------

// Cette fonction transforme le tableau "panier" en HTML.
function afficherPanier(): string {
  // Si le panier est vide, on affiche un simple message.
  if (panier.length === 0) {
    return '<p>Votre panier est vide</p>';
  }

  // Sinon, on affiche chaque article du panier.
  return panier
    .map(
      (article, index) => `
        <div class="cart-item">

          <!-- Nom de l'article dans le panier -->
          <span>${article.nom}</span>

          <!-- Prix de l'article -->
          <strong>${Number(article.prix).toFixed(2)} €</strong>

          <!-- Bouton pour retirer l'article du panier -->
          <!-- data-index permet de savoir quel article supprimer -->
          <button 
            class="btn-remove" 
            data-index="${index}" 
            type="button" 
            title="Retirer du panier"
          >
            ×
          </button>
        </div>
      `,
    )
    .join('');
}


// -----------------------------------------------------------------------------
// FONCTION PRINCIPALE D'AFFICHAGE
// -----------------------------------------------------------------------------

// render() reconstruit toute l'interface HTML.
// Chaque fois qu'on ajoute, retire ou valide une commande,
// on rappelle render() pour mettre la page à jour.
function render(): void {
  // On récupère la div principale dans index.html.
  const appDiv = document.querySelector<HTMLDivElement>('#app');

  // Si la div #app n'existe pas, on arrête la fonction.
  if (!appDiv) {
    return;
  }

  // On vérifie si le panier est vide.
  const panierVide = panier.length === 0;

  // On calcule le total du panier avec deux chiffres après la virgule.
  const total = calculerTotalPanier().toFixed(2);

  // On injecte tout le HTML dans la div #app.
  appDiv.innerHTML = `
    <header class="app-header">
      <h1>EatSmart - Carte du restaurant</h1>
      <p>Choisissez vos plats, vérifiez le total puis validez la commande.</p>
    </header>

    <div class="content-wrapper">

      <!-- Partie gauche : affichage des articles -->
      <main class="menu-container">
        ${afficherArticles()}
      </main>

      <!-- Partie droite : panier -->
      <aside class="cart-container">
        <h2>Votre Panier</h2>

        <div id="cart-items">
          ${afficherPanier()}
        </div>

        <hr>

        <div class="cart-total">
          <strong>Total : <span id="total-prix">${total}</span> €</strong>
        </div>

        <!-- 
          Le bouton est désactivé si :
          - le panier est vide
          - une commande est déjà en cours d'envoi
        -->
        <button 
          class="btn-checkout" 
          type="button" 
          ${panierVide || commandeEnCours ? 'disabled' : ''}
        >
          ${commandeEnCours ? 'Envoi en cours...' : 'Valider la commande'}
        </button>

        <!-- Si messageCommande contient un message, on l'affiche -->
        ${messageCommande ? `<p class="order-message">${messageCommande}</p>` : ''}
      </aside>
    </div>
  `;

  // Très important :
  // Comme on vient de recréer le HTML avec innerHTML,
  // les anciens événements ont disparu.
  // Il faut donc rebrancher les clics sur les boutons.
  brancherEvenementsPanier();
  brancherEvenementValidationCommande();
}


// -----------------------------------------------------------------------------
// GESTION DES BOUTONS DU PANIER
// -----------------------------------------------------------------------------

// Cette fonction ajoute les événements click sur :
// - les boutons "Ajouter"
// - les boutons "Retirer"
function brancherEvenementsPanier(): void {
  // On récupère tous les boutons "Ajouter".
  const boutonsAjouter = document.querySelectorAll<HTMLButtonElement>('.btn-order');

  // On récupère tous les boutons "Retirer".
  const boutonsRetirer = document.querySelectorAll<HTMLButtonElement>('.btn-remove');

  // Pour chaque bouton "Ajouter", on ajoute un événement click.
  boutonsAjouter.forEach((bouton, index) => {
    bouton.addEventListener('click', () => {
      // L'index du bouton correspond à l'index de l'article dans le tableau articles.
      const articleChoisi = articles[index];

      // Sécurité : si l'article n'existe pas, on arrête.
      if (!articleChoisi) {
        return;
      }

      // On ajoute l'article choisi dans le panier.
      panier.push(articleChoisi);

      // On efface l'ancien message de commande.
      messageCommande = '';

      // Logs utiles pour le debug dans la console.
      console.log(`Bouton n°${index} cliqué`);
      console.log('Plat ajouté :', articleChoisi.nom);
      console.log('État du panier :', panier);

      // On met l'interface à jour.
      render();
    });
  });

  // Pour chaque bouton "Retirer", on ajoute un événement click.
  boutonsRetirer.forEach((bouton) => {
    bouton.addEventListener('click', () => {
      // On récupère l'index stocké dans data-index.
      const indexTexte = bouton.dataset.index;

      // Si aucun index n'est trouvé, on arrête.
      if (indexTexte === undefined) {
        return;
      }

      // On supprime l'article du panier à l'index correspondant.
      panier.splice(Number(indexTexte), 1);

      // On efface l'ancien message de commande.
      messageCommande = '';

      console.log('État du panier après suppression :', panier);

      // On met l'interface à jour.
      render();
    });
  });
}


// -----------------------------------------------------------------------------
// GESTION DU BOUTON "VALIDER LA COMMANDE"
// -----------------------------------------------------------------------------

// Cette fonction branche le clic sur le bouton de validation.
function brancherEvenementValidationCommande(): void {
  // On récupère le bouton "Valider la commande".
  const boutonValider = document.querySelector<HTMLButtonElement>('.btn-checkout');

  // Si le bouton n'existe pas, on arrête.
  if (!boutonValider) {
    return;
  }

  // On ajoute un événement click au bouton.
  boutonValider.addEventListener('click', async () => {
    console.log('Bouton Valider commande cliqué');

    // Si le panier est vide ou si une commande est déjà en cours,
    // on ne fait rien.
    if (panier.length === 0 || commandeEnCours) {
      return;
    }

    // On crée l'objet commande à envoyer au backend.
    const nouvelleCommande = creerPayloadCommande();

    console.log('Payload commande :', nouvelleCommande);

    // On indique qu'une commande est en cours d'envoi.
    commandeEnCours = true;

    // On vide le message précédent.
    messageCommande = '';

    // On met à jour l'affichage.
    // Le bouton va afficher "Envoi en cours..." et être désactivé.
    render();

    try {
      // On envoie la commande au backend.
      const resultat = await envoyerCommande(nouvelleCommande);

      console.log('Commande enregistrée avec succès :', resultat);

      // Si la commande est bien enregistrée, on vide le panier.
      panier = [];

      // On prépare le message de succès.
      messageCommande = 'Commande validée avec succès.';

    } catch (error) {
      // Si une erreur arrive pendant l'envoi,
      // on l'affiche dans la console.
      console.error(error);

      // Message affiché à l'utilisateur.
      messageCommande = 'Erreur : la commande n a pas pu être envoyée.';

    } finally {
      // Qu'il y ait succès ou erreur,
      // on remet commandeEnCours à false.
      commandeEnCours = false;

      // On met une dernière fois l'interface à jour.
      render();
    }
  });
}


// -----------------------------------------------------------------------------
// INITIALISATION DE L'APPLICATION
// -----------------------------------------------------------------------------

// init() est la première fonction appelée au lancement de l'application.
async function init(): Promise<void> {
  // On récupère la div #app.
  const appDiv = document.querySelector<HTMLDivElement>('#app');

  // Si la div n'existe pas, on arrête.
  if (!appDiv) {
    return;
  }

  // Message temporaire pendant le chargement des articles.
  appDiv.innerHTML = '<p class="loading">Chargement du menu...</p>';

  try {
    // On récupère les articles depuis l'API backend.
    articles = await fetchArticles();

    console.log('Articles reçus depuis l API :', articles);

    // Une fois les articles reçus, on affiche la page complète.
    render();

  } catch (error) {
    // Si les articles ne peuvent pas être chargés,
    // on affiche l'erreur dans la console.
    console.error(error);

    // Et on affiche un message visible dans la page.
    appDiv.innerHTML = '<p class="error">Impossible de charger les articles depuis l API.</p>';
  }
}


// -----------------------------------------------------------------------------
// LANCEMENT DE L'APPLICATION
// -----------------------------------------------------------------------------

// On lance l'application.
init();