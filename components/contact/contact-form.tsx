/**
 * Formulaire de contact maison.
 *
 * La page Shopify `/pages/contact` existait mais son corps était vide : le
 * catch-all `app/[page]` n'affichait donc qu'un titre et une date. On poste
 * ici vers le endpoint contact de la boutique (même canal que la newsletter),
 * pour que les messages arrivent dans l'admin sans service tiers.
 *
 * Soumission native (pas de fetch) : Shopify n'accepte pas le CORS depuis le
 * domaine headless ; le navigateur suit la réponse Shopify après l'envoi.
 */
export function ContactForm({ domain }: { domain: string }) {
  const shop = domain.replace(/^https?:\/\//, "");

  return (
    <form
      action={`https://${shop}/contact`}
      method="post"
      acceptCharset="UTF-8"
      className="flex flex-col gap-5"
    >
      <input type="hidden" name="form_type" value="contact" />
      <input type="hidden" name="utf8" value="✓" />

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2" htmlFor="contact-name">
          <span className="type-label text-muted-foreground">Nom</span>
          <input
            id="contact-name"
            name="contact[name]"
            type="text"
            required
            autoComplete="name"
            className={INPUT}
          />
        </label>
        <label className="flex flex-col gap-2" htmlFor="contact-email">
          <span className="type-label text-muted-foreground">Email</span>
          <input
            id="contact-email"
            name="contact[email]"
            type="email"
            required
            autoComplete="email"
            className={INPUT}
          />
        </label>
      </div>

      <label className="flex flex-col gap-2" htmlFor="contact-subject">
        <span className="type-label text-muted-foreground">Sujet</span>
        <input
          id="contact-subject"
          name="contact[subject]"
          type="text"
          className={INPUT}
          placeholder="Commande, presse, collaboration…"
        />
      </label>

      <label className="flex flex-col gap-2" htmlFor="contact-body">
        <span className="type-label text-muted-foreground">Message</span>
        <textarea
          id="contact-body"
          name="contact[body]"
          required
          rows={7}
          className={INPUT}
        />
      </label>

      <button
        type="submit"
        className="type-button h-[52px] bg-foreground px-7 text-background transition-opacity duration-500 ease-onde hover:opacity-90 md:h-14 md:self-start"
      >
        Envoyer
      </button>
    </form>
  );
}

const INPUT =
  "type-body w-full border border-border bg-transparent px-4 py-3 text-foreground placeholder:text-muted-foreground focus-visible:border-foreground focus-visible:outline-none";
