"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Car, BookOpen, Calendar, LogOut } from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [nombreAdmin, setNombreAdmin] = useState("Administrador");

  useEffect(() => {
    const usuarioStr = localStorage.getItem("usuario");
    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr);
      setNombreAdmin(usuario.nombre);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    router.push("/login");
  };

  const metricas = [
    { titulo: "Usuarios Activos", valor: "124", icono: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { titulo: "Clases Hoy", valor: "18", icono: Calendar, color: "text-indigo-600", bg: "bg-indigo-100" },
    { titulo: "Cursos Activos", valor: "5", icono: BookOpen, color: "text-emerald-600", bg: "bg-emerald-100" },
    { titulo: "Autos Disponibles", valor: "12", icono: Car, color: "text-amber-600", bg: "bg-amber-100" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header del Dashboard */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Bienvenido, {nombreAdmin}
          </h2>
          <p className="text-slate-500 mt-1 text-sm">
            Este es el resumen general de la autoescuela ClassCar.
          </p>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center py-2 px-4 rounded-lg text-red-600 hover:bg-red-50 font-medium text-sm transition-colors border border-red-100 hover:border-red-200"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar Sesión
        </button>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {metricas.map((metrica, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
            <div className={`${metrica.bg} ${metrica.color} p-4 rounded-xl mr-4`}>
              <metrica.icono className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{metrica.titulo}</p>
              <h3 className="text-2xl font-bold text-slate-900">{metrica.valor}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Área Principal (Placeholder para futuros gráficos/tablas) */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[300px] text-center border-dashed">
        <div className="bg-slate-50 p-4 rounded-full mb-4">
          <Calendar className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">
          Actividad Reciente
        </h3>
        <p className="text-slate-500 max-w-md text-sm">
          Usa el menú lateral para gestionar los usuarios, cursos, automóviles y agendar nuevas clases para los alumnos.
        </p>
      </div>

    </div>
  );
}