"use client";

import { usePathname } from "next/navigation";
import { Bell, LogOut, Search, User, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const getPageTitle = (pathname: string) => {
  if (pathname === '/instructor') return 'Inicio';
  if (pathname.includes('/instructor/clases')) return 'Mis Clases';
  if (pathname.includes('/instructor/disponibilidad')) return 'Mi Disponibilidad';
  if (pathname.includes('/instructor/alumnos')) return 'Alumnos';
  return 'Panel Instructor';
};

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'info' | 'alert' | 'success';
}

const mockNotifications: Notification[] = [
  { id: '1', title: 'Nueva clase asignada', description: 'Se te ha agendado una clase con Juan Pérez.', time: 'Hace 10 min', read: false, type: 'info' },
  { id: '2', title: 'Clase cancelada', description: 'Ana Martínez canceló la clase de mañana.', time: 'Hace 2 horas', read: false, type: 'alert' },
  { id: '3', title: 'Evaluación completada', description: 'Aprobaste el curso teórico a Carlos.', time: 'Ayer', read: true, type: 'success' },
];

export function InstructorHeader() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'alert': return <div className="w-2 h-2 rounded-full bg-rose-500"></div>;
      case 'success': return <div className="w-2 h-2 rounded-full bg-emerald-500"></div>;
      default: return <div className="w-2 h-2 rounded-full bg-indigo-500"></div>;
    }
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0 z-20">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-6">
        
        <div className="hidden md:flex relative group">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all w-64 text-slate-700 font-medium placeholder:font-medium placeholder:text-slate-400"
          />
        </div>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative p-2.5 rounded-xl transition-all ${isNotifOpen ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
          >
            <Bell className="w-5 h-5" strokeWidth={2.5} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white pointer-events-none animate-pulse"></span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-extrabold text-slate-800">Notificaciones</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Marcar leídas
                  </button>
                )}
              </div>
              <div className="max-h-[350px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div key={notif.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3 ${notif.read ? 'opacity-60' : 'bg-indigo-50/20'}`}>
                      <div className="mt-1.5">{getTypeIcon(notif.type)}</div>
                      <div>
                        <p className={`text-sm ${notif.read ? 'font-medium text-slate-600' : 'font-bold text-slate-800'}`}>{notif.title}</p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notif.description}</p>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-2">{notif.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500">
                     <p className="text-sm font-medium">No hay notificaciones.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-slate-200"></div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-extrabold text-slate-800">Roberto Instructor</span>
            <span className="text-xs font-bold text-indigo-500">Instructor Activo</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 font-bold border-2 border-white ring-2 ring-slate-100">
            RI
          </div>
          <Link 
            href="/login" 
            className="ml-2 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </header>
  );
}
