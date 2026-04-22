"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const usuarioStr = localStorage.getItem("usuario");

    if (token && usuarioStr) {
      const usuario = JSON.parse(usuarioStr);
      const rol = usuario.rol;

      if (rol === "admin") router.push("/admin");
      else if (rol === "instructor") router.push("/instructor");
      else router.push("/alumno");
    } else {
      router.push("/login");
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 text-sm">Cargando...</p>
      </div>
    </div>
  );
}