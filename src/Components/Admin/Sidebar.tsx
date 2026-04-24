"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, BookOpen, Car, Calendar, CarFront } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Usuarios", href: "/admin/usuarios", icon: Users },
  { name: "Cursos", href: "/admin/cursos", icon: BookOpen },
  { name: "Automóviles", href: "/admin/autos", icon: Car },
  { name: "Clases", href: "/admin/clases", icon: Calendar },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 shadow-xl z-20">
      <div className="h-20 flex items-center px-6 border-b border-slate-800">
        <Link href="/admin" className="flex items-center gap-3 text-white transition-opacity hover:opacity-90">
          <CarFront className="w-8 h-8 text-indigo-500" strokeWidth={2.5} />
          <span className="text-2xl font-extrabold tracking-tight">ClassCar</span>
        </Link>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(`${item.href}`));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-indigo-200" : "text-slate-400"}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      
      <div className="p-6 border-t border-slate-800/50">
        <p className="text-xs text-slate-500 font-medium text-center">ClassCar Admin v1.0</p>
      </div>
    </aside>
  );
}
