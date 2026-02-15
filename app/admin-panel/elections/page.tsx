import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { CreateElectionForm } from "@/components/create-election-form";
import { ElectionCard } from "@/components/election-card";
import Link from "next/link";

export default async function AdminElectionsPage() {
  const isAdmin = await getAdminSession();
  if (!isAdmin) redirect("/admin-panel/login");

  const elections = await prisma.election.findMany({
    include: {
      options: true,
      votes: true,
    },
    orderBy: { fechaCreacion: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin-panel"
          className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          {"<- Volver"}
        </Link>
        <h2 className="text-2xl font-bold text-foreground">
          Gestionar Elecciones
        </h2>
      </div>

      <div className="mb-8 rounded-lg border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Crear Eleccion
        </h3>
        <CreateElectionForm />
      </div>

      <h3 className="mb-4 text-lg font-semibold text-foreground">
        Elecciones Existentes
      </h3>

      {elections.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">
            No hay elecciones creadas todavia.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {elections.map((election) => (
            <ElectionCard key={election.id} election={election} />
          ))}
        </div>
      )}
    </div>
  );
}
