"use server";

import { prisma } from "@/lib/prisma";
import { setAdminSession, clearAdminSession } from "@/lib/session";
import { redirect } from "next/navigation";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "spie2024";

export async function adminLogin(formData: FormData) {
  const password = formData.get("password") as string;

  if (password !== ADMIN_PASSWORD) {
    return { error: "Contrasena incorrecta." };
  }

  await setAdminSession();
  redirect("/admin-panel");
}

export async function adminLogout() {
  await clearAdminSession();
  redirect("/admin-panel/login");
}

// ---- VOTERS ----

export async function createVoter(formData: FormData) {
  const nombre = (formData.get("nombre") as string)?.trim();
  const cedula = (formData.get("cedula") as string)?.trim();

  if (!nombre || !cedula) {
    return { error: "Nombre y cedula son obligatorios." };
  }

  const existing = await prisma.voter.findUnique({ where: { cedula } });
  if (existing) {
    return { error: "Ya existe un votante con esa cedula." };
  }

  await prisma.voter.create({ data: { nombre, cedula } });
  redirect("/admin-panel/voters");
}

export async function toggleVoterActive(voterId: number) {
  const voter = await prisma.voter.findUnique({ where: { id: voterId } });
  if (!voter) return { error: "Votante no encontrado." };

  await prisma.voter.update({
    where: { id: voterId },
    data: { active: !voter.active },
  });
  redirect("/admin-panel/voters");
}

export async function deleteVoter(voterId: number) {
  await prisma.voter.delete({ where: { id: voterId } });
  redirect("/admin-panel/voters");
}

// ---- ELECTIONS ----

export async function createElection(formData: FormData) {
  const titulo = (formData.get("titulo") as string)?.trim();
  const descripcion = (formData.get("descripcion") as string)?.trim() || "";
  const optionsRaw = (formData.get("options") as string)?.trim();

  if (!titulo) {
    return { error: "El titulo de la eleccion es obligatorio." };
  }

  const optionTexts = optionsRaw
    ? optionsRaw
        .split("\n")
        .map((o) => o.trim())
        .filter((o) => o.length > 0)
    : [];

  if (optionTexts.length < 2) {
    return { error: "Debe haber al menos 2 opciones." };
  }

  await prisma.election.create({
    data: {
      titulo,
      descripcion,
      options: {
        create: optionTexts.map((texto) => ({ texto })),
      },
    },
  });

  redirect("/admin-panel/elections");
}

export async function deleteElection(electionId: number) {
  await prisma.election.delete({ where: { id: electionId } });
  redirect("/admin-panel/elections");
}

// ---- DELEGATIONS ----

export async function createDelegation(formData: FormData) {
  const fromVoterId = parseInt(formData.get("fromVoterId") as string, 10);
  const toVoterId = parseInt(formData.get("toVoterId") as string, 10);

  if (!fromVoterId || !toVoterId) {
    return { error: "Ambos votantes son obligatorios." };
  }

  if (fromVoterId === toVoterId) {
    return { error: "Un votante no puede delegar a si mismo." };
  }

  const existingDelegation = await prisma.delegation.findUnique({
    where: { fromVoterId },
  });

  if (existingDelegation) {
    return { error: "Este votante ya tiene una delegacion activa." };
  }

  // Create delegation and deactivate the delegating voter (they can no longer vote directly)
  await prisma.$transaction([
    prisma.delegation.create({
      data: { fromVoterId, toVoterId },
    }),
    prisma.voter.update({
      where: { id: fromVoterId },
      data: { active: false },
    }),
  ]);

  redirect("/admin-panel/delegations");
}

export async function deleteDelegation(delegationId: number) {
  // Find the delegation to get the fromVoterId before deleting
  const delegation = await prisma.delegation.findUnique({
    where: { id: delegationId },
  });

  if (!delegation) return { error: "Delegacion no encontrada." };

  // Delete delegation and re-activate the voter
  await prisma.$transaction([
    prisma.delegation.delete({ where: { id: delegationId } }),
    prisma.voter.update({
      where: { id: delegation.fromVoterId },
      data: { active: true },
    }),
  ]);

  redirect("/admin-panel/delegations");
}
