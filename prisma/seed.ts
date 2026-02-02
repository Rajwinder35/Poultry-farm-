import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set");
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash },
  });

  const standardProduct = await prisma.product.upsert({
    where: { slug: "live-hens-standard" },
    update: {},
    create: {
      name: "Live Hens (Standard)",
      slug: "live-hens-standard",
      description:
        "Fresh farm-raised hens ready for your kitchen. Ideal for daily family cooking.",
      priceMin: 420,
      priceMax: 520,
      unit: "PER_KG",
      inStock: true,
      images: {
        create: [
          {
            imageUrl: "/uploads/placeholder-hens.svg",
          },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "live-hens-bulk" },
    update: {},
    create: {
      name: "Live Hens (Bulk/Wholesale)",
      slug: "live-hens-bulk",
      description:
        "Bulk orders for retailers and events with steady supply and fair pricing.",
      priceMin: 380,
      priceMax: 470,
      unit: "PER_KG",
      inStock: true,
      images: {
        create: [
          {
            imageUrl: "/uploads/placeholder-bulk.svg",
          },
        ],
      },
    },
  });

  const gallerySeed = [
    { title: "Clean farm area", category: "Farm", imageUrl: "/uploads/placeholder-farm.svg" },
    { title: "Healthy hens", category: "Hens", imageUrl: "/uploads/placeholder-hens.svg" },
    { title: "Feed and care", category: "Farm", imageUrl: "/uploads/placeholder-feed.svg" },
    { title: "Safe handling", category: "Packaging/Handling", imageUrl: "/uploads/placeholder-handling.svg" },
    { title: "Sorted selection", category: "Hens", imageUrl: "/uploads/placeholder-selection.svg" },
    { title: "Packed orders", category: "Packaging/Handling", imageUrl: "/uploads/placeholder-packaging.svg" },
  ];

  for (const item of gallerySeed) {
    await prisma.galleryImage.upsert({
      where: { imageUrl: item.imageUrl },
      update: {},
      create: item,
    });
  }

  await prisma.product.update({
    where: { id: standardProduct.id },
    data: { inStock: true },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
