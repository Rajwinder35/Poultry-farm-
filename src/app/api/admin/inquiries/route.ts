import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi } from "@/lib/admin";

export async function GET(request: Request) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const items = await prisma.inquiry.findMany({
    where: status && status !== "ALL" ? { status: status as "NEW" | "RESOLVED" } : {},
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ items });
}
