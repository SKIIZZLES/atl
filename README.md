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
- `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` — identifiant du pixel Meta (voir ci-dessous).
  Facultatif : non défini, le pixel ne charge pas et le reste du site est
  inchangé

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

**L'ordre compte.** La variable doit être posée dans Vercel _et un nouveau
déploiement construit_ avant que les webhooks ne soient créés : une variable
ajoutée après coup n'atteint pas un déploiement déjà construit. Des webhooks
créés trop tôt reçoivent des 401, et Shopify finit par supprimer
l'abonnement.

Limite connue : le secret voyage dans l'URL, et la signature HMAC que Shopify
envoie dans `x-shopify-hmac-sha256` n'est pas vérifiée. C'est l'implémentation
du gabarit d'origine. L'enjeu reste faible — au pire un rafraîchissement de
cache forcé — mais passer à la vérification HMAC serait plus propre.

## Mesure d'audience et consentement

Trois outils, et ils n'ont pas le même statut :

| Outil               | Cookies | Soumis au consentement                |
| ------------------- | ------- | ------------------------------------- |
| `@vercel/analytics` | aucun   | non                                   |
| Google Analytics 4  | oui     | oui, par le mode consentement         |
| Pixel Meta          | oui     | oui, le script n'est pas chargé avant |

Le bandeau (`components/analytics/consentement.tsx`) porte la décision, la
range dans `localStorage` sous `onde-noire.consentement.v1`, et la fait
expirer au bout de 182 jours. Elle se modifie depuis la politique de
confidentialité, en bas de page.

**Rien ne se déclenche avant la réponse.** Pour le pixel Meta, cela veut dire
que `connect.facebook.net` n'est même pas contacté : pas de script en
réserve, pas d'événement mis de côté. Pour GA4, dont le tag doit rester dans
le `<head>` — c'est par lui qu'est validée la propriété Search Console —
c'est le `gtag('consent', 'default', …)` posé avant le `config` qui interdit
le dépôt de cookie, et `GoogleConsentement` qui le lève sur un « Accepter ».

### Le pixel Meta

`NEXT_PUBLIC_FACEBOOK_PIXEL_ID` se trouve dans le gestionnaire d'événements
Meta, ou dans les réglages du canal Facebook & Instagram de Shopify. Il est
public par nature — il voyage dans chaque requête que le navigateur envoie à
Meta — d'où le préfixe `NEXT_PUBLIC_`.

Quatre événements partent du site :

| Événement          | Déclencheur                                                  |
| ------------------ | ------------------------------------------------------------ |
| `PageView`         | changement de chemin (pas de changement de paramètres d'URL) |
| `ViewContent`      | affichage d'une fiche produit                                |
| `AddToCart`        | « Ajouter au panier »                                        |
| `InitiateCheckout` | « Payer maintenant » et « Passer au paiement »               |

**`Purchase` n'est pas dans cette liste, et ne peut pas y être.** Le paiement
se déroule sur le domaine de Shopify, où ce pixel n'existe plus. L'achat doit
donc être remonté par le canal Facebook & Instagram de Shopify, qui pose son
propre pixel sur le tunnel. Sans cela, Meta voit des paniers et jamais de
commandes — et l'optimisation sur l'achat reste hors d'atteinte.

Les `content_ids` envoyés sont le numéro nu de la variante Shopify
(`gid://shopify/ProductVariant/16149226357061` → `16149226357061`), qui est
ce qu'indexe le catalogue Meta alimenté par ce canal. **À vérifier une fois
les premiers événements arrivés** : le gestionnaire d'événements signale sous
« Diagnostics » les `content_ids` qui ne correspondent à aucun article du
catalogue. Tant qu'ils ne correspondent pas, les publicités catalogue
dynamiques ne peuvent pas partir — sans la moindre erreur pour le signaler.

Chaque événement porte un `eventID`. Il ne sert à rien aujourd'hui : il est
là pour le jour où l'API Conversions enverra les mêmes événements depuis le
serveur, et où Meta devra reconnaître qu'un achat vu deux fois n'est qu'un
seul achat.

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
