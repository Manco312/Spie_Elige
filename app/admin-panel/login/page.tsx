import { AdminLoginForm } from "@/components/admin-login-form";

export default function AdminLoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Panel de Administracion
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ingrese la contrasena de administrador
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
