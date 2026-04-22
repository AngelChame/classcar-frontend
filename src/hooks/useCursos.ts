import { useState } from "react";

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

const mockCourses: Course[] = [
  {
    id: "c1",
    title: "Manejo Defensivo Básico",
    description: "Curso teórico-práctico orientado a conductores novatos para evitar accidentes de tráfico y entender reglas de seguridad vial.",
    durationHours: 20,
    status: true,
    enrolledStudents: [
      { id: "s1", name: "María Fernández", status: "activo" },
      { id: "s2", name: "Juan Pérez", status: "inactivo" },
    ]
  },
  {
    id: "c2",
    title: "Licencia Comercial (Carga Pesada)",
    description: "Preparación completa para la obtención de la licencia tipo C. Incluye maniobras con remolque.",
    durationHours: 45,
    status: true,
    enrolledStudents: [
      { id: "s3", name: "Carlos García", status: "activo" },
      { id: "s4", name: "Luis Martínez", status: "activo" },
    ]
  },
  {
    id: "c3",
    title: "Actualización de Reglas Modulares",
    description: "Seminario intensivo sobre la nueva ley de tránsito vigente en el territorio nacional.",
    durationHours: 5,
    status: false,
    enrolledStudents: []
  }
];

export function useCursos() {
  const [courses, setCourses] = useState<Course[]>(mockCourses);

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

  // Manejadores para Forma (Crear / Editar)
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

  // Manejadores para Ver Alumnos Inscritos
  const handleOpenStudentsModal = (course: Course) => {
    setViewingCourse(course);
    setIsStudentsModalOpen(true);
  };

  const handleCloseStudentsModal = () => {
    setIsStudentsModalOpen(false);
    setViewingCourse(null);
  };

  // Manejadores para Confirmar Toggle de Estado
  const promptToggleStatus = (course: Course) => {
    setSelectedCourse(course);
    setIsConfirmModalOpen(true);
  };

  const confirmToggleStatus = async () => {
    if (!selectedCourse) return;
    setIsSaving(true);
    
    // Simular retraso de base de datos
    await new Promise(resolve => setTimeout(resolve, 600));

    setCourses(courses.map(c => c.id === selectedCourse.id ? { ...c, status: !c.status } : c));
    
    setIsSaving(false);
    setIsConfirmModalOpen(false);
    setSelectedCourse(null);
  };

  // Guardar datos (Crear o Actualizar)
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simular retraso de backend
    await new Promise(resolve => setTimeout(resolve, 800));

    if (selectedCourse) {
      // Actualizar registro existente
      setCourses(courses.map(c => c.id === selectedCourse.id ? { ...c, ...formData } as Course : c));
    } else {
      // Crear nuevo registro
      const newCourse: Course = {
        ...(formData as Course),
        id: Math.random().toString(36).substring(2, 11),
        enrolledStudents: [], // un curso nuevo arranca libre de alumnos
      };
      setCourses([newCourse, ...courses]);
    }

    setIsSaving(false);
    handleCloseFormModal();
  };

  return {
    courses,
    isFormModalOpen,
    isConfirmModalOpen,
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
