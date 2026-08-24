# Onde Noire — site headless (Next.js + Shopify)

Front-end Next.js (App Router) hébergé sur Vercel, qui consomme le catalogue
Shopify d'Onde Noire via la **Storefront API**. Shopify reste le back-office
(produits, stock, commandes, paiement) ; ce dépôt ne gère que le rendu et
l'expérience d'achat, le checkout redirigeant vers Shopify.

## Pourquoi ce projet

Le thème Shopify historique de la boutique laissait parfois une image ne
correspondant pas à la couleur sélectionnée lors d'un changement de variante.
Les données produits (`variant.image`, et le texte alternatif
`couleur:<valeur> | ...` sur chaque photo) sont correctes côté Shopify — voir
`lib/shopify/utils.ts` (`imagesForColor`) : la galerie affichée est toujours
recalculée à partir de la couleur réellement sélectionnée, jamais d'un état
résiduel.

## Démarrer en local

```bash
npm install
cp .env.example .env.local   # puis renseigner SHOPIFY_STOREFRONT_ACCESS_TOKEN
npm run dev
```

Sans `SHOPIFY_STOREFRONT_ACCESS_TOKEN`, le site se dégrade proprement : la
page d'accueil s'affiche avec un message d'instructions, les pages
collection/produit renvoient un 404 plutôt que de planter.

## Obtenir le token Storefront API

1. Admin Shopify → *Apps et canaux de vente* → *Développer des applications*.
2. Créer une app (ou utiliser une app existante), onglet **Configuration**.
3. Activer les scopes **Storefront API** nécessaires en lecture : produits,
   collections, panier (`unauthenticated_read_product_listings`,
   `unauthenticated_read_product_inventory`,
   `unauthenticated_write_checkouts`, etc. — cocher au minimum lecture
   produits/collections et écriture panier).
4. Installer l'app, puis révéler le **Storefront API access token**.
5. Renseigner ce token dans `.env.local` (local) et dans les variables
   d'environnement du projet Vercel (production/preview).

## Structure

- `lib/shopify/` — client GraphQL, requêtes/mutations, types, utilitaires
  (dont la logique couleur → image).
- `app/products/[handle]/page.tsx` + `components/product/product-details.tsx`
  — fiche produit : sélection de variante pilotée par l'URL
  (`?Couleur=...&Taille=...`), ce qui rend la sélection partageable et
  compatible avec le bouton précédent/suivant du navigateur.
- `app/cart/actions.ts` — Server Actions pour créer/mettre à jour le panier
  Shopify (cookie `onde_noire_cart_id`), le checkout final se fait sur
  Shopify (`cart.checkoutUrl`).
- `components/cart/` — contexte panier + tiroir latéral.

## Déploiement

Le projet est destiné à être déployé sur Vercel avec le domaine
`ondenoire.com` pointé dessus une fois validé. Variables d'environnement à
configurer sur le projet Vercel : voir `.env.example`.
