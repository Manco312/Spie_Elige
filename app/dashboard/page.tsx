import { redirect } from "next/navigation";
import { getVoterSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { logoutVoter } from "@/lib/actions/voter-actions";
import Link from "next/link";

export default async function DashboardPage() {
  const voterId = await getVoterSession();
  if (!voterId) redirect("/");

  const voter = await prisma.voter.findUnique({
    where: { id: voterId },
    include: {
      delegatedOut: {
        include: { toVoter: true },
      },
    },
  });

  if (!voter) redirect("/");

  const elections = await prisma.election.findMany({
    include: {
      options: true,
      votes: {
        where: { voterId: voter.id },
      },
    },
    orderBy: { fechaCreacion: "desc" },
  });

  const delegationsToMe = await prisma.delegation.count({
    where: { toVoterId: voter.id },
  });

  const voteWeight = 1 + delegationsToMe;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Hola, {voter.nombre}
          </h2>
          <p className="text-sm text-muted-foreground">
            Cedula: {voter.cedula}
          </p>
        </div>
        <form action={logoutVoter}>
          <button
            type="submit"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Salir
          </button>
        </form>
      </div>

      {voter.delegatedOut && (
        <div className="mb-6 rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            Has delegado tu voto a{" "}
            <span className="font-semibold text-foreground">
              {voter.delegatedOut.toVoter.nombre}
            </span>
          </p>
        </div>
      )}

      {voteWeight > 1 && (
        <div className="mb-6 rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            Tu voto tiene un peso de{" "}
            <span className="font-semibold text-primary">{voteWeight}</span>{" "}
            (incluye {delegationsToMe} delegacion
            {delegationsToMe > 1 ? "es" : ""})
          </p>
        </div>
      )}

      <h3 className="mb-4 text-lg font-semibold text-foreground">
        Elecciones Disponibles
      </h3>

      {elections.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">
            No hay elecciones disponibles en este momento.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {elections.map((election) => {
            const hasVoted = election.votes.length > 0;
            const votedOption = hasVoted
              ? election.options.find(
                  (o) => o.id === election.votes[0].optionId
                )
              : null;

            return (
              <div
                key={election.id}
                className="rounded-lg border border-border bg-card p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">
                      {election.titulo}
                    </h4>
                    {election.descripcion && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {election.descripcion}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-muted-foreground">
                      {election.options.length} opciones
                    </p>
                  </div>
                  <div>
                    {hasVoted ? (
                      <span className="inline-flex items-center rounded-md bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                        Votaste: {votedOption?.texto}
                      </span>
                    ) : voter.delegatedOut ? (
                      <span className="inline-flex items-center rounded-md bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                        Voto delegado
                      </span>
                    ) : (
                      <Link
                        href={`/vote/${election.id}`}
                        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        Votar
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
