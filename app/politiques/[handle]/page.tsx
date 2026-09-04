import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
      <p className="label-xs text-muted-foreground">Informations légales</p>
      <h1 className="headline mt-4 text-4xl md:text-5xl">
        {POLICY_LABELS[handle]}
      </h1>
      <Prose className="mt-10" html={policy.body} />
    </>
  );
}
