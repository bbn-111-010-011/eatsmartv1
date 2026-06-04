# EatSmart - progression V2 / V3 / V4

Ce projet suit les TP fournis :

- `src/main.etape1-v2.ts` : appel API `GET /articles` + affichage automatique des cartes.
- `src/main.etape2-v3.ts` : boutons `Ajouter`, événements `click`, panier dynamique et total.
- `src/main.etape3-v4.ts` : bouton `Valider la commande`, création du payload JSON et envoi en `POST /commande`.
- `src/main.ts` : version active finale, identique à l'étape 3.
- `src/main_avant_correction.txt` : ancienne version cassée conservée pour comparer.

## Changer d'étape active

Pour tester une étape précise, copier son contenu dans `src/main.ts`.

Exemple pour tester V2 :

```bash
cp src/main.etape1-v2.ts src/main.ts
npm run dev
```

Exemple pour tester V3 :

```bash
cp src/main.etape2-v3.ts src/main.ts
npm run dev
```

Exemple pour revenir à V4 :

```bash
cp src/main.etape3-v4.ts src/main.ts
npm run dev
```

## API utilisée

Dans le code, la base API est :

```ts
const API_BASE_URL = 'http://localhost/aymen_EatSmart_backend';
```

Endpoints utilisés :

- Articles : `GET http://localhost/aymen_EatSmart_backend/index.php?page=articles`
- Commande : `POST http://localhost/aymen_EatSmart_backend/index.php?page=commande`

Si ton API utilise `commandes` au pluriel au lieu de `commande`, change uniquement cette ligne dans `envoyerCommande()` :

```ts
const response = await fetch(`${API_BASE_URL}/commande`, {
```

par :

```ts
const response = await fetch(`${API_BASE_URL}/commandes`, {
```
