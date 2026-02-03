import Image from "next/image";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gallery | Chahal Farm",
  description: "Farm, hens, and handling gallery.",
};

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-semibold text-slate-900">Gallery</h1>
      <p className="mt-2 text-sm text-slate-600">
        Farm, hens, and packaging/handling photos.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {images.map((image) => (
          <div key={image.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <Image
              src={image.imageUrl}
              alt={image.title}
              width={360}
              height={240}
              className="h-48 w-full rounded-xl object-cover"
            />
            <div className="mt-3">
              <p className="text-sm font-semibold text-slate-800">{image.title}</p>
              <p className="text-xs text-slate-500">{image.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
