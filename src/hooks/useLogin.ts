import { useState } from "react";
import { useRouter } from "next/navigation";

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

    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (email === "demo@classcar.com" && password === "123456") {
      router.push("/");
    } else {
      setGlobalError("Las credenciales ingresadas son incorrectas.");
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
