"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Lock, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function CambiarPasswordPage() {
  const router = useRouter();
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (passwordNueva !== confirmarPassword) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }

    if (passwordNueva.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("http://localhost:3000/api/auth/cambiar-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          passwordActual,
          passwordNueva
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || "Error al actualizar la contraseña");
      }

      setExito(true);
      
      setTimeout(() => {
        router.push("/login");
      }, 3000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-sm border border-slate-100 p-8">
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-100 p-3 rounded-full mb-4">
            <KeyRound className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Actualizar Contraseña</h1>
          <p className="text-slate-500 text-center mt-2 text-sm">
            Por seguridad, debes cambiar tu contraseña temporal antes de continuar.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {exito && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-md flex items-start">
            <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">
              ¡Contraseña actualizada con éxito! Redirigiendo...
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contraseña Actual
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                required
                value={passwordActual}
                onChange={(e) => setPasswordActual(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-sm"
                placeholder="Ingresa tu contraseña actual"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nueva Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                required
                value={passwordNueva}
                onChange={(e) => setPasswordNueva(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-sm"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirmar Nueva Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CheckCircle2 className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                required
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-sm"
                placeholder="Repite la nueva contraseña"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || exito}
            className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors mt-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Actualizar y Continuar"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}