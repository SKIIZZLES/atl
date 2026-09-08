export function NewsletterForm({ domain }: { domain: string }) {
  return (
    <form
      action={`https://${domain}/contact#newsletter`}
      method="post"
      className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:gap-0"
    >
      <input type="hidden" name="form_type" value="customer" />
      <input type="hidden" name="utf8" value="✓" />
      <input type="hidden" name="contact[tags]" value="newsletter" />
      <label htmlFor="newsletter-email" className="sr-only">
        Adresse email
      </label>
      <input
        id="newsletter-email"
        type="email"
        name="contact[email]"
        required
        placeholder="votre@email.com"
        className="type-label w-full border border-brun-foreground/40 bg-transparent px-4 py-3 text-brun-foreground placeholder:text-brun-foreground/50 focus-visible:ring-offset-brun"
      />
      <button
        type="submit"
        className="type-button shrink-0 bg-signal px-6 py-3 text-background transition-colors duration-500 ease-onde hover:bg-brass"
      >
        Rejoindre →
      </button>
    </form>
  );
}
