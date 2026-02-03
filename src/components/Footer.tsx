import { formatPhoneLink } from "@/lib/utils";

const phone = "+1 (778) 251-5267";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50">
      <div className="container grid gap-6 py-10 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold text-farm-700">Chahal Farm</h3>
          <p className="mt-2 text-sm text-slate-600">
            Fresh, healthy hens for your kitchen and retail needs.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Contact</h4>
          <p className="mt-2 text-sm text-slate-600">{phone}</p>
          <p className="text-sm text-slate-600">Village Bassowal, District Ludhiana</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Quick Actions</h4>
          <div className="mt-2 flex flex-col gap-2 text-sm">
            <a
              className="text-farm-700 hover:text-farm-800"
              href={formatPhoneLink(phone)}
            >
              Call Now
            </a>
            <a
              className="text-farm-700 hover:text-farm-800"
              href="/contact"
            >
              Request Order
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Chahal Farm. All rights reserved.
      </div>
    </footer>
  );
}
