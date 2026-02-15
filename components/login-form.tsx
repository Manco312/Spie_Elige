"use client";

import { useActionState } from "react";
import { loginVoter } from "@/lib/actions/voter-actions";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return await loginVoter(formData);
    },
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="cedula"
          className="text-sm font-medium text-foreground"
        >
          Cedula
        </label>
        <input
          id="cedula"
          name="cedula"
          type="text"
          required
          placeholder="Ingrese su numero de cedula"
          className="rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {isPending ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
