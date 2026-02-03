import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi } from "@/lib/admin";
import { gallerySchema } from "@/lib/validation";
import { saveUpload } from "@/lib/uploads";

export async function GET() {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const items = await prisma.galleryImage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());

  const parsed = gallerySchema.safeParse({
    title: data.title,
    category: data.category,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const file = formData.get("image") as File | null;
  if (!file) {
    return NextResponse.json({ error: "Image required" }, { status: 400 });
  }

  const imageUrl = await saveUpload(file);
  const item = await prisma.galleryImage.create({
    data: {
      ...parsed.data,
      imageUrl,
    },
  });

  return NextResponse.json({ item });
}

export async function DELETE(request: Request) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await prisma.galleryImage.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const body = await request.json();
  const { id, ...payload } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const parsed = gallerySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const item = await prisma.galleryImage.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json({ item });
}
