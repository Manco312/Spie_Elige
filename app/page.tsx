import { LoginForm } from "@/components/login-form";

export default function LandingPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground text-balance">
            Bienvenido a SPIE Elige
          </h2>
          <p className="mt-2 text-muted-foreground">
            Ingrese su cedula para acceder al sistema de votaciones
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
