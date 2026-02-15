"use client";

import { useActionState } from "react";
import { createDelegation } from "@/lib/actions/admin-actions";

interface Voter {
  id: number;
  nombre: string;
  cedula: string;
}

interface CreateDelegationFormProps {
  availableFrom: Voter[];
  activeVoters: Voter[];
}

export function CreateDelegationForm({
  availableFrom,
  activeVoters,
}: CreateDelegationFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return await createDelegation(formData);
    },
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex flex-1 flex-col gap-2">
        <label
          htmlFor="fromVoterId"
          className="text-sm font-medium text-foreground"
        >
          Delega (desde)
        </label>
        <select
          id="fromVoterId"
          name="fromVoterId"
          required
          className="rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Seleccionar votante...</option>
          {availableFrom.map((voter) => (
            <option key={voter.id} value={voter.id}>
              {voter.nombre} ({voter.cedula})
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <label
          htmlFor="toVoterId"
          className="text-sm font-medium text-foreground"
        >
          Recibe (hacia)
        </label>
        <select
          id="toVoterId"
          name="toVoterId"
          required
          className="rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Seleccionar votante...</option>
          {activeVoters.map((voter) => (
            <option key={voter.id} value={voter.id}>
              {voter.nombre} ({voter.cedula})
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {isPending ? "Creando..." : "Crear Delegacion"}
        </button>
        {state?.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}
      </div>
    </form>
  );
}
