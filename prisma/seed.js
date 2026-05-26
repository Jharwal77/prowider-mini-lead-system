// import dotenv from "dotenv";
// import { PrismaClient } from "@prisma/client";

// dotenv.config();

// const prisma = new PrismaClient({
//   datasourceUrl: process.env.DATABASE_URL,
// });

// async function main() {
//   await prisma.service.createMany({
//     data: [
//       { id: 1, name: "Service 1" },
//       { id: 2, name: "Service 2" },
//       { id: 3, name: "Service 3" },
//     ],
//     skipDuplicates: true,
//   });

//   await prisma.provider.createMany({
//     data: Array.from({ length: 8 }, (_, i) => ({
//       id: i + 1,
//       name: `Provider ${i + 1}`,
//       monthlyQuota: 10,
//     })),
//     skipDuplicates: true,
//   });

//   await prisma.allocationState.createMany({
//     data: [
//       { serviceId: 1, lastIndex: 0 },
//       { serviceId: 2, lastIndex: 0 },
//       { serviceId: 3, lastIndex: 0 },
//     ],
//     skipDuplicates: true,
//   });

//   console.log("Seed completed");
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

console.log("DATABASE_URL:");
console.log(process.env.DATABASE_URL);

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  await prisma.service.createMany({
    data: [
      { id: 1, name: "Service 1" },
      { id: 2, name: "Service 2" },
      { id: 3, name: "Service 3" },
    ],
    skipDuplicates: true,
  });

  await prisma.provider.createMany({
    data: Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: `Provider ${i + 1}`,
      monthlyQuota: 10,
    })),
    skipDuplicates: true,
  });

  await prisma.allocationState.createMany({
    data: [
      { serviceId: 1, lastIndex: 0 },
      { serviceId: 2, lastIndex: 0 },
      { serviceId: 3, lastIndex: 0 },
    ],
    skipDuplicates: true,
  });

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });