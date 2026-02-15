import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { AddVoterForm } from "@/components/add-voter-form";
import { VoterRow } from "@/components/voter-row";
import Link from "next/link";

export default async function AdminVotersPage() {
  const isAdmin = await getAdminSession();
  if (!isAdmin) redirect("/admin-panel/login");

  const voters = await prisma.voter.findMany({
    include: {
      delegatedOut: { include: { toVoter: true } },
      delegatedIn: true,
      votes: true,
    },
    orderBy: { createdAt: "desc" },
  });

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
          Gestionar Votantes
        </h2>
      </div>

      <div className="mb-8 rounded-lg border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Agregar Votante
        </h3>
        <AddVoterForm />
      </div>

      <div className="rounded-lg border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Cedula
                </th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">
                  Estado
                </th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">
                  Delegacion
                </th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">
                  Votos
                </th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {voters.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No hay votantes registrados.
                  </td>
                </tr>
              ) : (
                voters.map((voter) => (
                  <VoterRow key={voter.id} voter={voter} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Total: {voters.length} votante{voters.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
