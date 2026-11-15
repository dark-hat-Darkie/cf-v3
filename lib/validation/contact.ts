import { z } from "zod";

/**
 * Public contact form. Kept deliberately permissive on the optional choices
 * (project / budget). They come from a fixed UI list, so we only bound their
 * length rather than enumerate them, which would break the form silently if
 * the marketing copy ever changes.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please add your name").max(120, "That name is too long"),
  email: z.string().trim().email("Enter a valid email address").max(255),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more: a sentence or two is plenty")
    .max(5000, "Please keep it under 5,000 characters"),
  project: z.string().trim().max(80).optional().default(""),
  budget: z.string().trim().max(80).optional().default(""),
  source: z.string().trim().max(200).optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = "name" | "email" | "message";

export type ContactState = {
  status: "idle" | "success" | "error";
  /** Form-level message (shown on error). */
  message?: string;
  fieldErrors?: Partial<Record<ContactField, string>>;
  /** What the visitor typed, so a failed submit never clears the form. */
  values?: Partial<Record<ContactField | "project" | "budget", string>>;
};

export const CONTACT_INITIAL_STATE: ContactState = { status: "idle" };
