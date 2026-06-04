# Différences de code par étape

## Étape 1 - V2 : liaison avec l'API

Objectif : remplacer les données écrites en dur par les données venant de l'API.

Ajouts principaux :

- `interface ArticleDTO`
- `fetchArticles()` avec `fetch(API_BASE_URL + '/articles')`
- `afficherMenu(articles)` pour générer les cartes automatiquement
- `init()` en `async` avec `await fetchArticles()`

## Étape 2 - V3 : événements + panier

Objectif : permettre à l'utilisateur d'ajouter des plats dans un panier visible à droite.

Ajouts principaux par rapport à V2 :

- `let panier: ArticleDTO[] = []`
- bouton `<button class="btn-order">Ajouter</button>` dans chaque carte
- `querySelectorAll('.btn-order')`
- `addEventListener('click', ...)`
- `panier.push(articleChoisi)`
- `afficherPanier()`
- `calculerTotalPanier()` avec `.reduce()`
- mise en page `.content-wrapper` + `.cart-container`

## Étape 3 - V4 : validation de commande

Objectif : créer une commande et l'envoyer à l'API en POST.

Ajouts principaux par rapport à V3 :

- `interface CommandeDTO`
- `creerDateMySQL()` pour obtenir une date au format `YYYY-MM-DD HH:MM:SS`
- `creerPayloadCommande()` pour créer l'objet JSON de commande
- bouton `<button class="btn-checkout">Valider la commande</button>`
- `envoyerCommande()` avec `fetch(..., { method: 'POST', headers, body })`
- message de succès / erreur après envoi
- désactivation du bouton si le panier est vide ou si la commande est déjà en cours d'envoi

## Fichier actif

Le fichier actif est :

```text
src/main.ts
```

Il correspond actuellement à la version finale V4.
