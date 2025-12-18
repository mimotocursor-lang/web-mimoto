export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Aquí deberías proteger la ruta verificando el rol admin
  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Panel de administración</h1>
      {children}
    </section>
  );
}






