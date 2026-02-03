"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceMin: number;
  priceMax: number;
  unit: "PER_BIRD" | "PER_KG";
  inStock: boolean;
  images: { id: string; imageUrl: string }[];
};

const initialState = {
  name: "",
  slug: "",
  description: "",
  priceMin: "",
  priceMax: "",
  unit: "PER_KG",
  inStock: true,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [formState, setFormState] = useState(initialState);
  const [files, setFiles] = useState<FileList | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function fetchProducts() {
    const response = await fetch("/api/admin/products");
    const data = await response.json();
    setProducts(data.products || []);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("saving");
    setError(null);

    const response = editingId
      ? await fetch("/api/admin/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...formState }),
        })
      : await fetch("/api/admin/products", {
          method: "POST",
          body: (() => {
            const body = new FormData();
            body.append("name", formState.name);
            body.append("slug", formState.slug);
            body.append("description", formState.description);
            body.append("priceMin", formState.priceMin);
            body.append("priceMax", formState.priceMax);
            body.append("unit", formState.unit);
            body.append("inStock", String(formState.inStock));
            if (files) {
              Array.from(files).forEach((file) => body.append("images", file));
            }
            return body;
          })(),
        });

    if (!response.ok) {
      const data = await response.json();
      setStatus("error");
      setError(data?.error || "Unable to save");
      return;
    }

    setStatus("idle");
    setFormState(initialState);
    setFiles(null);
    setEditingId(null);
    await fetchProducts();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    fetchProducts();
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900">Products</h2>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="rounded-2xl bg-white p-6 shadow-soft">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                  <p className="text-sm text-slate-600">{product.description}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {product.unit === "PER_KG" ? "Per kg" : "Per bird"} | {product.inStock ? "In stock" : "Limited"}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-xs font-semibold text-red-600"
                >
                  Delete
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-xs">
                <button
                  className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-700"
                  onClick={() => {
                    setEditingId(product.id);
                    setFormState({
                      name: product.name,
                      slug: product.slug,
                      description: product.description,
                      priceMin: String(product.priceMin),
                      priceMax: String(product.priceMax),
                      unit: product.unit,
                      inStock: product.inStock,
                    });
                  }}
                >
                  Edit Details
                </button>
                <button
                  className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-700"
                  onClick={() =>
                    fetch(`/api/admin/products`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id: product.id, ...product, inStock: !product.inStock }),
                    }).then(fetchProducts)
                  }
                >
                  Toggle Stock
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.images.map((image) => (
                  <span
                    key={image.id}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
                  >
                    {image.imageUrl}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-slate-900">
            {editingId ? "Edit Product" : "Add Product"}
          </h3>
          <div className="mt-4 space-y-3">
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              placeholder="Name"
              value={formState.name}
              onChange={(event) => setFormState({ ...formState, name: event.target.value })}
              required
            />
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              placeholder="Slug"
              value={formState.slug}
              onChange={(event) => setFormState({ ...formState, slug: event.target.value })}
              required
            />
            <textarea
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              rows={4}
              placeholder="Description"
              value={formState.description}
              onChange={(event) =>
                setFormState({ ...formState, description: event.target.value })
              }
              required
            />
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                placeholder="Price Min"
                type="number"
                value={formState.priceMin}
                onChange={(event) =>
                  setFormState({ ...formState, priceMin: event.target.value })
                }
                required
              />
              <input
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                placeholder="Price Max"
                type="number"
                value={formState.priceMax}
                onChange={(event) =>
                  setFormState({ ...formState, priceMax: event.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <select
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                value={formState.unit}
                onChange={(event) => setFormState({ ...formState, unit: event.target.value })}
              >
                <option value="PER_KG">Per kg</option>
                <option value="PER_BIRD">Per bird</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={formState.inStock}
                  onChange={(event) =>
                    setFormState({ ...formState, inStock: event.target.checked })
                  }
                />
                In stock
              </label>
            </div>
            <input
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={(event) => setFiles(event.target.files)}
            />
            {editingId && (
              <p className="text-xs text-slate-500">
                Images can be updated by creating a new product entry for now.
              </p>
            )}
            {status === "error" && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-full bg-farm-600 px-6 py-3 text-sm font-semibold text-white"
              disabled={status === "saving"}
            >
              {status === "saving" ? "Saving..." : editingId ? "Update Product" : "Save Product"}
            </button>
            {editingId && (
              <button
                type="button"
                className="w-full rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700"
                onClick={() => {
                  setEditingId(null);
                  setFormState(initialState);
                  setFiles(null);
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
