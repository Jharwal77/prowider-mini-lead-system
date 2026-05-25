import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const providers = await prisma.provider.findMany({
    include: {
      leadAssignments: {
        include: {
          lead: true,
        },
      },
    },
  });

  const formatted = providers.map((provider) => ({
    id: provider.id,
    name: provider.name,
    quotaRemaining:
      provider.monthlyQuota -
      provider.leadAssignments.length,
    leadsReceived:
      provider.leadAssignments.length,
    leads: provider.leadAssignments.map(
      (assignment) => assignment.lead
    ),
  }));

  return Response.json(formatted);
}