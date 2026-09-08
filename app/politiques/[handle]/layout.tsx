export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    /* Une colonne étroite : ces pages sont du texte long, et une ligne de
       plus de quatre-vingts caractères se lit mal. Le décalage haut vient
       du système, la barre étant fixe. */
    <div className="below-header mx-auto max-w-3xl px-5 pb-24 md:px-10 md:pb-32">
      {children}
    </div>
  );
}
