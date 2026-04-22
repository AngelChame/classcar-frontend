"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Car, User, CheckCircle2, AlertCircle, LogOut } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface ClaseAlumno {
  id: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  instructor: string;
  vehiculo: string;
  estado: string;
}

export default function AlumnoDashboard() {
  const router = useRouter();
  const [clases, setClases] = useState<ClaseAlumno[]>([]);
  const [nombreAlumno, setNombreAlumno] = useState("Alumno");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const usuarioStr = localStorage.getItem("usuario");
    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr);
      setNombreAlumno(usuario.nombre);
    }
    fetchMisClases();
  }, []);

  const fetchMisClases = async () => {
    try {
      const response = await apiFetch('/clases/mis-clases');
      const array = response?.data || response;

      if (!Array.isArray(array)) return;

      const adaptadas: ClaseAlumno[] = array.map((c: any) => {
        const instructorUsuario = c.instructor?.usuario || c.instructor;
        const instructorNombre = instructorUsuario
          ? `${instructorUsuario.nombre || ''} ${instructorUsuario.apellidoPaterno || ''}`.trim()
          : 'Sin instructor';

        const autoInfo = c.automovil
          ? `${c.automovil.modelo} (${c.automovil.placa})`
          : 'Sin asignar';

        const fecha = c.fecha
          ? new Date(c.fecha).toISOString().split('T')[0]
          : 'Sin fecha';

        const formatHora = (horaRaw: string) => {
          if (!horaRaw) return 'N/A';
          const partes = horaRaw.includes('T') ? horaRaw.split('T')[1] : horaRaw;
          const [hh, mm] = partes.substring(0, 5).split(':').map(Number);
          const periodo = hh >= 12 ? 'PM' : 'AM';
          const hora12 = hh % 12 === 0 ? 12 : hh % 12;
          return `${hora12.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')} ${periodo}`;
        };

        return {
          id: c.id,
          fecha,
          horaInicio: formatHora(c.horaInicio),
          horaFin: formatHora(c.horaFin),
          instructor: instructorNombre,
          vehiculo: autoInfo,
          estado: c.estado?.toLowerCase() || 'programada'
        };
      });

      setClases(adaptadas);
    } catch (error) {
      console.error("Error al cargar clases:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    router.push("/login");
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "programada":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-1.5"></span>
            Programada
          </span>
        );
      case "completada":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-1.5"></span>
            Completada
          </span>
        );
      case "cancelada":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-1.5"></span>
            Cancelada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {estado}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">¡Hola, {nombreAlumno}!</h1>
            <p className="text-slate-500 mt-1">Bienvenido a tu panel de control de ClassCar.</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <div className="flex items-center bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium text-sm">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Curso Activo
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4 px-1">Mis Próximas Clases</h2>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500">Cargando clases...</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {clases.map((clase) => (
                  <div key={clase.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      
                      <div className="flex items-start md:items-center gap-4">
                        <div className="bg-slate-100 p-3 rounded-xl hidden md:block">
                          <Calendar className="w-6 h-6 text-slate-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-slate-900">{clase.fecha}</span>
                            {getEstadoBadge(clase.estado)}
                          </div>
                          <div className="flex items-center text-slate-500 text-sm gap-3">
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1.5" />
                              {clase.horaInicio} - {clase.horaFin}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 md:gap-8 bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-lg">
                        <div className="flex items-center text-sm">
                          <User className="w-4 h-4 text-slate-400 mr-2" />
                          <div>
                            <p className="text-xs text-slate-500">Instructor</p>
                            <p className="font-medium text-slate-900">{clase.instructor}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-sm">
                          <Car className="w-4 h-4 text-slate-400 mr-2" />
                          <div>
                            <p className="text-xs text-slate-500">Vehículo</p>
                            <p className="font-medium text-slate-900">{clase.vehiculo}</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}

                {clases.length === 0 && (
                  <div className="p-8 text-center flex flex-col items-center justify-center text-slate-500">
                    <AlertCircle className="w-8 h-8 mb-3 text-slate-300" />
                    <p>No tienes clases programadas en este momento.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}