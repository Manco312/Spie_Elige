import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { CreateDelegationForm } from "@/components/create-delegation-form";
import { DelegationRow } from "@/components/delegation-row";
import Link from "next/link";

export default async function AdminDelegationsPage() {
  const isAdmin = await getAdminSession();
  if (!isAdmin) redirect("/admin-panel/login");

  const [delegations, activeVoters] = await Promise.all([
    prisma.delegation.findMany({
      include: {
        fromVoter: true,
        toVoter: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.voter.findMany({
      where: { active: true },
      orderBy: { nombre: "asc" },
    }),
  ]);

  // Voters who have NOT already delegated (available as "from")
  const delegatedFromIds = new Set(delegations.map((d) => d.fromVoterId));
  const availableFrom = activeVoters.filter((v) => !delegatedFromIds.has(v.id));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin-panel"
          className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          {"<- Volver"}
        </Link>
        <h2 className="text-2xl font-bold text-foreground">
          Gestionar Delegaciones
        </h2>
      </div>

      <div className="mb-8 rounded-lg border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Crear Delegacion
        </h3>
        <CreateDelegationForm
          availableFrom={availableFrom}
          activeVoters={activeVoters}
        />
      </div>

      <div className="rounded-lg border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Delega (desde)
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Recibe (hacia)
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Fecha
                </th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {delegations.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No hay delegaciones registradas.
                  </td>
                </tr>
              ) : (
                delegations.map((delegation) => (
                  <DelegationRow key={delegation.id} delegation={delegation} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Total: {delegations.length} delegacion
        {delegations.length !== 1 ? "es" : ""}
      </p>
    </div>
  );
}
