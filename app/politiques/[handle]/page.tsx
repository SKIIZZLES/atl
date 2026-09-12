import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ChoixCookies } from "components/analytics/choix-cookies";
import Prose from "components/prose";
import { getShopPolicies } from "lib/shopify";
import { POLICY_LABELS, isPolicySlug } from "lib/policies";

export async function generateStaticParams() {
  const policies = await getShopPolicies();

  return Object.keys(policies).map((handle) => ({ handle }));
}

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await props.params;

  if (!isPolicySlug(handle)) return notFound();

  const policy = (await getShopPolicies())[handle];

  if (!policy) return notFound();

  return { title: POLICY_LABELS[handle], description: policy.title };
}

export default async function PolicyPage(props: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await props.params;

  if (!isPolicySlug(handle)) return notFound();

  const policy = (await getShopPolicies())[handle];

  if (!policy) return notFound();

  return (
    <>
      <p className="type-label text-muted-foreground">Informations légales</p>
      <h1 className="type-h1 mt-5">{POLICY_LABELS[handle]}</h1>
      <Prose className="mt-10" html={policy.body} />

      {/* Le réglage n'apparaît que sur cette page-ci. Il y a sa place — le
          bandeau y renvoie — et nulle part ailleurs : les conditions de
          vente ou la politique de retour n'ont rien à dire des cookies. */}
      {handle === "confidentialite" ? <ChoixCookies /> : null}
    </>
  );
}
