# Onde Noire — Storefront

Site headless Onde Noire basé sur le template officiel **[Next.js Commerce](https://github.com/vercel/commerce)** de Vercel, connecté à la boutique Shopify via la Storefront API. Le checkout reste géré par Shopify (redirection depuis le panier).

Hébergé sur Vercel, domaine `ondenoire.com`.

## Variables d'environnement

Voir `.env.example`. À définir dans Vercel → Settings → Environment Variables (scope Production **et** Preview) :

- `SHOPIFY_STORE_DOMAIN` — domaine `*.myshopify.com` du store
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN` — token **public** de la Storefront API (créé via le canal de vente "Headless" dans l'admin Shopify)
- `SITE_NAME` / `COMPANY_NAME` — "Onde Noire"
- `SHOPIFY_REVALIDATION_SECRET` — requis pour que les modifications faites dans
  l'admin Shopify atteignent le site (voir ci-dessous)

## Revalidation par webhook

Le catalogue est mis en cache avec `cacheLife("days")`. Sans webhook, **une
modification faite dans l'admin Shopify peut mettre jusqu'à 24 h à apparaître
sur le site**, ou attendre un redéploiement. C'est ce qui a rendu un produit
invisible pendant plusieurs jours alors qu'il était actif et en vente sur
Google Shopping.

`POST /api/revalidate` lève ce délai. La route lit deux choses :

- le paramètre `?secret=` de l'URL, comparé à `SHOPIFY_REVALIDATION_SECRET`,
- l'en-tête `x-shopify-topic`, qui dit quoi rafraîchir.

Six sujets sont pris en compte — `products/create`, `products/update`,
`products/delete`, et les trois équivalents pour `collections`. Tout autre
sujet reçoit un 200 sans rien invalider.

Les abonnements pointent sur :

```
https://www.ondenoire.com/api/revalidate?secret=<SHOPIFY_REVALIDATION_SECRET>
```

**L'ordre compte.** La variable doit être posée dans Vercel *et un nouveau
déploiement construit* avant que les webhooks ne soient créés : une variable
ajoutée après coup n'atteint pas un déploiement déjà construit. Des webhooks
créés trop tôt reçoivent des 401, et Shopify finit par supprimer
l'abonnement.

Limite connue : le secret voyage dans l'URL, et la signature HMAC que Shopify
envoie dans `x-shopify-hmac-sha256` n'est pas vérifiée. C'est l'implémentation
du gabarit d'origine. L'enjeu reste faible — au pire un rafraîchissement de
cache forcé — mais passer à la vérification HMAC serait plus propre.

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
