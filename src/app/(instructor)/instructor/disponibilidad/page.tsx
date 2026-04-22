"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Plus, Trash2, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface SlotDisponibilidad {
  id: number;
  dia: string;
  inicio: string;
  fin: string;
}

export default function DisponibilidadPage() {
  const router = useRouter();
  const [disponibilidad, setDisponibilidad] = useState<SlotDisponibilidad[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [nuevoDia, setNuevoDia] = useState("lunes");
  const [nuevaHoraInicio, setNuevaHoraInicio] = useState("08:00");
  const [nuevaHoraFin, setNuevaHoraFin] = useState("14:00");

  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const diasSemana = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

  useEffect(() => {
    fetchDisponibilidad();
  }, []);

  const fetchDisponibilidad = async () => {
    try {
      const response = await apiFetch('/instructores/disponibilidad');
      const array = response?.data || response;

      if (!Array.isArray(array)) return;

      const adaptada: SlotDisponibilidad[] = array.map((d: any) => {
        const formatHora = (horaRaw: string) => {
          if (!horaRaw) return '00:00';
          const partes = horaRaw.includes('T') ? horaRaw.split('T')[1] : horaRaw;
          return partes.substring(0, 5);
        };

        return {
          id: d.id,
          dia: d.diaSemana || d.dia_semana || '',
          inicio: formatHora(d.horaInicio || d.hora_inicio),
          fin: formatHora(d.horaFin || d.hora_fin)
        };
      });

      setDisponibilidad(adaptada);
    } catch (error) {
      console.error("Error al cargar disponibilidad:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgregarHorario = async () => {
    setError("");
    setExito("");

    if (nuevaHoraInicio >= nuevaHoraFin) {
      setError("La hora de inicio debe ser menor a la hora de fin.");
      return;
    }

    const conflicto = disponibilidad.some(d => d.dia === nuevoDia);
    if (conflicto) {
      setError(`Ya tienes un horario para el ${nuevoDia}. Elimínalo si deseas cambiarlo.`);
      return;
    }

    setIsSaving(true);
    try {
      await apiFetch('/instructores/disponibilidad', {
        method: 'POST',
        body: JSON.stringify({
          diaSemana: nuevoDia,
          horaInicio: `${nuevaHoraInicio}:00`,
          horaFin: `${nuevaHoraFin}:00`
        })
      });

      setExito("Horario agregado exitosamente.");
      await fetchDisponibilidad();
    } catch (err: any) {
      setError(err.message || "Error al guardar el horario.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEliminarHorario = async (id: number) => {
    setError("");
    setExito("");
    setIsSaving(true);

    try {
      await apiFetch(`/instructores/disponibilidad/${id}`, {
        method: 'DELETE'
      });

      setExito("Horario eliminado correctamente.");
      await fetchDisponibilidad();
    } catch (err: any) {
      setError(err.message || "Error al eliminar el horario.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">

        <button
          onClick={() => router.back()}
          className="flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver al Panel
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
          <div className="flex items-center mb-6">
            <div className="bg-indigo-100 p-3 rounded-xl mr-4">
              <Clock className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Mi Disponibilidad</h1>
              <p className="text-slate-500 mt-1 text-sm">
                Configura los días y horas en los que puedes dar clases.
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {exito && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-md flex items-start">
              <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">{exito}</p>
            </div>
          )}

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-8">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">
              Agregar Bloque de Horario
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Día</label>
                <select
                  value={nuevoDia}
                  onChange={(e) => setNuevoDia(e.target.value)}
                  className="block w-full py-2 px-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none text-sm bg-white capitalize"
                >
                  {diasSemana.map(dia => (
                    <option key={dia} value={dia} className="capitalize">{dia}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Hora Inicio</label>
                <input
                  type="time"
                  value={nuevaHoraInicio}
                  onChange={(e) => setNuevaHoraInicio(e.target.value)}
                  className="block w-full py-2 px-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Hora Fin</label>
                <input
                  type="time"
                  value={nuevaHoraFin}
                  onChange={(e) => setNuevaHoraFin(e.target.value)}
                  className="block w-full py-2 px-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none text-sm bg-white"
                />
              </div>
              <button
                onClick={handleAgregarHorario}
                disabled={isSaving}
                className="flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors h-[38px] disabled:opacity-50"
              >
                <Plus className="w-4 h-4 mr-1" />
                Agregar
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-700 mb-3">
              Horarios Configurados
            </h2>

            {isLoading ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                Cargando horarios...
              </div>
            ) : disponibilidad.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm border-2 border-dashed border-slate-200 rounded-xl">
                No has configurado ningún horario aún.
              </div>
            ) : (
              <div className="space-y-3">
                {disponibilidad.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center">
                      <span className="w-28 font-medium text-slate-900 capitalize">
                        {item.dia}
                      </span>
                      <span className="text-slate-500 flex items-center text-sm ml-4">
                        <Clock className="w-4 h-4 mr-2" />
                        {item.inicio} hrs — {item.fin} hrs
                      </span>
                    </div>
                    <button
                      onClick={() => handleEliminarHorario(item.id)}
                      disabled={isSaving}
                      className="text-slate-400 hover:text-red-500 p-2 transition-colors rounded-md hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}