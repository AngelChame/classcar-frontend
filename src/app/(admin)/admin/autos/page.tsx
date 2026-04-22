"use client";

import { useAutos, AutoState } from "@/hooks/useAutos";
import { Search, Plus, Edit2, Settings, Loader2, Car, X, AlertCircle } from "lucide-react";

export default function AutosPage() {
  const {
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
  } = useAutos();

  const getStatusBadgeStyles = (estado: AutoState) => {
    switch (estado) {
      case "disponible":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "en_uso":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "mantenimiento":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatusDotColor = (estado: AutoState) => {
    switch (estado) {
      case "disponible":
        return "bg-emerald-500";
      case "en_uso":
        return "bg-amber-500";
      case "mantenimiento":
        return "bg-rose-500";
      default:
        return "bg-slate-500";
    }
  };

  const formatStatusLabel = (estado: AutoState) => {
    switch (estado) {
      case "disponible": return "Disponible";
      case "en_uso": return "En Uso";
      case "mantenimiento": return "Mantenimiento";
      default: return "";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Parque Vehicular</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Administra los automóviles de la flota.</p>
        </div>
        <button 
          onClick={() => handleOpenFormModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 active:scale-95 flex-shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Vehículo</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col md:flex-row justify-between gap-4">
        
        <div className="flex bg-slate-100/80 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto">
          {["Todos", "Disponibles", "En Uso", "Mantenimiento"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStateFilter(tab as any)}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                stateFilter === tab 
                  ? "bg-white text-indigo-700 shadow-sm ring-1 ring-black/5" 
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80 flex-shrink-0">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar modelo o placa..."
            className="pl-11 pr-4 py-3.5 w-full bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-700 font-semibold placeholder:font-medium placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Modelo</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Placa</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Estado</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {filteredAutos.length > 0 ? (
                filteredAutos.map((auto) => (
                  <tr key={auto.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 shadow-sm ring-4 ring-white border border-slate-100">
                          <Car className="w-5 h-5" strokeWidth={1.5} />
                        </div>
                        <p className="font-bold text-slate-800">{auto.modelo}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="inline-flex items-center px-3 py-1.5 bg-neutral-800 text-yellow-400 font-mono text-sm tracking-wider font-extrabold rounded-md shadow-sm border-2 border-neutral-700">
                        {auto.placa}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${getStatusBadgeStyles(auto.estado)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(auto.estado)}`}></span>
                        {formatStatusLabel(auto.estado)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex flex-row-reverse items-center justify-start gap-2">
                        <button 
                          onClick={() => handleOpenStatusModal(auto)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Cambiar estado"
                        >
                          <Settings className="w-4 h-4" strokeWidth={2.5} />
                        </button>
                        
                        <button 
                          onClick={() => handleOpenFormModal(auto)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Editar auto"
                        >
                          <Edit2 className="w-4 h-4" strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500 animate-in zoom-in-95 duration-300">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5 border border-slate-100 shadow-sm">
                        <Car className="w-10 h-10 text-slate-400" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-800">No se encontraron vehículos</h3>
                      <p className="text-sm mt-2 max-w-sm font-medium leading-relaxed">No hay resultados que coincidan con tu búsqueda ("{searchTerm}") o los filtros actuales.</p>
                      {searchTerm && (
                        <button 
                          onClick={() => setSearchTerm("")}
                          className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors"
                        >
                          Limpiar búsqueda
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200 relative">
            <div className="flex justify-between items-center p-6 border-b border-slate-100/80 bg-slate-50/50">
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                {autoToEdit ? "Editar Vehículo" : "Nuevo Vehículo"}
              </h2>
              <button onClick={handleCloseFormModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors">
                <X className="w-5 h-5" strokeWidth={2.5}/>
              </button>
            </div>
            
            <form onSubmit={handleSaveAuto} className="p-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Modelo del Automóvil</label>
                  <input 
                    required type="text"
                    value={formData.modelo || ""} onChange={e => setFormData({...formData, modelo: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 hover:border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:border-indigo-500 focus:ring-indigo-500/10 font-medium text-slate-900 transition-all" 
                    placeholder="Ej: Chevrolet Aveo 2022"
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Matrícula (Placa)</label>
                    <input 
                      required type="text"
                      value={formData.placa || ""} onChange={e => handlePlacaChange(e.target.value)}
                      className="w-full px-4 py-3 uppercase bg-slate-50/50 border border-slate-200 hover:border-slate-300 rounded-xl font-mono text-sm tracking-wide focus:outline-none focus:ring-4 focus:border-indigo-500 focus:ring-indigo-500/10 font-bold text-slate-900 transition-all" 
                      placeholder="ABC-12-34"
                      maxLength={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Estado de Parque</label>
                    <select 
                      value={formData.estado || "disponible"} 
                      onChange={e => setFormData({...formData, estado: e.target.value as AutoState})}
                      className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 hover:border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:border-indigo-500 focus:ring-indigo-500/10 font-bold text-slate-700 transition-all cursor-pointer appearance-none"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.2em 1.2em` }}
                    >
                      <option value="disponible">Disponible</option>
                      <option value="en_uso">En Uso</option>
                      <option value="mantenimiento">En Mantenimiento</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={handleCloseFormModal}
                  disabled={isSaving}
                  className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center gap-2"
                >
                  {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</> : "Guardar Vehículo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isStatusModalOpen && autoToUpdateStatus && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200 p-8 text-center relative">
             <button onClick={handleCloseStatusModal} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
               <X className="w-4 h-4" strokeWidth={3} />
             </button>
            <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 shadow-inner bg-slate-50 text-slate-500 border border-slate-100">
              <Settings className="w-10 h-10" strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-800 mb-2">
              Cambiar Estado
            </h3>
            <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed">
              Selecciona el nuevo estatus para <strong>{autoToUpdateStatus.modelo}</strong> ({autoToUpdateStatus.placa}).
            </p>
            
            <div className="space-y-4 text-left">
              <div className="space-y-2">
                <select 
                  value={newStatusSelection} 
                  onChange={e => setNewStatusSelection(e.target.value as AutoState)}
                  className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 hover:border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:border-indigo-500 focus:ring-indigo-500/10 font-bold text-slate-700 transition-all cursor-pointer appearance-none text-center"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.2em 1.2em` }}
                >
                  <option value="disponible">Taller Automotríz (Disponible)</option>
                  <option value="en_uso">Ruta Asignada (En Uso)</option>
                  <option value="mantenimiento">Reparación (Mantenimiento)</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button 
                  onClick={confirmStatusChange}
                  disabled={isSaving}
                  className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm active:scale-95 flex justify-center items-center gap-2 disabled:opacity-70 disabled:active:scale-100"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirmar cambio"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
