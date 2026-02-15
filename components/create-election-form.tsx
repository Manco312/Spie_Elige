"use client";

import { useActionState } from "react";
import { createElection } from "@/lib/actions/admin-actions";

export function CreateElectionForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return await createElection(formData);
    },
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="titulo" className="text-sm font-medium text-foreground">
          Titulo
        </label>
        <input
          id="titulo"
          name="titulo"
          type="text"
          required
          placeholder="Titulo de la eleccion"
          className="rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="descripcion"
          className="text-sm font-medium text-foreground"
        >
          Descripcion (opcional)
        </label>
        <input
          id="descripcion"
          name="descripcion"
          type="text"
          placeholder="Descripcion breve"
          className="rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="options"
          className="text-sm font-medium text-foreground"
        >
          Opciones (una por linea, minimo 2)
        </label>
        <textarea
          id="options"
          name="options"
          required
          rows={4}
          placeholder={"Opcion 1\nOpcion 2\nOpcion 3"}
          className="rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {isPending ? "Creando..." : "Crear Eleccion"}
      </button>
    </form>
  );
}
