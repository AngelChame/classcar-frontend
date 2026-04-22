import { useState, useMemo } from "react";

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

const mockAutosDisponibles: AutoMock[] = [
  { id: "a1", modeloPlaca: "Chevrolet Aveo (ABC-12-34)" },
  { id: "a4", modeloPlaca: "Volkswagen Vento (LMN-11-22)" },
];

const mockClases: Clase[] = [
  {
    id: "cl1",
    fecha: "2026-04-25",
    hora: "10:00 AM",
    alumno: "María Fernández",
    instructor: "Carlos García",
    auto: null,
    estado: "programada"
  },
  {
    id: "cl2",
    fecha: "2026-04-20",
    hora: "02:00 PM",
    alumno: "Ana Martínez",
    instructor: "Jorge López",
    auto: "Toyota Yaris (DEF-45-67)",
    estado: "completada"
  },
  {
    id: "cl3",
    fecha: "2026-04-22",
    hora: "11:30 AM",
    alumno: "Juan Pérez",
    instructor: "Carlos García",
    auto: null,
    estado: "cancelada",
    motivoCancelacion: "Alumno reportó enfermedad de último momento."
  },
  {
    id: "cl4",
    fecha: "2026-04-26",
    hora: "08:00 AM",
    alumno: "Ana Martínez",
    instructor: "Jorge López",
    auto: "Nissan Versa (XYZ-98-76)",
    estado: "programada"
  }
];

export function useClases() {
  const [clases, setClases] = useState<Clase[]>(mockClases);
  const [autosDisponibles] = useState<AutoMock[]>(mockAutosDisponibles);

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

  const filteredClases = useMemo(() => {
    return clases.filter(clase => {
      if (dateFilter && clase.fecha !== dateFilter) return false;
      if (instructorFilter !== "Todos" && clase.instructor !== instructorFilter) return false;
      if (statusFilter !== "Todos" && clase.estado !== statusFilter) return false;
      return true;
    });
  }, [clases, dateFilter, instructorFilter, statusFilter]);

  const uniqueInstructors = useMemo(() => {
    const list = clases.map(c => c.instructor);
    return Array.from(new Set(list));
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
    
    await new Promise(resolve => setTimeout(resolve, 600));

    const autoObj = autosDisponibles.find(a => a.id === selectedAutoId);
    
    setClases(clases.map(c => 
      c.id === selectedClase.id 
        ? { ...c, auto: autoObj ? autoObj.modeloPlaca : null } 
        : c
    ));

    setIsSaving(false);
    handleCloseAssignCar();
  };

  const confirmCancelClase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClase || !cancelReason.trim()) return;
    setIsSaving(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    setClases(clases.map(c =>
      c.id === selectedClase.id
        ? { ...c, estado: "cancelada", motivoCancelacion: cancelReason.trim(), auto: null }
        : c
    ));

    setIsSaving(false);
    handleCloseCancel();
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
