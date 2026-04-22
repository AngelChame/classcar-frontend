export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <form>
        <header>
          <h1>ClassCar</h1>
          <p>Bienvenido de nuevo</p>
        </header>

        <fieldset>
          <div>
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required 
            />
          </div>

          <div>
            <label htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              required 
            />
          </div>
        </fieldset>

        <button type="submit">
          Ingresar
        </button>
      </form>
    </main>
  );
}
