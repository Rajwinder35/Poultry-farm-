import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdminSession } from "@/lib/auth-helpers";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="container flex flex-wrap items-center justify-between gap-4 py-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Chahal Farm Admin</h1>
            <p className="text-xs text-slate-500">Signed in as {session.user?.email}</p>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm text-slate-600">
            <Link href="/admin">Dashboard</Link>
            <Link href="/admin/products">Products</Link>
            <Link href="/admin/gallery">Gallery</Link>
            <Link href="/admin/inquiries">Inquiries</Link>
          </nav>
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  );
}
