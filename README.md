## 🛠️ Instalación y Ejecución Local

Sigue estos pasos para correr el proyecto en tu máquina local para desarrollo o pruebas:

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/TU_USUARIO/classcar-frontend.git](https://github.com/TU_USUARIO/classcar-frontend.git)
   cd classcar-frontend
Instalar las dependencias:

Bash
npm install
Configurar las variables de entorno:
Crea un archivo llamado .env.local en la raíz del proyecto y añade las siguientes variables. Puedes apuntar el API_URL a tu backend local o directamente al que está en producción:

Fragmento de código
# URL del Backend (Usa localhost:3000/api si estás corriendo el backend localmente)
NEXT_PUBLIC_API_URL=[https://classcar-backend-production.up.railway.app/api](https://classcar-backend-production.up.railway.app/api)

# Contraseña temporal por defecto para nuevos usuarios
NEXT_PUBLIC_PASSWORD_DEFAULT=Autoescuela2026
Ejecutar el servidor de desarrollo:

Bash
npm run dev
Abrir la aplicación:
Abre tu navegador y entra a http://localhost:3000 (o http://localhost:3001 dependiendo del puerto que te asigne Next.js en la terminal).

📦 Scripts Disponibles
Dentro del directorio del proyecto, puedes ejecutar:

npm run dev: Ejecuta la aplicación en modo desarrollo.

npm run build: Compila la aplicación para producción de forma optimizada.

npm start: Inicia el servidor de Next.js con la versión de producción (requiere ejecutar build primero).

npm run lint: Ejecuta la herramienta de análisis de código para encontrar problemas.