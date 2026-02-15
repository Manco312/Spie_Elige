"use client";

import { deleteElection } from "@/lib/actions/admin-actions";

interface ElectionCardProps {
  election: {
    id: number;
    titulo: string;
    descripcion: string;
    fechaCreacion: Date;
    options: { id: number; texto: string }[];
    votes: { id: number }[];
  };
}

export function ElectionCard({ election }: ElectionCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-semibold text-foreground">{election.titulo}</h4>
          {election.descripcion && (
            <p className="mt-1 text-sm text-muted-foreground">
              {election.descripcion}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {election.options.map((option) => (
              <span
                key={option.id}
                className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
              >
                {option.texto}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {election.votes.length} voto{election.votes.length !== 1 ? "s" : ""}{" "}
            emitido{election.votes.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => {
            if (
              confirm(
                "Seguro que desea eliminar esta eleccion? Se eliminaran todos los votos asociados."
              )
            ) {
              deleteElection(election.id);
            }
          }}
          className="rounded-md border border-destructive px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors whitespace-nowrap"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
