/** Choices offered on the contact form. Shared by the form and the server action. */

export const PROJECT_TYPES = [
  'Web development',
  'Mobile app',
  'UI / UX design',
  'Brand & motion',
  'WebGL / 3D',
  'E-commerce',
  'Not sure yet',
] as const;

export const BUDGETS = ['< $10K', '$10K–$25K', '$25K–$75K', '$75K+', "Let's discuss"] as const;

/** Service slug (from `lib/services-data.ts`) → the project type to preselect. */
const SERVICE_TO_PROJECT: Record<string, (typeof PROJECT_TYPES)[number]> = {
  'web-development': 'Web development',
  'mobile-apps': 'Mobile app',
  'ui-ux-design': 'UI / UX design',
  'brand-motion': 'Brand & motion',
  'webgl-3d': 'WebGL / 3D',
  ecommerce: 'E-commerce',
};

export function projectForService(slug: string | undefined | null): string {
  return (slug && SERVICE_TO_PROJECT[slug]) || '';
}
