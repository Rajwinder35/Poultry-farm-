import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productCount, galleryCount, inquiryCount, newCount] = await Promise.all([
    prisma.product.count(),
    prisma.galleryImage.count(),
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "NEW" } }),
  ]);

  const cards = [
    { label: "Products", value: productCount },
    { label: "Gallery Images", value: galleryCount },
    { label: "All Inquiries", value: inquiryCount },
    { label: "New Inquiries", value: newCount },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl bg-white p-6 shadow-soft">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
