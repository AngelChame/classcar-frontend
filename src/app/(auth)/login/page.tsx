"use client";

import { Eye, EyeOff, AlertCircle, Loader2, CarFront } from "lucide-react";
import { useLogin } from "@/hooks/useLogin";

export default function LoginPage() {
  const {
    email,
    emailError,
    password,
    passwordError,
    showPassword,
    isLoading,
    globalError,
    isFormValid,
    handleEmailChange,
    handleEmailBlur,
    handlePasswordChange,
    handlePasswordBlur,
    togglePasswordVisibility,
    handleSubmit,
  } = useLogin();

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50/50 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md p-8 sm:p-10 bg-white rounded-3xl shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-gray-100 z-10 mx-4">
        <header className="flex flex-col items-center justify-center mb-8 gap-3">
          <div className="flex items-center gap-2.5 text-slate-900">
            <CarFront className="w-8 h-8 text-slate-900" strokeWidth={2.5} />
            <h1 className="text-3xl font-extrabold tracking-tight">ClassCar</h1>
          </div>
          <p className="text-sm text-slate-500 font-medium text-center">
            Ingresa a tu cuenta para continuar
          </p>
        </header>

        {globalError && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-top-4 duration-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium leading-relaxed">{globalError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-semibold text-slate-700 ml-1">
              Correo electrónico
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                placeholder="ejemplo@classcar.com"
                className={`w-full px-4 py-3.5 rounded-2xl border transition-all duration-200 outline-none text-slate-900 placeholder:text-slate-400 font-medium
                  ${emailError
                    ? 'border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                    : 'border-slate-200 bg-slate-50/40 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-slate-300'
                  }`}
              />
            </div>
            {emailError && (
              <p className="text-sm text-red-500 font-medium mt-2 ml-1 animate-in fade-in slide-in-from-top-1">
                {emailError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-semibold text-slate-700 ml-1">
              Contraseña
            </label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                placeholder="••••••••"
                className={`w-full px-4 py-3.5 rounded-2xl border transition-all duration-200 outline-none text-slate-900 placeholder:text-slate-400 font-medium pr-12
                  ${passwordError
                    ? 'border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                    : 'border-slate-200 bg-slate-50/40 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-slate-300'
                  }`}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 rounded-xl transition-all"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {passwordError && (
              <p className="text-sm text-red-500 font-medium mt-2 ml-1 animate-in fade-in slide-in-from-top-1">
                {passwordError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all duration-300 shadow-sm active:scale-[0.98] disabled:active:scale-100 mt-8"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Iniciando sesión...</span>
              </>
            ) : (
              <span>Iniciar sesión</span>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
