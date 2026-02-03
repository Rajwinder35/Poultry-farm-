import ContactForm from "@/components/ContactForm";
import { formatPhoneLink } from "@/lib/utils";

export const metadata = {
  title: "Contact | Chahal Farm",
  description: "Contact Chahal Farm for orders and inquiries.",
};

const phone = "+1 (778) 251-5267";

export default function ContactPage() {
  return (
    <div className="container py-12">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Contact Us</h1>
          <p className="mt-2 text-sm text-slate-600">
            Call or WhatsApp for quick orders. We will respond fast.
          </p>
          <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-800">Phone</p>
            <p className="mt-2 text-sm text-slate-600">{phone}</p>
            <p className="mt-4 text-sm font-semibold text-slate-800">Address</p>
            <p className="mt-2 text-sm text-slate-600">
              Village Bassowal, District Ludhiana, Punjab
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href={formatPhoneLink(phone)}
                className="rounded-full bg-farm-600 px-5 py-2 text-sm font-semibold text-white"
              >
                Call Now
              </a>
              <a
                href="https://wa.me/17782515267"
                className="rounded-full border border-farm-600 px-5 py-2 text-sm font-semibold text-farm-700"
              >
                WhatsApp
              </a>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
            Map placeholder (embed available on request).
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Send an Inquiry</h2>
          <p className="mt-2 text-sm text-slate-600">
            Share your question or order details.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
