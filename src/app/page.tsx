import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { formatPriceRange } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const product = await prisma.product.findFirst({
    include: { images: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <section className="bg-gradient-to-br from-farm-50 via-white to-farm-100">
        <div className="container grid items-center gap-8 py-16 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-farm-600">Chahal Farm</p>
            <h1 className="mt-3 text-4xl font-bold text-slate-900 md:text-5xl">
              Fresh, Healthy Hens for Your Kitchen
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Retail and small wholesale orders with clean, hygienic handling in Village
              Bassowal, Punjab.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href="tel:+17782515267"
                className="rounded-full bg-farm-600 px-6 py-3 text-sm font-semibold text-white shadow-soft"
              >
                Call Now
              </a>
              <Link
                href="/contact"
                className="rounded-full border border-farm-600 px-6 py-3 text-sm font-semibold text-farm-700"
              >
                Request Order
              </Link>
            </div>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <Image
              src="/uploads/placeholder-farm.svg"
              alt="Chahal Farm"
              width={520}
              height={360}
              className="h-auto w-full rounded-2xl object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="container py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Quality Hens",
              text: "Farm-raised hens with steady feed and care.",
            },
            {
              title: "Hygienic Handling",
              text: "Clean, safe, and careful packing for every order.",
            },
            {
              title: "Local Trust",
              text: "Serving families and retailers across Ludhiana.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-12">
        <div className="container grid items-center gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Featured Product</h2>
            <p className="mt-3 text-slate-600">
              Live hens ready for chicken/meat with fair pricing and availability.
            </p>
            {product && (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800">{product.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{product.description}</p>
                <p className="mt-4 text-sm font-semibold text-farm-700">
                  {formatPriceRange(product.priceMin, product.priceMax, product.unit)}
                </p>
                <div className="mt-4 flex gap-3">
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-sm font-semibold text-farm-700"
                  >
                    View Details
                  </Link>
                  <Link href="/contact" className="text-sm font-semibold text-slate-600">
                    Request Order
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-soft">
            <Image
              src={product?.images?.[0]?.imageUrl || "/uploads/placeholder-hens.svg"}
              alt="Featured hens"
              width={520}
              height={360}
              className="h-auto w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      <section className="container py-12">
        <h2 className="text-2xl font-semibold text-slate-900">Customer Reviews</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[
            "Clean and healthy hens every time.",
            "Good pricing and polite service.",
            "Easy bulk orders for our shop.",
          ].map((review, index) => (
            <div key={review} className="rounded-2xl border border-slate-100 p-6 shadow-sm">
              <p className="text-sm text-slate-600">“{review}”</p>
              <p className="mt-4 text-xs font-semibold text-slate-800">Customer {index + 1}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
