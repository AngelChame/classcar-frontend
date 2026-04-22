import { useState, useEffect, useMemo } from "react";
import { apiFetch } from "@/lib/api";

export type AutoState = "disponible" | "en_uso" | "mantenimiento";

export interface Auto {
  id: string;
  modelo: string;
  placa: string;
  estado: AutoState;
}

export function useAutos() {
  const [autos, setAutos] = useState<Auto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState<"Todos" | "Disponibles" | "En Uso" | "Mantenimiento">("Todos");

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  
  const [autoToEdit, setAutoToEdit] = useState<Auto | null>(null);
  const [autoToUpdateStatus, setAutoToUpdateStatus] = useState<Auto | null>(null);
  const [newStatusSelection, setNewStatusSelection] = useState<AutoState>("disponible");
  
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Auto>>({ estado: "disponible" });

  const fetchAutos = async () => {
    try {
      const response = await apiFetch('/automoviles');
      const arrayAutos = response.data || response.automoviles || response;

      if (Array.isArray(arrayAutos)) {
        const adaptedAutos: Auto[] = arrayAutos.map((a: any) => ({
          id: a.id.toString(),
          modelo: a.modelo || "",
          placa: a.placa || "",
          estado: (a.estado || "disponible") as AutoState
        }));
        setAutos(adaptedAutos);
      }
    } catch (error) {
      console.error("Error al cargar autos:", error);
    }
  };

  useEffect(() => {
    fetchAutos();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const filteredAutos = useMemo(() => {
    return autos.filter(auto => {
      if (stateFilter === "Disponibles" && auto.estado !== "disponible") return false;
      if (stateFilter === "En Uso" && auto.estado !== "en_uso") return false;
      if (stateFilter === "Mantenimiento" && auto.estado !== "mantenimiento") return false;
      
      if (debouncedSearchTerm) {
        const query = debouncedSearchTerm.toLowerCase();
        if (!auto.modelo.toLowerCase().includes(query) && !auto.placa.toLowerCase().includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [autos, stateFilter, debouncedSearchTerm]);

  const formatPlacaMexico = (value: string) => {
    let clean = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (clean.length > 3) {
      if (clean.length > 5) {
        return `${clean.slice(0, 3)}-${clean.slice(3, 5)}-${clean.slice(5, 7)}`;
      }
      return `${clean.slice(0, 3)}-${clean.slice(3)}`;
    }
    return clean;
  };

  const handlePlacaChange = (rawVal: string) => {
    setFormData({ ...formData, placa: formatPlacaMexico(rawVal) });
  };

  const handleOpenFormModal = (auto?: Auto) => {
    if (auto) {
      setAutoToEdit(auto);
      setFormData(auto);
    } else {
      setAutoToEdit(null);
      setFormData({ estado: "disponible", modelo: "", placa: "" });
    }
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setAutoToEdit(null);
  };

  const handleOpenStatusModal = (auto: Auto) => {
    setAutoToUpdateStatus(auto);
    setNewStatusSelection(auto.estado);
    setIsStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    setIsStatusModalOpen(false);
    setAutoToUpdateStatus(null);
  };

  const confirmStatusChange = async () => {
    if (!autoToUpdateStatus) return;
    setIsSaving(true);
    
    try {
      await apiFetch(`/automoviles/${autoToUpdateStatus.id}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ estado: newStatusSelection })
      });
      await fetchAutos();
      handleCloseStatusModal();
    } catch (error: any) {
      alert(`Error al cambiar estado: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAuto = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (autoToEdit) {
        console.log("Edición de auto no conectada al backend aún");
      } else {
        const backendData = {
          modelo: formData.modelo,
          placa: formData.placa,
          estado: formData.estado
        };

        await apiFetch('/automoviles', {
          method: 'POST',
          body: JSON.stringify(backendData)
        });
      }
      
      await fetchAutos();
      handleCloseFormModal();
    } catch (error: any) {
      alert(`Error al guardar auto: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    stateFilter,
    setStateFilter,
    filteredAutos,
    isFormModalOpen,
    isStatusModalOpen,
    autoToEdit,
    autoToUpdateStatus,
    newStatusSelection,
    setNewStatusSelection,
    isSaving,
    formData,
    setFormData,
    handlePlacaChange,
    handleOpenFormModal,
    handleCloseFormModal,
    handleOpenStatusModal,
    handleCloseStatusModal,
    handleSaveAuto,
    confirmStatusChange
  };
}