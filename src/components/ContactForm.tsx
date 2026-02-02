"use client";

import { useState } from "react";

const defaultState = {
  name: "",
  phone: "",
  email: "",
  message: "",
};

export default function ContactForm() {
  const [formData, setFormData] = useState(defaultState);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    try {
      const response = await fetch("/api/inquiries/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error || "Unable to submit");
      }

      setStatus("sent");
      setFormData(defaultState);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
          placeholder="Your name"
          value={formData.name}
          onChange={(event) => setFormData({ ...formData, name: event.target.value })}
          required
        />
        <input
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
          placeholder="Phone number"
          value={formData.phone}
          onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
          required
        />
      </div>
      <input
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
        placeholder="Email (optional)"
        value={formData.email}
        onChange={(event) => setFormData({ ...formData, email: event.target.value })}
      />
      <textarea
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
        rows={4}
        placeholder="Message"
        value={formData.message}
        onChange={(event) => setFormData({ ...formData, message: event.target.value })}
        required
      />
      {status === "error" && <p className="text-sm text-red-600">{error}</p>}
      {status === "sent" && (
        <p className="text-sm text-farm-700">Thanks! We will contact you soon.</p>
      )}
      <button
        type="submit"
        className="rounded-full bg-farm-600 px-6 py-3 text-sm font-semibold text-white"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
