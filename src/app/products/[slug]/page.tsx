import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPriceRange } from "@/lib/utils";
import OrderForm from "@/components/OrderForm";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: `${product.name} | Chahal Farm`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { images: true },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="container py-12">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <Image
            src={product.images[0]?.imageUrl || "/uploads/placeholder-hens.svg"}
            alt={product.name}
            width={600}
            height={420}
            className="h-auto w-full rounded-2xl object-cover"
          />
          <div className="mt-6 space-y-3">
            <h1 className="text-2xl font-semibold text-slate-900">{product.name}</h1>
            <p className="text-sm text-slate-600">{product.description}</p>
            <p className="text-sm font-semibold text-farm-700">
              {formatPriceRange(product.priceMin, product.priceMax, product.unit)}
            </p>
            <p className="text-xs text-slate-500">
              Status: {product.inStock ? "Available today" : "Limited availability"}
            </p>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Request Order/Quote</h2>
          <p className="mt-2 text-sm text-slate-600">
            Share your requirements and we will confirm pricing and availability.
          </p>
          <div className="mt-6">
            <OrderForm productSlug={product.slug} />
          </div>
        </div>
      </div>
    </div>
  );
}
