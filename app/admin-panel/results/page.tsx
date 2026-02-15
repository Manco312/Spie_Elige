import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminResultsPage() {
  const isAdmin = await getAdminSession();
  if (!isAdmin) redirect("/admin-panel/login");

  const elections = await prisma.election.findMany({
    include: {
      options: {
        include: {
          votes: true,
        },
      },
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
          Resultados de Elecciones
        </h2>
      </div>

      {elections.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">
            No hay elecciones para mostrar resultados.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {elections.map((election) => {
            const totalWeight = election.votes.reduce(
              (sum, v) => sum + v.weight,
              0
            );

            const optionResults = election.options.map((option) => {
              const optionWeight = option.votes.reduce(
                (sum, v) => sum + v.weight,
                0
              );
              const voteCount = option.votes.length;
              const percentage =
                totalWeight > 0
                  ? Math.round((optionWeight / totalWeight) * 100)
                  : 0;
              return {
                ...option,
                optionWeight,
                voteCount,
                percentage,
              };
            });

            optionResults.sort((a, b) => b.optionWeight - a.optionWeight);

            const maxWeight = Math.max(
              ...optionResults.map((o) => o.optionWeight),
              1
            );

            return (
              <div
                key={election.id}
                className="rounded-lg border border-border bg-card p-6"
              >
                <h3 className="text-lg font-semibold text-foreground">
                  {election.titulo}
                </h3>
                {election.descripcion && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {election.descripcion}
                  </p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  {election.votes.length} voto
                  {election.votes.length !== 1 ? "s" : ""} emitido
                  {election.votes.length !== 1 ? "s" : ""} — Peso total:{" "}
                  {totalWeight}
                </p>

                <div className="mt-4 flex flex-col gap-3">
                  {optionResults.map((option, index) => (
                    <div key={option.id}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span
                          className={`font-medium ${index === 0 && option.optionWeight > 0 ? "text-primary" : "text-foreground"}`}
                        >
                          {option.texto}
                          {index === 0 && option.optionWeight > 0 && (
                            <span className="ml-2 text-xs font-normal text-primary">
                              (Lider)
                            </span>
                          )}
                        </span>
                        <span className="text-muted-foreground">
                          {option.optionWeight} peso
                          {option.optionWeight !== 1 ? "s" : ""} (
                          {option.voteCount} voto
                          {option.voteCount !== 1 ? "s" : ""}) —{" "}
                          {option.percentage}%
                        </span>
                      </div>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all ${index === 0 && option.optionWeight > 0 ? "bg-primary" : "bg-muted-foreground/30"}`}
                          style={{
                            width: `${maxWeight > 0 ? (option.optionWeight / maxWeight) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {election.votes.length === 0 && (
                  <p className="mt-4 text-center text-sm text-muted-foreground">
                    Aun no se han emitido votos en esta eleccion.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
