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
        className="label-xs w-full border border-brun-foreground/40 bg-transparent px-4 py-3 text-brun-foreground placeholder:text-brun-foreground/50 focus-visible:ring-offset-brun"
      />
      <button
        type="submit"
        className="label-xs shrink-0 border border-brun-foreground bg-brun-foreground px-6 py-3 text-brun transition-colors duration-300 hover:bg-transparent hover:text-brun-foreground sm:border-l-0"
      >
        Join →
      </button>
    </form>
  );
}
