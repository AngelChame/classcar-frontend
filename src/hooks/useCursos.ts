import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";

export interface EnrolledStudent {
  id: string;
  name: string;
  status: "activo" | "inactivo";
}

export interface Course {
  id: string;
  title: string;
  description: string;
  durationHours: number;
  status: boolean;
  enrolledStudents: EnrolledStudent[];
}

export function useCursos() {
  const [courses, setCourses] = useState<Course[]>([]);

  // Estados visuales de modales
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
  
  // Estado de curso seleccionado (para editar, activar/desactivar, o ver alumnos)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);

  // Estado de guardado y formulario
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Course>>({ status: true });

  // --- CONEXIÓN AL BACKEND ---
  const fetchCursos = async () => {
    try {
      const response = await apiFetch('/cursos');
      const arrayCursos = response.data || response.cursos || response;

      if (Array.isArray(arrayCursos)) {
        // Adaptador: Backend (español) -> Frontend (inglés)
        const adaptedCourses: Course[] = arrayCursos.map((c: any) => ({
          id: c.id.toString(),
          title: c.nombre || c.titulo || "Sin título",
          description: c.descripcion || c.description || "Sin descripción",
          durationHours: parseInt(c.duracion || c.duracionHoras || c.durationHours) || 0,
          status: c.activo !== undefined ? c.activo : (c.status !== undefined ? c.status : true),
          // Si tu backend devuelve alumnos inscritos, los adaptamos aquí
          enrolledStudents: Array.isArray(c.inscritos) ? c.inscritos.map((s: any) => ({
            id: s.id?.toString(),
            name: `${s.nombre || ''} ${s.apellidoPaterno || ''}`.trim() || "Alumno",
            status: s.activo ? "activo" : "inactivo"
          })) : []
        }));
        setCourses(adaptedCourses);
      }
    } catch (error) {
      console.error("Error al cargar cursos:", error);
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  // --- MANEJADORES DE UI ---
  const handleOpenFormModal = (course?: Course) => {
    if (course) {
      setSelectedCourse(course);
      setFormData(course);
    } else {
      setSelectedCourse(null);
      setFormData({ status: true, title: "", description: "", durationHours: 0 });
    }
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedCourse(null);
  };

  const handleOpenStudentsModal = (course: Course) => {
    setViewingCourse(course);
    setIsStudentsModalOpen(true);
  };

  const handleCloseStudentsModal = () => {
    setIsStudentsModalOpen(false);
    setViewingCourse(null);
  };

  const promptToggleStatus = (course: Course) => {
    setSelectedCourse(course);
    setIsConfirmModalOpen(true);
  };

  const confirmToggleStatus = async () => {
    if (!selectedCourse) return;
    setIsSaving(true);
    
    try {
      // Aquí iría tu apiFetch con PATCH al backend si tienes la ruta para cambiar estatus.
      // Por ahora simulamos la recarga para que visualmente funcione sin errores:
      await new Promise(resolve => setTimeout(resolve, 600));
      setCourses(courses.map(c => c.id === selectedCourse.id ? { ...c, status: !c.status } : c));
    } catch (error: any) {
      alert(`Error al cambiar estado: ${error.message}`);
    } finally {
      setIsSaving(false);
      setIsConfirmModalOpen(false);
      setSelectedCourse(null);
    }
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (selectedCourse) {
        console.log("Edición no conectada al backend aún");
      } else {
        // Crear nuevo registro
        const backendData = {
          nombre: formData.title, // <--- ¡CAMBIAMOS ESTO DE 'titulo' A 'nombre'!
          descripcion: formData.description,
          duracion: formData.durationHours,
          activo: formData.status
        };

        await apiFetch('/cursos', {
          method: 'POST',
          body: JSON.stringify(backendData)
        });
      }
      
      await fetchCursos();
      handleCloseFormModal();
    } catch (error: any) {
      alert(`Error al guardar curso: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    courses,
    isFormModalOpen,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    isStudentsModalOpen,
    selectedCourse,
    viewingCourse,
    isSaving,
    formData,
    setFormData,
    handleOpenFormModal,
    handleCloseFormModal,
    handleOpenStudentsModal,
    handleCloseStudentsModal,
    promptToggleStatus,
    confirmToggleStatus,
    handleSaveCourse,
  };
}