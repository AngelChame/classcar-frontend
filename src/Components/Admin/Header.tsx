"use client";

import { usePathname } from "next/navigation";
import { User, Bell } from "lucide-react";

export function Header() {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === "/admin") return "Dashboard";
    if (pathname?.includes("/admin/usuarios")) return "Usuarios";
    if (pathname?.includes("/admin/cursos")) return "Cursos";
    if (pathname?.includes("/admin/autos")) return "Automóviles";
    if (pathname?.includes("/admin/clases")) return "Clases";
    return "Panel de Administración";
  };

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 z-10 shadow-sm relative">
      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
        {getPageTitle()}
      </h2>

      <div className="flex items-center gap-5">
        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="w-px h-8 bg-slate-200 mx-1"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-bold text-slate-700 leading-none">Admin</span>
            <span className="text-xs text-slate-500 font-medium mt-1">ClassCar</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white transition-transform group-hover:scale-105 shadow-md">
            <User className="w-5 h-5" strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </header>
  );
}
