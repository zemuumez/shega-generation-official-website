import { z } from "zod";

export const InitializePaymentSchema = z.object({
  donorName: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  donorEmail: z.string().trim().email("Please enter a valid email address").max(254),
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than zero")
    .max(1000000, "Amount exceeds single payment limit"),
  currency: z.enum(["ETB", "USD"]),
  paymentMethod: z.string().trim().min(1, "Payment method is required").max(60),
  isAnonymous: z.boolean().optional().default(false),
  message: z.string().trim().max(1000).optional().default(""),
  // Honeypot field for bot protection
  website: z.string().max(0, "Bot detected").optional().default(""),
});

export type InitializePaymentInput = z.infer<typeof InitializePaymentSchema>;

export const VerifyPaymentSchema = z.object({
  txRef: z.string().trim().min(1, "Transaction reference is required"),
  gateway: z.enum(["chapa", "stripe", "demo"]).optional(),
});

export type VerifyPaymentInput = z.infer<typeof VerifyPaymentSchema>;
