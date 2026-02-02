import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi } from "@/lib/admin";
import { productSchema } from "@/lib/validation";
import { saveUpload } from "@/lib/uploads";

export async function GET() {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const products = await prisma.product.findMany({
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());

  const parsed = productSchema.safeParse({
    name: data.name,
    slug: data.slug,
    description: data.description,
    priceMin: data.priceMin,
    priceMax: data.priceMax,
    unit: data.unit,
    inStock: data.inStock,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const images = formData.getAll("images") as File[];
  const imageUrls: string[] = [];

  for (const file of images) {
    if (file && file.size > 0) {
      const url = await saveUpload(file);
      imageUrls.push(url);
    }
  }

  const product = await prisma.product.create({
    data: {
      ...parsed.data,
      images: {
        create: imageUrls.map((imageUrl) => ({ imageUrl })),
      },
    },
  });

  return NextResponse.json({ product });
}

export async function PUT(request: Request) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const body = await request.json();
  const { id, ...data } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const parsed = productSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const product = await prisma.product.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json({ product });
}

export async function DELETE(request: Request) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
