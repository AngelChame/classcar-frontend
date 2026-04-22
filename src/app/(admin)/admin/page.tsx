export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">
          Bienvenido al Dashboard
        </h2>
        <p className="text-slate-500 max-w-md">
          El Layout interactivo está funcionando. Usa el menú lateral para navegar por las diferentes secciones del panel de administración.
        </p>
      </div>
    </div>
  );
}
