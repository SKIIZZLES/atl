# Onde Noire — Storefront

Site headless Onde Noire basé sur le template officiel **[Next.js Commerce](https://github.com/vercel/commerce)** de Vercel, connecté à la boutique Shopify via la Storefront API. Le checkout reste géré par Shopify (redirection depuis le panier).

Hébergé sur Vercel, domaine `ondenoire.com`.

## Variables d'environnement

Voir `.env.example`. À définir dans Vercel → Settings → Environment Variables (scope Production **et** Preview) :

- `SHOPIFY_STORE_DOMAIN` — domaine `*.myshopify.com` du store
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN` — token **public** de la Storefront API (créé via le canal de vente "Headless" dans l'admin Shopify)
- `SITE_NAME` / `COMPANY_NAME` — "Onde Noire"
- `SHOPIFY_REVALIDATION_SECRET` — optionnel, pour la revalidation on-demand via webhook Shopify

## Menus de navigation (optionnel)

Le header et le footer lisent des menus Shopify par handle :

- `next-js-frontend-header-menu`
- `next-js-frontend-footer-menu`

À créer dans Shopify Admin → Contenu → Menus (avec exactement ces handles) pour afficher des liens de navigation personnalisés. En leur absence, le site fonctionne normalement avec une nav vide.

## Développement local

```bash
npm install
npm run dev
```

Un `.npmrc` avec `legacy-peer-deps=true` est présent car le template utilise une version canary de Next.js (requise pour les APIs `use cache` / `ppr` employées dans `lib/shopify/index.ts`), ce qui provoque un conflit de peer-deps strict avec `npm install` sans ce réglage.

## Déploiement

Déploiement automatique sur push vers `main` via l'intégration Git Vercel (projet `onde-noire`).
