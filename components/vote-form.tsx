"use client";

import { useActionState, useState } from "react";
import { castVote } from "@/lib/actions/voter-actions";
import Link from "next/link";

interface Option {
  id: number;
  texto: string;
}

interface VoteFormProps {
  voterId: number;
  electionId: number;
  options: Option[];
}

export function VoteForm({ voterId, electionId, options }: VoteFormProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return await castVote(formData);
    },
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="voterId" value={voterId} />
      <input type="hidden" name="electionId" value={electionId} />
      <input type="hidden" name="optionId" value={selectedOption ?? ""} />

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-sm font-medium text-foreground">
          Selecciona una opcion:
        </legend>
        {options.map((option) => (
          <label
            key={option.id}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
              selectedOption === option.id
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary/50"
            }`}
          >
            <input
              type="radio"
              name="optionRadio"
              value={option.id}
              checked={selectedOption === option.id}
              onChange={() => setSelectedOption(option.id)}
              className="h-4 w-4 accent-[hsl(var(--primary))]"
            />
            <span className="text-sm font-medium text-foreground">
              {option.texto}
            </span>
          </label>
        ))}
      </fieldset>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending || selectedOption === null}
          className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isPending ? "Enviando..." : "Confirmar Voto"}
        </button>
        <Link
          href="/dashboard"
          className="rounded-md border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
