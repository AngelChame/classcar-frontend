import { useState, useEffect, useMemo } from "react";

export type Role = "instructor" | "alumno" | "admin";

export interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: Role;
  phone: string;
  status: boolean;
  specialty?: string;
}

const initialMockUsers: User[] = [
  { id: "1", name: "Carlos", lastName: "García", email: "carlos@classcar.com", role: "instructor", phone: "+1 234 567 8900", status: true, specialty: "Manejo Defensivo" },
  { id: "2", name: "María", lastName: "Fernández", email: "maria@classcar.com", role: "alumno", phone: "+1 987 654 3210", status: true },
  { id: "3", name: "Jorge", lastName: "López", email: "jorge@classcar.com", role: "instructor", phone: "+1 555 123 4567", status: false, specialty: "Carga Pesada" },
  { id: "4", name: "Ana", lastName: "Martínez", email: "ana@classcar.com", role: "alumno", phone: "+1 444 987 6543", status: true },
  { id: "5", name: "Admin", lastName: "Principal", email: "admin@classcar.com", role: "admin", phone: "+1 000 000 0000", status: true },
];

export function useUsuarios() {
  const [users, setUsers] = useState<User[]>(initialMockUsers);
  
  // Estado de Búsqueda y Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"Todos" | "Instructores" | "Alumnos">("Todos");
  
  // Estado de Modales y Formularios
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToToggle, setUserToToggle] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Estado del Formulario de Edición/Creación
  const [formData, setFormData] = useState<Partial<User>>({ role: "alumno", status: true });
  
  // Efecto para la búsqueda con Debounce (retraso de 300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Lista de usuarios filtrados derivados
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Comprobación de Filtro por Rol
      if (roleFilter === "Instructores" && user.role !== "instructor") return false;
      if (roleFilter === "Alumnos" && user.role !== "alumno") return false;
      
      // Comprobación de Búsqueda (Cruce entre Nombre, Apellidos o Correo)
      if (debouncedSearchTerm) {
        const query = debouncedSearchTerm.toLowerCase();
        const fullName = `${user.name} ${user.lastName}`.toLowerCase();
        if (!fullName.includes(query) && !user.email.toLowerCase().includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [users, roleFilter, debouncedSearchTerm]);

  // Manejadores de acciones en la UI
  const handleOpenModal = (user?: User) => {
    if (user) {
      setUserToEdit(user);
      setFormData(user);
    } else {
      setUserToEdit(null);
      setFormData({ role: "alumno", status: true, name: "", lastName: "", email: "", phone: "", specialty: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUserToEdit(null);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simular Petición de Red a la Base de Datos
    await new Promise(resolve => setTimeout(resolve, 800));

    if (userToEdit) {
      // Actualizar registro existente
      setUsers(users.map(u => u.id === userToEdit.id ? { ...u, ...formData } as User : u));
    } else {
      // Crear registro nuevo
      const newUser: User = {
        ...formData,
        id: Math.random().toString(36).substring(2, 11),
      } as User;
      setUsers([newUser, ...users]);
    }
    
    setIsSaving(false);
    closeModal();
  };

  const promptToggleStatus = (user: User) => {
    setUserToToggle(user);
    setIsConfirmModalOpen(true);
  };

  const confirmToggleStatus = async () => {
    if (!userToToggle) return;
    setIsSaving(true);
    
    // Simular Petición de Red para la Activación/Desactivación
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUsers(users.map(u => u.id === userToToggle.id ? { ...u, status: !u.status } : u));
    setIsSaving(false);
    setIsConfirmModalOpen(false);
    setUserToToggle(null);
  };

  return {
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    filteredUsers,
    isModalOpen,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    userToEdit,
    userToToggle,
    isSaving,
    formData,
    setFormData,
    handleOpenModal,
    closeModal,
    handleSaveUser,
    promptToggleStatus,
    confirmToggleStatus
  };
}
