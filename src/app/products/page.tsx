import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { formatPriceRange } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Products | Chahal Farm",
  description: "View our live hens for retail and bulk orders.",
};

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: { images: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Products</h1>
          <p className="mt-2 text-sm text-slate-600">
            Live hens for chicken/meat with retail and wholesale options.
          </p>
        </div>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-soft"
          >
            <div className="flex items-center gap-4">
              <Image
                src={product.images[0]?.imageUrl || "/uploads/placeholder-hens.svg"}
                alt={product.name}
                width={120}
                height={120}
                className="h-24 w-24 rounded-xl object-cover"
              />
              <div>
                <h2 className="text-lg font-semibold text-slate-800">{product.name}</h2>
                <p className="mt-1 text-sm text-slate-600">
                  {formatPriceRange(product.priceMin, product.priceMax, product.unit)}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {product.inStock ? "Available" : "Limited"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
