"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CarFront, LayoutDashboard, CalendarDays, Users, CalendarClock } from "lucide-react";

export function InstructorSidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Inicio", href: "/instructor", icon: LayoutDashboard },
    { name: "Mis Clases", href: "/instructor/clases", icon: CalendarDays },
    { name: "Disponibilidad", href: "/instructor/disponibilidad", icon: CalendarClock },
    { name: "Alumnos", href: "/instructor/alumnos", icon: Users },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col shadow-xl flex-shrink-0 relative overflow-hidden">
      
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none"></div>

      <div className="p-6 relative z-10">
        <Link href="/instructor" className="flex items-center gap-3 group transition-transform active:scale-95">
          <div className="bg-indigo-500 text-white p-2.5 rounded-xl shadow-lg shadow-indigo-500/30 group-hover:bg-indigo-400 group-hover:-rotate-3 transition-all duration-300">
            <CarFront className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-extrabold text-white tracking-tight group-hover:text-indigo-200 transition-colors">ClassCar</span>
        </Link>
        <div className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">Panel Instructor</div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1.5 relative z-10 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-semibold text-sm ${
                isActive 
                  ? "bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20 shadow-sm" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-indigo-400" : "text-slate-500"}`} strokeWidth={isActive ? 2.5 : 2} />
              {link.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-800 relative z-10">
         <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 flex flex-col gap-2">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-xs font-bold text-slate-300">Sistema Conectado</span>
           </div>
           <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Versión 1.0.0 Instructor</p>
         </div>
      </div>
    </aside>
  );
}
