export const metadata = {
  title: "About Chahal Farm",
  description: "Learn about our farm story, hygiene, and values.",
};

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold text-slate-900">Our Farm Story</h1>
        <p className="mt-4 text-base text-slate-600">
          Chahal Farm is a family-run poultry farm in Village Bassowal, District Ludhiana.
          We focus on healthy hens, clean handling, and fair prices for families and
          retailers.
        </p>
        <p className="mt-4 text-base text-slate-600">
          We believe in steady feed, careful monitoring, and respectful customer service so
          that every order is fresh and reliable.
        </p>
        <ul className="mt-6 space-y-3 text-sm text-slate-700">
          <li>• Fresh daily supply for retail and small wholesale.</li>
          <li>• Fair pricing with clear per kg/per bird rates.</li>
          <li>• Trusted locally for hygiene and honest service.</li>
        </ul>
      </div>
    </div>
  );
}
