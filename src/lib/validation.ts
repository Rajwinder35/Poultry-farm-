import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().min(5),
});

export const orderSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  orderType: z.enum(["RETAIL", "BULK"]),
  quantity: z.string().min(1),
  deliveryPreference: z.enum(["PICKUP", "DELIVERY"]),
  preferredDate: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  priceMin: z.coerce.number().int().min(0),
  priceMax: z.coerce.number().int().min(0),
  unit: z.enum(["PER_BIRD", "PER_KG"]),
  inStock: z.coerce.boolean(),
});

export const gallerySchema = z.object({
  title: z.string().min(2),
  category: z.string().min(2),
});

export const inquiryStatusSchema = z.object({
  status: z.enum(["NEW", "RESOLVED"]),
  internalNote: z.string().optional().or(z.literal("")),
});
