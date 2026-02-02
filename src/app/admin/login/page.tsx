"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/admin",
    });

    if (result?.error) {
      setError("Invalid credentials");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container flex min-h-screen items-center justify-center py-12">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-soft">
          <h1 className="text-2xl font-semibold text-slate-900">Admin Login</h1>
          <p className="mt-2 text-sm text-slate-600">Use your admin credentials.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <input
              type="password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-full bg-farm-600 px-6 py-3 text-sm font-semibold text-white"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
