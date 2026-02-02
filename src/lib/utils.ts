export function formatPriceRange(min: number, max: number, unit: "PER_BIRD" | "PER_KG") {
  const unitLabel = unit === "PER_BIRD" ? "per bird" : "per kg";
  return `₹${min} - ₹${max} ${unitLabel}`;
}

export function formatPhoneLink(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
