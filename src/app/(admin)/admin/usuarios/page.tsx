"use client";

import { useUsuarios, Role } from "@/hooks/useUsuarios";
import { Search, Plus, Edit2, AlertCircle, Loader2, UserX, X } from "lucide-react";

export default function UsuariosPage() {
  const {
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
  } = useUsuarios();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* SECCIÓN DEL ENCABEZADO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestión de Usuarios</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Administra instructores y alumnos de la plataforma.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 active:scale-95 flex-shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTRADO */}
      <div className="bg-white p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col md:flex-row justify-between gap-4">
        
        {/* Pestañas de Filtro por Rol */}
        <div className="flex bg-slate-100/80 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto">
          {["Todos", "Instructores", "Alumnos"].map((tab) => (
            <button
              key={tab}
              onClick={() => setRoleFilter(tab as any)}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                roleFilter === tab 
                  ? "bg-white text-indigo-700 shadow-sm ring-1 ring-black/5" 
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cesta de Búsqueda */}
        <div className="relative w-full md:w-80 flex-shrink-0">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            className="pl-11 pr-4 py-3.5 w-full bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-700 font-semibold placeholder:font-medium placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLA PRINCIPAL DE DATOS */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Usuario</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Contacto</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Rol</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Estado</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-100 to-blue-50 flex items-center justify-center text-indigo-700 font-bold text-sm shadow-sm ring-4 ring-white">
                          {user.name.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{user.name} {user.lastName}</p>
                          {user.specialty && <p className="text-xs font-bold text-indigo-500 mt-0.5">{user.specialty}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-slate-600 font-medium">{user.email}</p>
                      <p className="text-xs text-slate-400 mt-1 font-medium">{user.phone}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold capitalize bg-slate-100 text-slate-600 border border-slate-200 shadow-sm">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${
                        user.status 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        {user.status ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex flex-row-reverse items-center justify-start gap-4">
                        
                        {/* Switch de control de activación */}
                        <button
                          onClick={() => promptToggleStatus(user)}
                          className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-500/20 ${
                            user.status ? "bg-emerald-500" : "bg-slate-300"
                          }`}
                          title={user.status ? "Desactivar" : "Activar"}
                        >
                          <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm flex items-center justify-center ${
                            user.status ? "translate-x-5" : "translate-x-0"
                          }`} />
                        </button>
                        
                        <button 
                          onClick={() => handleOpenModal(user)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Editar usuario"
                        >
                          <Edit2 className="w-4 h-4" strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500 animate-in zoom-in-95 duration-300">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5 border border-slate-100 shadow-sm">
                        <UserX className="w-10 h-10 text-slate-400" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-800">No se encontraron usuarios</h3>
                      <p className="text-sm mt-2 max-w-sm font-medium leading-relaxed">No hay resultados que coincidan con tu búsqueda ("{searchTerm}") o los filtros de rol actuales.</p>
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

      {/* MODAL DE CREACIÓN Y EDICIÓN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200 relative">
            
            <div className="flex justify-between items-center p-6 border-b border-slate-100/80 bg-slate-50/50">
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                {userToEdit ? "Editar Usuario" : "Nuevo Usuario"}
              </h2>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors">
                <X className="w-5 h-5" strokeWidth={2.5}/>
              </button>
            </div>
            
            <form onSubmit={handleSaveUser} className="p-6">
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Nombre</label>
                    <input 
                      required type="text"
                      value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 hover:border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:border-indigo-500 focus:ring-indigo-500/10 font-medium text-slate-900 transition-all" 
                      placeholder="Ej: Ana"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Apellidos</label>
                    <input 
                      required type="text"
                      value={formData.lastName || ""} onChange={e => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 hover:border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:border-indigo-500 focus:ring-indigo-500/10 font-medium text-slate-900 transition-all" 
                      placeholder="Ej: Pérez"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Correo Electrónico</label>
                  <input 
                    required type="email"
                    value={formData.email || ""} onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 hover:border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:border-indigo-500 focus:ring-indigo-500/10 font-medium text-slate-900 transition-all" 
                    placeholder="ana.perez@ejemplo.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Teléfono</label>
                    <input 
                      required type="tel"
                      value={formData.phone || ""} onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 hover:border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:border-indigo-500 focus:ring-indigo-500/10 font-medium text-slate-900 transition-all" 
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Rol del sistema</label>
                    <select 
                      value={formData.role || "alumno"} 
                      onChange={e => setFormData({...formData, role: e.target.value as Role})}
                      className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 hover:border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:border-indigo-500 focus:ring-indigo-500/10 font-bold text-slate-700 transition-all cursor-pointer appearance-none"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.2em 1.2em` }}
                    >
                      <option value="alumno">Alumno</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                </div>

                {/* Mostrar especialidad únicamente param Instructores */}
                {formData.role === "instructor" && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Especialidad (Solo Instructores)</label>
                    <input 
                      required type="text"
                      value={formData.specialty || ""} onChange={e => setFormData({...formData, specialty: e.target.value})}
                      className="w-full px-4 py-3 bg-indigo-50/30 border border-indigo-200 hover:border-indigo-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:border-indigo-500 focus:ring-indigo-500/20 font-medium text-indigo-900 transition-all placeholder:text-indigo-300" 
                      placeholder="Ej: Manejo Defensivo Categoría B"
                    />
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={closeModal}
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
                  {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</> : "Guardar Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE ESTADO */}
      {isConfirmModalOpen && userToToggle && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200 p-8 text-center relative">
             <button onClick={() => setIsConfirmModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
               <X className="w-4 h-4" strokeWidth={3} />
             </button>
            <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 shadow-inner ${userToToggle.status ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
              <AlertCircle className="w-10 h-10" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-800 mb-2">
              ¿{userToToggle.status ? "Desactivar" : "Activar"} cuenta?
            </h3>
            <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
              Estás a punto de {userToToggle.status ? "desactivar" : "activar"} a <strong className="text-slate-800">{userToToggle.name} {userToToggle.lastName}</strong>.
              {userToToggle.status ? " No podrá iniciar sesión ni usar el sistema." : " Se le restaurará el acceso inmediatamente."}
            </p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmToggleStatus}
                disabled={isSaving}
                className={`w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all shadow-sm active:scale-95 flex justify-center items-center gap-2 ${
                  userToToggle.status ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600'
                }`}
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sí, confirmar acción"}
              </button>
              <button 
                onClick={() => setIsConfirmModalOpen(false)}
                disabled={isSaving}
                className="w-full py-3.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Mantener {userToToggle.status ? 'activo' : 'inactiva'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
