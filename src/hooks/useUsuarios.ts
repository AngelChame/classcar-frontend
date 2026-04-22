import { useState, useEffect, useMemo } from "react";
import { apiFetch } from "@/lib/api";

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

export function useUsuarios() {
  const [users, setUsers] = useState<User[]>([]);
  
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

  // Petición al Backend
  const fetchUsers = async () => {
    try {
      const response = await apiFetch('/usuarios');
      const arrayUsuarios = response.data || response.usuarios || response;

      if (Array.isArray(arrayUsuarios)) {
        // Adaptador: Traduce de PostgreSQL al formato visual del Frontend
        const adaptedUsers: User[] = arrayUsuarios.map((u: any) => ({
          id: u.id.toString(),
          name: u.nombre || "Sin Nombre",
          lastName: u.apellidoPaterno || "",
          email: u.correo || "Sin Correo",
          role: (u.rol || "alumno") as Role,
          phone: u.telefono || "N/A",
          status: u.activo ?? true,
          specialty: u.especialidad || ""
        }));
        setUsers(adaptedUsers);
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
      if (roleFilter === "Instructores" && user.role !== "instructor") return false;
      if (roleFilter === "Alumnos" && user.role !== "alumno") return false;
      
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
    
    try {
      if (!userToEdit) {
        // Crear registro nuevo en Backend
        const backendData = {
          nombre: formData.name,
          apellidoPaterno: formData.lastName,
          correo: formData.email,
          telefono: formData.phone,
          contrasena: process.env.NEXT_PUBLIC_PASSWORD_DEFAULT || "Autoescuela2026",
          rol: formData.role,
          especialidad: formData.specialty
        };

        await apiFetch('/usuarios', {
          method: 'POST',
          body: JSON.stringify(backendData)
        });
      } else {
        // Lógica de edición si se implementa el PUT/PATCH en el futuro
        console.log("Edición no conectada al backend aún");
      }
      
      await fetchUsers(); // Recargar la lista fresca
      closeModal();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const promptToggleStatus = (user: User) => {
    setUserToToggle(user);
    setIsConfirmModalOpen(true);
  };

  const confirmToggleStatus = async () => {
    if (!userToToggle) return;
    setIsSaving(true);
    
    try {
      // Simular retraso visual mientras no haya endpoint de desactivar
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsers(users.map(u => u.id === userToToggle.id ? { ...u, status: !u.status } : u));
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSaving(false);
      setIsConfirmModalOpen(false);
      setUserToToggle(null);
    }
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