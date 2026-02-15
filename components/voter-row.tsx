"use client";

import { toggleVoterActive, deleteVoter } from "@/lib/actions/admin-actions";

interface VoterRowProps {
  voter: {
    id: number;
    nombre: string;
    cedula: string;
    active: boolean;
    delegatedOut: { toVoter: { nombre: string } } | null;
    delegatedIn: { id: number }[];
    votes: { id: number }[];
  };
}

export function VoterRow({ voter }: VoterRowProps) {
  return (
    <tr className="border-b border-border last:border-b-0">
      <td className="px-4 py-3 font-medium text-foreground">{voter.nombre}</td>
      <td className="px-4 py-3 text-muted-foreground">{voter.cedula}</td>
      <td className="px-4 py-3 text-center">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            voter.active
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {voter.active ? "Activo" : "Inactivo"}
        </span>
      </td>
      <td className="px-4 py-3 text-center text-sm text-muted-foreground">
        {voter.delegatedOut
          ? `Delego a ${voter.delegatedOut.toVoter.nombre}`
          : voter.delegatedIn.length > 0
            ? `Recibe ${voter.delegatedIn.length} delegacion(es)`
            : "-"}
      </td>
      <td className="px-4 py-3 text-center text-sm text-muted-foreground">
        {voter.votes.length}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => toggleVoterActive(voter.id)}
            className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
          >
            {voter.active ? "Desactivar" : "Activar"}
          </button>
          <button
            onClick={() => {
              if (confirm("Seguro que desea eliminar este votante?")) {
                deleteVoter(voter.id);
              }
            }}
            className="rounded-md border border-destructive px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}
