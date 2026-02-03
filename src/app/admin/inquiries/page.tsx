"use client";

import { useEffect, useState } from "react";

type Inquiry = {
  id: string;
  type: "CONTACT" | "ORDER";
  name: string;
  phone: string;
  email?: string;
  message: string;
  orderType?: "RETAIL" | "BULK";
  quantity?: string;
  deliveryPreference?: "PICKUP" | "DELIVERY";
  preferredDate?: string;
  status: "NEW" | "RESOLVED";
  internalNote?: string;
  createdAt: string;
};

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState<"ALL" | "NEW" | "RESOLVED">("ALL");
  const [notes, setNotes] = useState<Record<string, string>>({});

  async function fetchInquiries() {
    const response = await fetch(`/api/admin/inquiries?status=${filter}`);
    const data = await response.json();
    setItems(data.items || []);
  }

  useEffect(() => {
    fetchInquiries();
  }, [filter]);

  async function updateInquiry(id: string, status: "NEW" | "RESOLVED") {
    await fetch(`/api/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, internalNote: notes[id] }),
    });
    fetchInquiries();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-slate-900">Inquiries</h2>
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value as "ALL" | "NEW" | "RESOLVED")}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm"
        >
          <option value="ALL">All</option>
          <option value="NEW">New</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl bg-white p-6 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {item.type} • {item.status}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() =>
                  updateInquiry(item.id, item.status === "NEW" ? "RESOLVED" : "NEW")
                }
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700"
              >
                Mark {item.status === "NEW" ? "Resolved" : "New"}
              </button>
            </div>
            <div className="mt-4 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-slate-800">Name:</span> {item.name}
              </p>
              <p>
                <span className="font-semibold text-slate-800">Phone:</span> {item.phone}
              </p>
              {item.email && (
                <p>
                  <span className="font-semibold text-slate-800">Email:</span> {item.email}
                </p>
              )}
              <p className="mt-2">{item.message}</p>
              {item.type === "ORDER" && (
                <div className="mt-3 text-xs text-slate-500">
                  <p>Order type: {item.orderType}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Delivery: {item.deliveryPreference}</p>
                  {item.preferredDate && <p>Preferred date: {item.preferredDate}</p>}
                </div>
              )}
              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-700">Internal note</p>
                <textarea
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  rows={2}
                  placeholder="Add a note for this inquiry"
                  value={notes[item.id] ?? item.internalNote ?? ""}
                  onChange={(event) =>
                    setNotes((prev) => ({ ...prev, [item.id]: event.target.value }))
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
