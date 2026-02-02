import { formatPhoneLink } from "@/lib/utils";

const phone = "+1 (778) 251-5267";

export default function CallNowButton() {
  return (
    <a
      href={formatPhoneLink(phone)}
      className="fixed bottom-4 left-4 right-4 z-40 rounded-full bg-farm-600 py-3 text-center text-sm font-semibold text-white shadow-soft md:hidden"
    >
      Call Now
    </a>
  );
}
