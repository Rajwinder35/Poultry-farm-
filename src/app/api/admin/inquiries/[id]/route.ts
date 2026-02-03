import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi } from "@/lib/admin";
import { inquiryStatusSchema } from "@/lib/validation";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const body = await request.json();
  const parsed = inquiryStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const inquiry = await prisma.inquiry.update({
    where: { id: params.id },
    data: {
      status: parsed.data.status,
      internalNote: parsed.data.internalNote || null,
    },
  });

  return NextResponse.json({ inquiry });
}
