import { useState, useEffect, useMemo } from "react";
import { apiFetch } from "@/lib/api";

export type ClaseState = "programada" | "completada" | "cancelada";

export interface Clase {
  id: string;
  fecha: string;
  hora: string;
  alumno: string;
  instructor: string;
  auto: string | null;
  estado: ClaseState;
  motivoCancelacion?: string;
}

export interface AutoMock {
  id: string;
  modeloPlaca: string;
}

export function useClases() {
  const [clases, setClases] = useState<Clase[]>([]);
  const [autosDisponibles, setAutosDisponibles] = useState<AutoMock[]>([]);

  const [dateFilter, setDateFilter] = useState("");
  const [instructorFilter, setInstructorFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAssignCarModalOpen, setIsAssignCarModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const [selectedClase, setSelectedClase] = useState<Clase | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [selectedAutoId, setSelectedAutoId] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  const fetchClases = async () => {
    try {
      const response = await apiFetch('/clases');
      const arrayClases = response?.data || response;

      if (!Array.isArray(arrayClases)) {
        console.warn("La respuesta de clases no es un array:", response);
        return;
      }

      const adaptedClases: Clase[] = arrayClases.map((c: any) => {
        // El alumno puede venir de inscripcion.alumno o directamente
        const alumno = c.inscripcion?.alumno || c.alumno;
        const alumnoNombre = alumno
          ? `${alumno.nombre || ''} ${alumno.apellidoPaterno || ''}`.trim()
          : 'Alumno no asignado';

        // El instructor tiene su usuario anidado
        const instructorUsuario = c.instructor?.usuario || c.instructor;
        const instructorNombre = instructorUsuario
          ? `${instructorUsuario.nombre || ''} ${instructorUsuario.apellidoPaterno || ''}`.trim()
          : 'Sin instructor';

        const autoInfo = c.automovil
          ? `${c.automovil.modelo} (${c.automovil.placa})`
          : null;

        // La fecha viene como ISO string, la convertimos a YYYY-MM-DD
        let fechaFormateada = 'Sin fecha';
        if (c.fecha) {
          const d = new Date(c.fecha);
          fechaFormateada = d.toISOString().split('T')[0];
        }

        // La hora viene como objeto Date de Prisma, extraemos HH:MM AM/PM
        let horaFormateada = 'N/A';
        if (c.horaInicio) {
          const horaStr = typeof c.horaInicio === 'string'
            ? c.horaInicio
            : new Date(c.horaInicio).toISOString();
          const partes = horaStr.split('T');
          const horaTime = partes.length > 1 ? partes[1].substring(0, 5) : horaStr.substring(0, 5);
          const [hh, mm] = horaTime.split(':').map(Number);
          const periodo = hh >= 12 ? 'PM' : 'AM';
          const hora12 = hh % 12 === 0 ? 12 : hh % 12;
          horaFormateada = `${hora12.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')} ${periodo}`;
        }

        return {
          id: c.id.toString(),
          fecha: fechaFormateada,
          hora: horaFormateada,
          alumno: alumnoNombre,
          instructor: instructorNombre,
          auto: autoInfo,
          estado: (c.estado?.toLowerCase() || 'programada') as ClaseState,
          motivoCancelacion: c.motivoCancelacion || c.motivo || ''
        };
      });

      setClases(adaptedClases);
    } catch (error) {
      console.error("Error al cargar clases:", error);
    }
  };

  const fetchAutosParaAsignar = async () => {
    try {
      const response = await apiFetch('/automoviles');
      const arrayAutos = response?.data || response;

      if (!Array.isArray(arrayAutos)) return;

      const disponibles = arrayAutos
        .filter((a: any) => a.estado === 'disponible')
        .map((a: any) => ({
          id: a.id.toString(),
          modeloPlaca: `${a.modelo} (${a.placa})`
        }));

      setAutosDisponibles(disponibles);
    } catch (error) {
      console.error("Error al cargar autos disponibles:", error);
    }
  };

  useEffect(() => {
    fetchClases();
    fetchAutosParaAsignar();
  }, []);

  const filteredClases = useMemo(() => {
    return clases.filter(clase => {
      if (dateFilter && clase.fecha !== dateFilter) return false;
      if (instructorFilter !== "Todos" && clase.instructor !== instructorFilter) return false;
      if (statusFilter !== "Todos" && clase.estado !== statusFilter) return false;
      return true;
    });
  }, [clases, dateFilter, instructorFilter, statusFilter]);

  const uniqueInstructors = useMemo(() => {
    return Array.from(new Set(clases.map(c => c.instructor)));
  }, [clases]);

  const handleOpenDetails = (clase: Clase) => {
    setSelectedClase(clase);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedClase(null);
  };

  const handleOpenAssignCar = (clase: Clase) => {
    setSelectedClase(clase);
    setSelectedAutoId("");
    setIsAssignCarModalOpen(true);
  };

  const handleCloseAssignCar = () => {
    setIsAssignCarModalOpen(false);
    setSelectedClase(null);
    setSelectedAutoId("");
  };

  const handleOpenCancel = (clase: Clase) => {
    setSelectedClase(clase);
    setCancelReason("");
    setIsCancelModalOpen(true);
  };

  const handleCloseCancel = () => {
    setIsCancelModalOpen(false);
    setSelectedClase(null);
    setCancelReason("");
  };

  const confirmAssignCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClase || !selectedAutoId) return;
    setIsSaving(true);

    try {
      await apiFetch(`/clases/${selectedClase.id}/automovil`, {
        method: 'PATCH',
        body: JSON.stringify({ automovilId: parseInt(selectedAutoId) })
      });
      await fetchClases();
      await fetchAutosParaAsignar();
      handleCloseAssignCar();
    } catch (error: any) {
      alert(`Error al asignar auto: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmCancelClase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClase || !cancelReason.trim()) return;
    setIsSaving(true);

    try {
      await apiFetch(`/clases/${selectedClase.id}/cancelar`, {
        method: 'PATCH',
        body: JSON.stringify({ motivo: cancelReason.trim() })
      });
      await fetchClases();
      handleCloseCancel();
    } catch (error: any) {
      alert(`Error al cancelar: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    clases: filteredClases,
    autosDisponibles,
    uniqueInstructors,
    dateFilter,
    setDateFilter,
    instructorFilter,
    setInstructorFilter,
    statusFilter,
    setStatusFilter,
    isDetailsModalOpen,
    isAssignCarModalOpen,
    isCancelModalOpen,
    selectedClase,
    isSaving,
    selectedAutoId,
    setSelectedAutoId,
    cancelReason,
    setCancelReason,
    handleOpenDetails,
    handleCloseDetails,
    handleOpenAssignCar,
    handleCloseAssignCar,
    handleOpenCancel,
    handleCloseCancel,
    confirmAssignCar,
    confirmCancelClase
  };
}