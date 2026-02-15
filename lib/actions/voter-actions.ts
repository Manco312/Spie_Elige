"use server";

import { prisma } from "@/lib/prisma";
import { setVoterSession, clearVoterSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function loginVoter(formData: FormData) {
  const cedula = formData.get("cedula") as string;

  if (!cedula || cedula.trim() === "") {
    return { error: "Debe ingresar su cedula." };
  }

  const voter = await prisma.voter.findUnique({
    where: { cedula: cedula.trim() },
  });

  if (!voter) {
    return { error: "Cedula no encontrada en el sistema." };
  }

  if (!voter.active) {
    return { error: "Su cuenta se encuentra inactiva." };
  }

  await setVoterSession(voter.id);
  redirect("/dashboard");
}

export async function logoutVoter() {
  await clearVoterSession();
  redirect("/");
}

export async function castVote(formData: FormData) {
  const voterId = parseInt(formData.get("voterId") as string, 10);
  const electionId = parseInt(formData.get("electionId") as string, 10);
  const optionId = parseInt(formData.get("optionId") as string, 10);

  if (!voterId || !electionId || !optionId) {
    return { error: "Datos de voto incompletos." };
  }

  // Check if already voted in this election
  const existingVote = await prisma.vote.findFirst({
    where: { voterId, electionId },
  });

  if (existingVote) {
    return { error: "Ya has votado en esta eleccion." };
  }

  // Check delegation: how many people delegated to this voter
  const delegationsToMe = await prisma.delegation.count({
    where: { toVoterId: voterId },
  });

  const weight = 1 + delegationsToMe;

  await prisma.vote.create({
    data: {
      voterId,
      electionId,
      optionId,
      weight,
    },
  });

  redirect("/dashboard");
}
