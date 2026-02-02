import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validation";
import { sendInquiryEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rateLimit";

function getClientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  const key = `contact-${getClientKey(request)}`;
  const rate = checkRateLimit(key, 5, 60_000);

  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const data = parsed.data;

  const inquiry = await prisma.inquiry.create({
    data: {
      type: "CONTACT",
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      message: data.message,
    },
  });

  await sendInquiryEmail(
    `New Contact Inquiry from ${data.name}`,
    `Name: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email || "-"}\nMessage: ${data.message}`
  );

  return NextResponse.json({ success: true, inquiryId: inquiry.id });
}
