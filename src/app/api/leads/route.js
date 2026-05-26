// import { PrismaClient } from "@prisma/client";
// import { broadcast } from "../../../lib/sse";

// const prisma = new PrismaClient();

// const mandatoryProviders = {
//   1: [1],
//   2: [5],
//   3: [1, 4],
// };

// const providerPools = {
//   1: [2, 3, 4],
//   2: [6, 7, 8],
//   3: [2, 3, 5, 6, 7, 8],
// };

// export async function POST(req) {
//   try {
//     const body = await req.json();

//     const result = await prisma.$transaction(
//       async (tx) => {
//         const lead = await tx.lead.create({
//           data: {
//             name: body.name,
//             phone: body.phone,
//             city: body.city,
//             description: body.description,
//             serviceId: Number(body.serviceId),
//           },
//         });

//         const serviceId = Number(body.serviceId);

//         const assignedProviders = new Set();

//         const mandatory = mandatoryProviders[serviceId] || [];

//         // Mandatory providers
//         for (const providerId of mandatory) {
//           const count = await tx.leadAssignment.count({
//             where: { providerId },
//           });

//           if (count < 10) {
//             await tx.leadAssignment.create({
//               data: {
//                 leadId: lead.id,
//                 providerId,
//               },
//             });

//             assignedProviders.add(providerId);
//           }
//         }

//         // Round robin allocation
//         const allocation = await tx.allocationState.findUnique({
//           where: { serviceId },
//         });

//         const pool = providerPools[serviceId];

//         let index = allocation?.lastIndex || 0;

//         while (assignedProviders.size < 3) {
//           const providerId = pool[index % pool.length];

//           index++;

//           if (assignedProviders.has(providerId)) {
//             continue;
//           }

//           const count = await tx.leadAssignment.count({
//             where: { providerId },
//           });

//           if (count >= 10) {
//             continue;
//           }

//           await tx.leadAssignment.create({
//             data: {
//               leadId: lead.id,
//               providerId,
//             },
//           });

//           assignedProviders.add(providerId);
//         }

//         await tx.allocationState.update({
//           where: { serviceId },
//           data: {
//             lastIndex: index,
//           },
//         });

//         // Realtime update
//         try {
//           broadcast({
//             type: "NEW_LEAD",
//             leadId: lead.id,
//           });
//         } catch (err) {
//           console.error("Broadcast failed:", err);
//         }

//         return lead;
//       },
//       {
//         timeout: 60000,
//         maxWait: 60000,
//       }
//     );

//     return Response.json(result);
//   } catch (error) {
//     console.error(error);

//     // Duplicate lead
//     if (error.code === "P2002") {
//       return Response.json(
//         { error: "Duplicate lead for same service" },
//         { status: 400 }
//       );
//     }

//     // Transaction timeout
//     if (error.code === "P2028") {
//       return Response.json(
//         { error: "System busy. Please retry request." },
//         { status: 503 }
//       );
//     }

//     return Response.json(
//       { error: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }





import { PrismaClient } from "@prisma/client";
import { broadcast } from "../../../lib/sse";

const prisma = new PrismaClient();

/*
  IMPORTANT:
  Make sure these provider IDs actually exist
  in your Provider table.
*/

const mandatoryProviders = {
  1: [1],
  2: [5],
  3: [1, 4],
};

const providerPools = {
  1: [2, 3, 4],
  2: [6, 7, 8],
  3: [2, 3, 5, 6, 7, 8],
};

export async function POST(req) {
  try {
    const body = await req.json();

    const result = await prisma.$transaction(
      async (tx) => {
        // Create lead
        const lead = await tx.lead.create({
          data: {
            name: body.name,
            phone: body.phone,
            city: body.city,
            description: body.description,
            serviceId: Number(body.serviceId),
          },
        });

        const serviceId = Number(body.serviceId);

        const assignedProviders = new Set();

        // Get configs
        const mandatory = mandatoryProviders[serviceId] || [];
        const pool = providerPools[serviceId] || [];

        // =========================
        // Mandatory Providers
        // =========================

        for (const providerId of mandatory) {
          // Check provider exists
          const provider = await tx.provider.findUnique({
            where: {
              id: providerId,
            },
          });

          if (!provider) {
            console.log(`Provider ${providerId} not found`);
            continue;
          }

          // Count assignments
          const count = await tx.leadAssignment.count({
            where: {
              providerId,
            },
          });

          // Skip if provider full
          if (count >= 10) {
            continue;
          }

          // Create assignment
          await tx.leadAssignment.create({
            data: {
              leadId: lead.id,
              providerId,
            },
          });

          assignedProviders.add(providerId);
        }

        // =========================
        // Round Robin Allocation
        // =========================

        const allocation = await tx.allocationState.findUnique({
          where: {
            serviceId,
          },
        });

        let index = allocation?.lastIndex || 0;

        let attempts = 0;
        const maxAttempts = pool.length * 3;

        while (
          assignedProviders.size < 3 &&
          attempts < maxAttempts
        ) {
          attempts++;

          if (pool.length === 0) {
            break;
          }

          const providerId = pool[index % pool.length];

          index++;

          // Skip duplicates
          if (assignedProviders.has(providerId)) {
            continue;
          }

          // Check provider exists
          const provider = await tx.provider.findUnique({
            where: {
              id: providerId,
            },
          });

          if (!provider) {
            console.log(`Provider ${providerId} not found`);
            continue;
          }

          // Count assignments
          const count = await tx.leadAssignment.count({
            where: {
              providerId,
            },
          });

          // Skip full providers
          if (count >= 10) {
            continue;
          }

          // Create assignment
          await tx.leadAssignment.create({
            data: {
              leadId: lead.id,
              providerId,
            },
          });

          assignedProviders.add(providerId);
        }

        // =========================
        // Save Round Robin State
        // =========================

        await tx.allocationState.upsert({
          where: {
            serviceId,
          },
          update: {
            lastIndex: index,
          },
          create: {
            serviceId,
            lastIndex: index,
          },
        });

        // =========================
        // Realtime Broadcast
        // =========================

        try {
          broadcast({
            type: "NEW_LEAD",
            leadId: lead.id,
          });
        } catch (err) {
          console.error("Broadcast failed:", err);
        }

        return {
          success: true,
          lead,
          assignedProviders: [...assignedProviders],
        };
      },
      {
        timeout: 60000,
        maxWait: 60000,
      }
    );

    return Response.json(result);
  } catch (error) {
  if (error.code !== "P2002") {
    console.error(error);
  }

    // Duplicate lead
    if (error.code === "P2002") {
  return Response.json(
    {
      success: false,
      message:
        "You already submitted a request for this service.",
    },
    {
      status: 400,
    }
  );
}

    // Foreign key issue
    if (error.code === "P2003") {
      return Response.json(
        {
          error: "Invalid provider assignment",
        },
        {
          status: 400,
        }
      );
    }

    // Transaction timeout
    if (error.code === "P2028") {
      return Response.json(
        {
          error: "System busy. Please retry request.",
        },
        {
          status: 503,
        }
      );
    }

    return Response.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}