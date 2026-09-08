import Prose from "components/prose";
import { Accordion, type AccordionEntry } from "components/ui/accordion";
import { SectionLabel } from "components/ui/section-label";
import type { Product } from "lib/shopify/types";

/**
 * Les volets de la fiche : description, matières, livraison, retours.
 *
 * Ils vivaient dans la colonne de droite, sous le bouton d'achat. La
 * structure les veut sous le hero, en pleine largeur — et c'est plus juste :
 * une colonne de 40 % est faite pour décider, pas pour lire. Le texte y
 * gagne une mesure lisible au lieu d'une gouttière.
 *
 * « Matières » n'apparaît que si la marque l'a renseigné : Shopify ne
 * stocke pas de composition à part, et on n'en invente pas.
 */
export function ProductDetails({
  product,
  policies,
}: {
  product: Product;
  policies: { livraison?: string; retours?: string; matieres?: string };
}) {
  const entries: AccordionEntry[] = [];

  if (product.descriptionHtml) {
    entries.push({
      title: "Description",
      content: <Prose className="text-sm" html={product.descriptionHtml} />,
    });
  }
  if (policies.matieres) {
    entries.push({
      title: "Matières",
      content: <Prose className="text-sm" html={policies.matieres} />,
    });
  }
  if (policies.livraison) {
    entries.push({
      title: "Livraison",
      content: <Prose className="text-sm" html={policies.livraison} />,
    });
  }
  if (policies.retours) {
    entries.push({
      title: "Retours",
      content: <Prose className="text-sm" html={policies.retours} />,
    });
  }

  if (entries.length === 0) return null;

  return (
    <section className="bg-background">
      <div className="shell section-y">
        <SectionLabel rule>La pièce</SectionLabel>
        {/* Une mesure de lecture, pas la pleine largeur : au-delà d'environ
            quatre-vingts caractères, l'œil perd la ligne suivante. */}
        <div className="mt-10 max-w-3xl">
          <Accordion entries={entries} />
        </div>
      </div>
    </section>
  );
}
