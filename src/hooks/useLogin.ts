import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export function useLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isEmailTouched, setIsEmailTouched] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const validateEmail = (val: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(val);
  };

  const handleEmailBlur = () => {
    setIsEmailTouched(true);
    if (!email) {
      setEmailError("El correo es requerido");
    } else if (!validateEmail(email)) {
      setEmailError("Formato de correo inválido");
    } else {
      setEmailError("");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setGlobalError("");

    if (isEmailTouched) {
      if (!e.target.value) {
        setEmailError("El correo es requerido");
      } else if (!validateEmail(e.target.value)) {
        setEmailError("Formato de correo inválido");
      } else {
        setEmailError("");
      }
    }
  };

  const handlePasswordBlur = () => {
    setIsPasswordTouched(true);
    if (!password) {
      setPasswordError("La contraseña es requerida");
    } else if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
    } else {
      setPasswordError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    setGlobalError("");

    if (isPasswordTouched) {
      if (!val) {
        setPasswordError("La contraseña es requerida");
      } else if (val.length < 6) {
        setPasswordError("La contraseña debe tener al menos 6 caracteres");
      } else {
        setPasswordError("");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const isFormValid = email !== "" && emailError === "" && password !== "" && passwordError === "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    setGlobalError("");

    try {
      // 1. Petición real al backend
      const response = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ correo: email, contrasena: password }),
      });

      // 2. Extraer de forma segura leyendo EXACTAMENTE lo que dice Postman
      const tokenReal = response.data?.accessToken;
      const usuarioReal = response.data?.usuario;

      if (!tokenReal || !usuarioReal) {
        throw new Error("El servidor no devolvió las credenciales correctamente.");
      }

      // 3. Guardar en localStorage
      localStorage.setItem("token", tokenReal);
      localStorage.setItem("usuario", JSON.stringify(usuarioReal));

      // 4. Lógica de redirección por contraseña temporal
      const passwordPorDefecto = process.env.NEXT_PUBLIC_PASSWORD_DEFAULT || "Autoescuela2026";
      
      if (password.startsWith("TMP_") || password === passwordPorDefecto) {
        router.push("/cambiar-password");
        return;
      }

      // 5. Redirección basada en el rol de la base de datos
      const rol = usuarioReal.rol;
      if (rol === "admin") {
        router.push("/admin");
      } else if (rol === "instructor") {
        router.push("/instructor");
      } else {
        router.push("/alumno");
      }

    } catch (error: any) {
      setGlobalError(error.message || "Error al intentar iniciar sesión. Verifica tus credenciales.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
}