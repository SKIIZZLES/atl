export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-32 pb-24 md:px-10 md:pt-40 md:pb-32">
      {children}
    </div>
  );
}
