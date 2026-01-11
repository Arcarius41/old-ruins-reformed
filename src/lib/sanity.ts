import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET;

// Fail loudly if env vars are missing.
// This prevents "it worked in dev but not in preview/prod" mysteries.
if (!projectId || !dataset) {
  // Keep the message very explicit and actionable.
  throw new Error(
    [
      "Missing Sanity environment variables.",
      "Make sure these are set before running build/preview:",
      "  VITE_SANITY_PROJECT_ID",
      "  VITE_SANITY_DATASET",
      "",
      "If you just added/edited .env/.env.local, restart the dev server and rebuild.",
    ].join("\n")
  );
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  // For now: no CDN so content updates show immediately while testing
  useCdn: false,
});

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
