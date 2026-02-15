"use client";

import { useActionState } from "react";
import { createVoter } from "@/lib/actions/admin-actions";

export function AddVoterForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return await createVoter(formData);
    },
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex flex-1 flex-col gap-2">
        <label htmlFor="nombre" className="text-sm font-medium text-foreground">
          Nombre
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          placeholder="Nombre completo"
          className="rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <label htmlFor="cedula" className="text-sm font-medium text-foreground">
          Cedula
        </label>
        <input
          id="cedula"
          name="cedula"
          type="text"
          required
          placeholder="Numero de cedula"
          className="rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="flex flex-col gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {isPending ? "Agregando..." : "Agregar"}
        </button>
        {state?.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}
      </div>
    </form>
  );
}
