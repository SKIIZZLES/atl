import clsx from "clsx";

export default function LogoIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`${process.env.SITE_NAME} logo`}
      viewBox="0 0 32 28"
      {...props}
      /* Le gabarit d'origine remplissait ce signe en sombre, et ne le passait
         en clair que sous la variante `dark:` — c'est-à-dire seulement si le
         système du visiteur est lui-même en mode sombre. Onde Noire est noir
         en permanence, quelle que soit la préférence de la machine : le signe
         doit donc suivre la couleur du texte qui l'entoure, sans condition.
         Il était invisible pour tout visiteur en mode clair. */
      className={clsx("h-4 w-4 fill-current", props.className)}
    >
      <path d="M21.5758 9.75769L16 0L0 28H11.6255L21.5758 9.75769Z" />
      <path d="M26.2381 17.9167L20.7382 28H32L26.2381 17.9167Z" />
    </svg>
  );
}
