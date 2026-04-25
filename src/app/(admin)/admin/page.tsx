"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Car, BookOpen, Calendar, LogOut } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface Metricas {
  usuariosActivos: number;
  clasesHoy: number;
  cursosActivos: number;
  autosDisponibles: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [nombreAdmin, setNombreAdmin] = useState("Administrador");
  const [metricas, setMetricas] = useState<Metricas>({
    usuariosActivos: 0,
    clasesHoy: 0,
    cursosActivos: 0,
    autosDisponibles: 0,
  });

  useEffect(() => {
    const usuarioStr = localStorage.getItem("usuario");
    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr);
      setNombreAdmin(usuario.nombre);
    }
    fetchMetricas();
  }, []);

  const fetchMetricas = async () => {
    try {
      const [usuarios, cursos, autos, clases] = await Promise.all([
        apiFetch('/usuarios'),
        apiFetch('/cursos'),
        apiFetch('/automoviles'),
        apiFetch('/clases'),
      ]);

      const arrayUsuarios = usuarios?.data || [];
      const arrayCursos = cursos?.data || [];
      const arrayAutos = autos?.data || [];
      const arrayClases = clases?.data || [];

      const hoy = new Date().toISOString().split('T')[0];

      setMetricas({
        usuariosActivos: arrayUsuarios.filter((u: any) => u.activo).length,
        clasesHoy: arrayClases.filter((c: any) => {
          const fechaClase = new Date(c.fecha).toISOString().split('T')[0];
          return fechaClase === hoy && c.estado === 'programada';
        }).length,
        cursosActivos: arrayCursos.filter((c: any) => c.activo).length,
        autosDisponibles: arrayAutos.filter((a: any) => a.estado === 'disponible').length,
      });
    } catch (error) {
      console.error("Error al cargar métricas:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    router.push("/login");
  };

  const tarjetas = [
    { titulo: "Usuarios Activos", valor: metricas.usuariosActivos, icono: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { titulo: "Clases Hoy", valor: metricas.clasesHoy, icono: Calendar, color: "text-indigo-600", bg: "bg-indigo-100" },
    { titulo: "Cursos Activos", valor: metricas.cursosActivos, icono: BookOpen, color: "text-emerald-600", bg: "bg-emerald-100" },
    { titulo: "Autos Disponibles", valor: metricas.autosDisponibles, icono: Car, color: "text-amber-600", bg: "bg-amber-100" },
  ];

  return (
    <div className="space-y-6">

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {tarjetas.map((metrica, idx) => (
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