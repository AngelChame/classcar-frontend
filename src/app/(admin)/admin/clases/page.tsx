"use client";

import { useClases, ClaseState } from "@/hooks/useClases";
import { Search, Info, Car, XCircle, Loader2, Calendar, Clock, User, X, CheckCircle, ShieldAlert } from "lucide-react";

export default function ClasesPage() {
  const {
    clases,
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
  } = useClases();

  const getStatusBadgeStyles = (estado: ClaseState) => {
    switch (estado) {
      case "programada": return "bg-blue-50 text-blue-700 border-blue-200";
      case "completada": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "cancelada": return "bg-rose-50 text-rose-700 border-rose-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatusDotColor = (estado: ClaseState) => {
    switch (estado) {
      case "programada": return "bg-blue-500";
      case "completada": return "bg-emerald-500";
      case "cancelada": return "bg-rose-500";
      default: return "bg-slate-500";
    }
  };

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center gap-4">
        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
          <Calendar className="w-7 h-7" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestión de Clases</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Controla las clases programadas, cancelaciones y parque asignado.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col md:flex-row gap-4">
        
        <div className="flex-1 min-w-[200px]">
           <input 
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold text-slate-700 uppercase"
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <select 
            value={instructorFilter}
            onChange={(e) => setInstructorFilter(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold text-slate-700 cursor-pointer appearance-none"
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.2em 1.2em` }}
          >
            <option value="Todos">Todos los Instructores</option>
            {uniqueInstructors.map(inst => (
              <option key={inst} value={inst}>{inst}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold text-slate-700 cursor-pointer appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.2em 1.2em` }}
          >
            <option value="Todos">Cualquier Estado</option>
            <option value="programada">Programada</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

      </div>

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest min-w-[150px]">Calendario</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest min-w-[150px]">Alumno e Instr.</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest min-w-[150px]">Automóvil</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Estado</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {clases.length > 0 ? (
                clases.map((clase) => (
                  <tr key={clase.id} className={`hover:bg-slate-50/50 transition-colors group ${clase.estado === 'cancelada' ? 'opacity-70' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-slate-800 font-bold">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>{clase.fecha}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>{clase.hora}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-slate-800 font-bold">
                          <User className="w-4 h-4 text-indigo-400" />
                          <span>{clase.alumno}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                          <span>Inst: {clase.instructor}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       {clase.auto ? (
                         <span className="inline-flex items-center gap-2 font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                           <Car className="w-4 h-4 text-slate-500" />
                           {clase.auto.split(" ")[0]}
                         </span>
                       ) : (
                         <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                           Sin asignar
                         </span>
                       )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${getStatusBadgeStyles(clase.estado)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(clase.estado)}`}></span>
                        {capitalize(clase.estado)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex flex-row-reverse items-center justify-start gap-2">
                        
                        <button 
                          onClick={() => handleOpenDetails(clase)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          title="Ver Detalle de Clase"
                        >
                          <Info className="w-4 h-4" strokeWidth={2.5} />
                        </button>
                        
                        {clase.estado === "programada" && (
                          <>
                            <button 
                              onClick={() => handleOpenCancel(clase)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                              title="Cancelar Clase"
                            >
                              <XCircle className="w-4 h-4" strokeWidth={2.5} />
                            </button>
                            <button 
                              onClick={() => handleOpenAssignCar(clase)}
                              className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                              title="Asignar Automóvil"
                            >
                              <Car className="w-4 h-4" strokeWidth={2.5} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500 animate-in zoom-in-95 duration-300">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5 border border-slate-100 shadow-sm">
                        <Search className="w-10 h-10 text-slate-400" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-800">No hay resultados</h3>
                      <p className="text-sm mt-2 max-w-sm font-medium leading-relaxed">Prueba limpiando la fecha o ajustando los filtros de búsqueda.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isDetailsModalOpen && selectedClase && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200 relative">
            <div className="flex justify-between items-center p-6 border-b border-slate-100/80 bg-slate-50/50">
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-500" /> Detalle de Clase
              </h2>
              <button onClick={handleCloseDetails} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors">
                <X className="w-5 h-5" strokeWidth={2.5}/>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Fecha</p>
                  <p className="text-sm font-bold text-slate-800">{selectedClase.fecha}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Hora</p>
                  <p className="text-sm font-bold text-slate-800">{selectedClase.hora}</p>
                </div>
              </div>

               <div className="space-y-4">
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Alumno</p>
                   <p className="text-base font-medium text-slate-800 flex items-center gap-2"><User className="w-4 h-4 text-indigo-400"/> {selectedClase.alumno}</p>
                </div>
                <div className="h-px w-full bg-slate-100"></div>
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Instructor a Cargo</p>
                   <p className="text-base font-medium text-slate-800 flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-emerald-400"/> {selectedClase.instructor}</p>
                </div>
                 <div className="h-px w-full bg-slate-100"></div>
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Vehículo Asignado</p>
                   <p className="text-base font-medium text-slate-800 flex items-center gap-2">
                     <Car className={`w-4 h-4 ${selectedClase.auto ? 'text-amber-500' : 'text-slate-300'}`}/> 
                     {selectedClase.auto || <span className="text-slate-400 italic">No asignado</span>}
                    </p>
                </div>
              </div>

              {selectedClase.estado === 'cancelada' && (
                <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl mt-4">
                   <p className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-1">Motivo de la Cancelación</p>
                   <p className="text-sm font-medium text-rose-800">{selectedClase.motivoCancelacion}</p>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-slate-100/80 bg-slate-50/50 flex justify-end">
               <button onClick={handleCloseDetails} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm active:scale-95">Cerrar Detalle</button>
            </div>
          </div>
        </div>
      )}

      {isAssignCarModalOpen && selectedClase && (
         <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200 relative p-8">
             <button type="button" onClick={handleCloseAssignCar} disabled={isSaving} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50">
               <X className="w-4 h-4" strokeWidth={3} />
             </button>
             
             <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Car className="w-8 h-8 text-amber-500" strokeWidth={2} />
             </div>
             
             <h3 className="text-xl font-bold text-center text-slate-800 mb-2">Asignar Automóvil</h3>
             <p className="text-sm text-center text-slate-500 mb-6">Elige el coche a utilizar en la sesión de <strong className="text-slate-700">{selectedClase.alumno}</strong>.</p>
             
             <form onSubmit={confirmAssignCar}>
               <div className="mb-6">
                 <select 
                    required
                    value={selectedAutoId}
                    onChange={(e) => setSelectedAutoId(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:border-indigo-500 focus:ring-indigo-500/10 font-bold text-slate-700 transition-all cursor-pointer appearance-none text-center"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.2em 1.2em` }}
                  >
                    <option value="" disabled hidden>Selecciona un auto disponible</option>
                    {autosDisponibles.map(auto => (
                      <option key={auto.id} value={auto.id}>{auto.modeloPlaca}</option>
                    ))}
                  </select>
               </div>
               
               <button 
                  type="submit"
                  disabled={isSaving || !selectedAutoId}
                  className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 transition-all shadow-sm active:scale-95 flex justify-center items-center gap-2 disabled:opacity-50 disabled:active:scale-100"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle className="w-5 h-5"/> Guardar Vehículo</>}
                </button>
             </form>

          </div>
        </div>
      )}

      {isCancelModalOpen && selectedClase && (
         <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200 relative p-8 text-center">
             
             <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-8 h-8 text-rose-500" strokeWidth={2} />
             </div>
             
             <h3 className="text-xl font-bold text-slate-800 mb-2">Cancelar Clase</h3>
             <p className="text-sm text-slate-500 mb-6">Estás a punto de cancelar la clase programada para <strong className="text-slate-700">{selectedClase.fecha}</strong>. Esta acción es irreversible.</p>
             
             <form onSubmit={confirmCancelClase} className="text-left font-sans">
               <div className="mb-6">
                 <label className="text-sm font-bold text-slate-700 ml-1 mb-2 block">Motivo de Cancelación</label>
                 <textarea 
                    required
                    rows={3}
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Ej. Condición climática extrema..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all resize-none text-slate-800"
                  />
               </div>
               
               <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={handleCloseCancel}
                    disabled={isSaving}
                    className="flex-1 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
                  >
                    Mantener
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving || !cancelReason.trim()}
                    className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 transition-all shadow-sm active:scale-95 flex justify-center items-center gap-2 disabled:opacity-50 disabled:active:scale-100"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirmar"}
                  </button>
               </div>
             </form>

          </div>
        </div>
      )}

    </div>
  );
}
