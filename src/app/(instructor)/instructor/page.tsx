"use client";

import { LayoutDashboard } from "lucide-react";

export default function InstructorDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 shadow-inner flex-shrink-0">
          <LayoutDashboard className="w-10 h-10" strokeWidth={1.5} />
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">¡Bienvenido, Roberto!</h2>
          <p className="text-slate-500 font-medium mt-2 leading-relaxed">
            Este es tu panel central. Desde aquí podrás visualizar las clases que tienes programadas y asignar tu disponibilidad horaria.
          </p>
        </div>
      </div>
    </div>
  );
}
