import { useState, useEffect, useMemo } from "react";

export type AutoState = "disponible" | "en_uso" | "mantenimiento";

export interface Auto {
  id: string;
  modelo: string;
  placa: string;
  estado: AutoState;
}

const mockAutos: Auto[] = [
  { id: "a1", modelo: "Chevrolet Aveo 2022", placa: "ABC-12-34", estado: "disponible" },
  { id: "a2", modelo: "Nissan Versa 2023", placa: "XYZ-98-76", estado: "en_uso" },
  { id: "a3", modelo: "Toyota Yaris 2021", placa: "DEF-45-67", estado: "mantenimiento" },
  { id: "a4", modelo: "Volkswagen Vento 2020", placa: "LMN-11-22", estado: "disponible" },
];

export function useAutos() {
  const [autos, setAutos] = useState<Auto[]>(mockAutos);
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
    await new Promise(resolve => setTimeout(resolve, 600));
    setAutos(autos.map(a => a.id === autoToUpdateStatus.id ? { ...a, estado: newStatusSelection } : a));
    setIsSaving(false);
    handleCloseStatusModal();
  };

  const handleSaveAuto = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    if (autoToEdit) {
      setAutos(autos.map(a => a.id === autoToEdit.id ? { ...a, ...formData } as Auto : a));
    } else {
      const newAuto: Auto = {
        ...formData,
        id: Math.random().toString(36).substring(2, 11),
      } as Auto;
      setAutos([newAuto, ...autos]);
    }
    
    setIsSaving(false);
    handleCloseFormModal();
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
