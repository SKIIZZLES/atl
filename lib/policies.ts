import type { PolicySlug } from "lib/shopify/types";

/**
 * The four Shopify shop policies, addressed by French slug. Shopify returns
 * each policy's own title, but that title is whatever the merchant typed (and
 * on an untouched store it is Shopify's English default), so the storefront
 * labels them itself.
 */
export const POLICY_LABELS: Record<PolicySlug, string> = {
  "mentions-legales": "Mentions légales",
  "conditions-generales": "Conditions générales de vente",
  livraison: "Livraison",
  remboursement: "Retours & remboursements",
  confidentialite: "Politique de confidentialité",
};

const POLICY_SLUGS = Object.keys(POLICY_LABELS) as PolicySlug[];

export function isPolicySlug(value: string): value is PolicySlug {
  return (POLICY_SLUGS as string[]).includes(value);
}
