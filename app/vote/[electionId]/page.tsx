import { redirect } from "next/navigation";
import { getVoterSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { VoteForm } from "@/components/vote-form";

interface VotePageProps {
  params: Promise<{ electionId: string }>;
}

export default async function VotePage({ params }: VotePageProps) {
  const { electionId: rawId } = await params;
  const electionId = parseInt(rawId, 10);
  const voterId = await getVoterSession();
  if (!voterId) redirect("/");

  const voter = await prisma.voter.findUnique({
    where: { id: voterId },
    include: { delegatedOut: true },
  });

  if (!voter) redirect("/");

  // If voter has delegated, redirect to dashboard
  if (voter.delegatedOut) redirect("/dashboard");

  const election = await prisma.election.findUnique({
    where: { id: electionId },
    include: { options: true },
  });

  if (!election) redirect("/dashboard");

  // Check if already voted
  const existingVote = await prisma.vote.findFirst({
    where: { voterId: voter.id, electionId },
  });

  if (existingVote) redirect("/dashboard");

  const delegationsToMe = await prisma.delegation.count({
    where: { toVoterId: voter.id },
  });

  const voteWeight = 1 + delegationsToMe;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">
          {election.titulo}
        </h2>
        {election.descripcion && (
          <p className="mt-2 text-muted-foreground">{election.descripcion}</p>
        )}
        {voteWeight > 1 && (
          <p className="mt-2 text-sm text-primary font-medium">
            Tu voto tiene peso {voteWeight}
          </p>
        )}
      </div>

      <VoteForm
        voterId={voter.id}
        electionId={election.id}
        options={election.options}
      />
    </div>
  );
}
