"use client";

import { deleteDelegation } from "@/lib/actions/admin-actions";

interface DelegationRowProps {
  delegation: {
    id: number;
    createdAt: Date;
    fromVoter: { nombre: string; cedula: string };
    toVoter: { nombre: string; cedula: string };
  };
}

export function DelegationRow({ delegation }: DelegationRowProps) {
  return (
    <tr className="border-b border-border last:border-b-0">
      <td className="px-4 py-3">
        <span className="font-medium text-foreground">
          {delegation.fromVoter.nombre}
        </span>
        <span className="ml-2 text-muted-foreground text-xs">
          ({delegation.fromVoter.cedula})
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="font-medium text-foreground">
          {delegation.toVoter.nombre}
        </span>
        <span className="ml-2 text-muted-foreground text-xs">
          ({delegation.toVoter.cedula})
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        {new Date(delegation.createdAt).toLocaleDateString("es-VE")}
      </td>
      <td className="px-4 py-3 text-right">
        <button
          onClick={() => {
            if (confirm("Seguro que desea eliminar esta delegacion?")) {
              deleteDelegation(delegation.id);
            }
          }}
          className="rounded-md border border-destructive px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
}
