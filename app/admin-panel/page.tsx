import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { adminLogout } from "@/lib/actions/admin-actions";
import Link from "next/link";

export default async function AdminPanelPage() {
  const isAdmin = await getAdminSession();
  if (!isAdmin) redirect("/admin-panel/login");

  const [voterCount, electionCount, delegationCount, voteCount] =
    await Promise.all([
      prisma.voter.count(),
      prisma.election.count(),
      prisma.delegation.count(),
      prisma.vote.count(),
    ]);

  const stats = [
    {
      label: "Votantes",
      value: voterCount,
      href: "/admin-panel/voters",
    },
    {
      label: "Elecciones",
      value: electionCount,
      href: "/admin-panel/elections",
    },
    {
      label: "Delegaciones",
      value: delegationCount,
      href: "/admin-panel/delegations",
    },
    {
      label: "Votos emitidos",
      value: voteCount,
      href: "/admin-panel/results",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Panel de Administracion
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona el sistema de votaciones SPIE Elige
          </p>
        </div>
        <form action={adminLogout}>
          <button
            type="submit"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Cerrar Sesion
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/50"
          >
            <p className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {stat.value}
            </p>
            <p className="mt-3 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              {"Gestionar ->"}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-foreground">
          Acciones rapidas
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin-panel/voters"
            className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Gestionar Votantes
          </Link>
          <Link
            href="/admin-panel/elections"
            className="rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            Gestionar Elecciones
          </Link>
          <Link
            href="/admin-panel/delegations"
            className="rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            Gestionar Delegaciones
          </Link>
          <Link
            href="/admin-panel/results"
            className="rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            Ver Resultados
          </Link>
        </div>
      </div>
    </div>
  );
}
