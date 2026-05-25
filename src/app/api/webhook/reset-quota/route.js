import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();

    const idempotencyKey = body.idempotencyKey;

    // Check if webhook already processed
    const existing = await prisma.webhookEvent.findUnique({
      where: {
        idempotencyKey,
      },
    });

    if (existing) {
      return Response.json({
        message: "Webhook already processed",
      });
    }

    // Save webhook event
    await prisma.webhookEvent.create({
      data: {
        idempotencyKey,
      },
    });

    // Reset provider quotas
    await prisma.provider.updateMany({
      data: {
        monthlyQuota: 10,
      },
    });

    return Response.json({
      success: true,
      message: "Provider quotas reset successfully",
    });
  } catch (err) {
    console.error(err);

    return Response.json(
      { error: "Webhook failed" },
      { status: 500 }
    );
  }
}