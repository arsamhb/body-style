export default function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-dvh items-center justify-center bg-gradient-subtle p-4">
      <div aria-hidden className="absolute inset-0 -z-10 bg-pattern-dots mask-fade-edges" />
      {children}
    </main>
  );
}
