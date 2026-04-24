"use client";

import { useCursos, Course } from "@/hooks/useCursos";
import { Plus, Edit2, AlertCircle, Loader2, BookOpen, Clock, Users, BookX, X } from "lucide-react";

export default function CursosPage() {
  const {
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
  } = useCursos();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* SECCIÓN DEL ENCABEZADO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
            <BookOpen className="w-7 h-7" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Catálogo de Cursos</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Gestiona y crea las plantillas de los cursos que se imparten.</p>
          </div>
        </div>
        <button 
          onClick={() => handleOpenFormModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 active:scale-95 flex-shrink-0"
        >
          <Plus className="w-5 h-5" strokeWidth={2.5} />
          <span>Nuevo Curso</span>
        </button>
      </div>

      {/* GRID DE CURSOS (TARJETAS) */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div 
              key={course.id} 
              className={`bg-white rounded-3xl border transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col h-full overflow-hidden group ${
                course.status ? 'border-slate-100' : 'border-slate-200/60 opacity-80'
              }`}
            >
              {/* Card Header & Body */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${
                    course.status 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${course.status ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                    {course.status ? 'Activo' : 'Inactivo'}
                  </span>

                  {/* Switch Toggle Activo/Inactivo */}
                  <button
                    onClick={() => promptToggleStatus(course)}
                    className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-500/20 ${
                      course.status ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                    title={course.status ? "Desactivar curso" : "Activar curso"}
                  >
                    <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm flex items-center justify-center ${
                      course.status ? "translate-x-5" : "translate-x-0"
                    }`} />
                  </button>
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight group-hover:text-indigo-700 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed flex-1">
                  {course.description}
                </p>
                
                {/* Metadatos (Duración) */}
                <div className="mt-6 flex items-center gap-4 pt-5 border-t border-slate-100/80">
                  <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-semibold">{course.durationHours} horas</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    <Users className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-semibold">{course.enrolledStudents.length} inscritos</span>
                  </div>
                </div>
              </div>

              {/* Botonera Footer */}
              <div className="bg-slate-50/50 p-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button 
                  onClick={() => handleOpenStudentsModal(course)}
                  className="flex-1 px-4 py-2.5 bg-white text-indigo-600 border border-slate-200 rounded-xl text-sm font-bold shadow-sm hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" /> Ver Alumnos
                </button>
                <button 
                  onClick={() => handleOpenFormModal(course)}
                  className="p-2.5 text-slate-400 bg-white border border-slate-200 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-100 rounded-xl transition-all shadow-sm flex-shrink-0"
                  title="Editar curso"
                >
                  <Edit2 className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ESTADO VACÍO (EMPTY STATE) */
        <div className="bg-white rounded-3xl p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 text-center">
          <div className="flex flex-col items-center justify-center text-slate-500 animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-sm">
              <BookX className="w-12 h-12 text-slate-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-800">El catálogo está vacío</h3>
            <p className="text-base mt-2 max-w-md font-medium leading-relaxed text-slate-500">No hay ningún curso registrado en el sistema. Comienza creando tu primera plantilla de curso.</p>
            <button 
              onClick={() => handleOpenFormModal()}
              className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-5 h-5" strokeWidth={2.5} />
              <span>Crear mi primer curso</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE CREACIÓN Y EDICIÓN DE CURSO */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200 relative">
            
            <div className="flex justify-between items-center p-6 border-b border-slate-100/80 bg-slate-50/50">
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                {selectedCourse ? "Editar Curso" : "Nuevo Curso"}
              </h2>
              <button type="button" onClick={handleCloseFormModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors">
                <X className="w-5 h-5" strokeWidth={2.5}/>
              </button>
            </div>
            
            <form onSubmit={handleSaveCourse} className="p-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Nombre del Curso</label>
                  <input 
                    required type="text"
                    value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 hover:border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:border-indigo-500 focus:ring-indigo-500/10 font-bold text-slate-900 transition-all" 
                    placeholder="Ej: Licencia de Moto"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Descripción corta</label>
                  <textarea 
                    required rows={3}
                    value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 hover:border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:border-indigo-500 focus:ring-indigo-500/10 font-medium text-slate-900 transition-all resize-none" 
                    placeholder="Describe brevemente los objetivos del curso..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Duración (En horas)</label>
                  <div className="relative">
                    <input 
                      required type="number" min="1"
                      value={formData.durationHours || ""} onChange={e => setFormData({...formData, durationHours: parseInt(e.target.value) || 0})}
                      className="w-full pl-4 pr-12 py-3 bg-slate-50/50 border border-slate-200 hover:border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:border-indigo-500 focus:ring-indigo-500/10 font-bold text-slate-900 transition-all" 
                      placeholder="20"
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                      hrs
                    </div>
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
                  {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</> : "Guardar Curso"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE ESTADO (ACTIVAR/DESACTIVAR) */}
      {isConfirmModalOpen && selectedCourse && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200 p-8 text-center relative">
             <button onClick={() => setIsConfirmModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
               <X className="w-4 h-4" strokeWidth={3} />
             </button>
            <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 shadow-inner ${selectedCourse.status ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
              <AlertCircle className="w-10 h-10" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 mb-2">
              ¿{selectedCourse.status ? "Ocultar" : "Mostrar"} curso?
            </h3>
            <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
              Estás a punto de {selectedCourse.status ? "deshabilitar" : "habilitar"} la plantilla <strong>{selectedCourse.title}</strong>.
              {selectedCourse.status ? " Los alumnos ya no podrán inscribirse a él." : " Quedará abierto para la inscripción."}
            </p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmToggleStatus}
                disabled={isSaving}
                className={`w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all shadow-sm active:scale-95 flex justify-center items-center gap-2 ${
                  selectedCourse.status ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600'
                }`}
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sí, confirmar acción"}
              </button>
              <button 
                onClick={() => setIsConfirmModalOpen(false)}
                disabled={isSaving}
                className="w-full py-3.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Mantener {selectedCourse.status ? 'público' : 'oculto'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE ALUMNOS INSCRITOS (READ-ONLY) */}
      {isStudentsModalOpen && viewingCourse && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200 relative flex flex-col max-h-[80vh]">
            
            <div className="flex justify-between items-center p-6 border-b border-slate-100/80 bg-slate-50/50 flex-shrink-0">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Alumnos Inscritos</h2>
                <p className="text-sm font-medium text-slate-500 mt-0.5 truncate max-w-[300px]" title={viewingCourse.title}>{viewingCourse.title}</p>
              </div>
              <button type="button" onClick={handleCloseStudentsModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors self-start">
                <X className="w-5 h-5" strokeWidth={2.5}/>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {viewingCourse.enrolledStudents.length > 0 ? (
                <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-100/50 border-b border-slate-100">
                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Estudiante</th>
                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/80">
                      {viewingCourse.enrolledStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-white transition-colors">
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span className="font-bold text-slate-800">{student.name}</span>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-right">
                             <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold capitalize border shadow-sm ${
                              student.status === 'activo'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                              {student.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-10">
                   <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                    <Users className="w-8 h-8 text-slate-300" strokeWidth={2} />
                  </div>
                  <p className="font-bold text-slate-800 text-lg">Aún no hay inscritos</p>
                  <p className="text-sm font-medium text-slate-500 mt-1 max-w-[250px]">Actualmente ningún alumno ha sido matriculado en este curso.</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 flex-shrink-0 flex justify-end">
               <button 
                  onClick={handleCloseStudentsModal}
                  className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm active:scale-95"
                >
                  Cerrar
                </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
