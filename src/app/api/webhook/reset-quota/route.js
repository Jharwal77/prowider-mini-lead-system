import { prisma } from "../../../../lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();

    const idempotencyKey =
      body.idempotencyKey;

    // Validation
    if (!idempotencyKey) {
      return Response.json(
        {
          success: false,
          message:
            "Missing idempotency key",
        },
        {
          status: 400,
        }
      );
    }

    try {
      await prisma.$transaction(
        async (tx) => {
          // Create webhook event
          // Will fail automatically if duplicate
          await tx.webhookEvent.create({
            data: {
              idempotencyKey,
            },
          });

          // Reset quotas
          await tx.provider.updateMany({
            data: {
              monthlyQuota: 10,
            },
          });
        }
      );
    } catch (error) {
      // Duplicate webhook event
      if (error.code === "P2002") {
        return Response.json({
          success: true,
          message:
            "Webhook already processed",
        });
      }

      throw error;
    }

    return Response.json({
      success: true,
      message:
        "Provider quotas reset successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Webhook failed",
      },
      {
        status: 500,
      }
    );
  }
}