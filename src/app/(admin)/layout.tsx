import { Sidebar } from "@/Components/Admin/Sidebar";
import { Header } from "@/Components/Admin/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden text-slate-900 font-sans">
      {/* Sidebar fijo a la izquierda */}
      <Sidebar />

      {/* Columna derecha principal */}
      <div className="flex flex-col flex-1 relative overflow-hidden">
        {/* Header superior fijo */}
        <Header />

        {/* Área de contenido (main con scroll propio) */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 relative">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
