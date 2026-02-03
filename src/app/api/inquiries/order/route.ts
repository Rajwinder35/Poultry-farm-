import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { orderSchema } from "@/lib/validation";
import { sendInquiryEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rateLimit";

function getClientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  const key = `order-${getClientKey(request)}`;
  const rate = checkRateLimit(key, 5, 60_000);

  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = orderSchema.safeParse(body);
  const productSlug = typeof body.productSlug === "string" ? body.productSlug : null;

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const data = parsed.data;

  const messageNote = [data.notes || "Order inquiry", productSlug ? `Product: ${productSlug}` : null]
    .filter(Boolean)
    .join(" | ");

  const inquiry = await prisma.inquiry.create({
    data: {
      type: "ORDER",
      name: data.name,
      phone: data.phone,
      message: messageNote,
      orderType: data.orderType,
      quantity: data.quantity,
      deliveryPreference: data.deliveryPreference,
      preferredDate: data.preferredDate || null,
    },
  });

  await sendInquiryEmail(
    `New Order Request from ${data.name}`,
    `Name: ${data.name}\nPhone: ${data.phone}\nOrder type: ${data.orderType}\nQuantity: ${data.quantity}\nDelivery: ${data.deliveryPreference}\nPreferred date: ${data.preferredDate || "-"}\nProduct: ${productSlug || "-"}\nNotes: ${data.notes || "-"}`
  );

  return NextResponse.json({ success: true, inquiryId: inquiry.id });
}
