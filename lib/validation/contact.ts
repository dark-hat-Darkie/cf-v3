import { z } from "zod";

/**
 * Public contact form ("Send brief"). Kept deliberately permissive on the
 * optional chips (project / budget) — they come from a fixed UI list, so we
 * only bound their length rather than enumerate them, which would break the
 * form silently if the marketing copy ever changes.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please add your name").max(120),
  email: z.string().trim().email("Enter a valid email address").max(255),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more — a sentence or two is plenty")
    .max(5000),
  project: z.string().trim().max(80).optional().default(""),
  budget: z.string().trim().max(80).optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;
