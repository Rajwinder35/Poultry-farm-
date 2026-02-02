"use client";

import { useEffect, useState } from "react";

type GalleryItem = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
};

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchGallery() {
    const response = await fetch("/api/admin/gallery");
    const data = await response.json();
    setItems(data.items || []);
  }

  useEffect(() => {
    fetchGallery();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!file) {
      setError("Please select an image");
      return;
    }

    const body = new FormData();
    body.append("title", title);
    body.append("category", category);
    body.append("image", file);

    const response = await fetch("/api/admin/gallery", {
      method: "POST",
      body,
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data?.error || "Unable to upload");
      return;
    }

    setTitle("");
    setCategory("");
    setFile(null);
    fetchGallery();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
    fetchGallery();
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900">Gallery</h2>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl bg-white p-6 shadow-soft">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.category}</p>
                  <p className="text-xs text-slate-400">{item.imageUrl}</p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-xs font-semibold text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-slate-900">Add Image</h3>
          <div className="mt-4 space-y-3">
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              placeholder="Title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              placeholder="Category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              required
            />
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
              required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-full bg-farm-600 px-6 py-3 text-sm font-semibold text-white"
            >
              Upload Image
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
