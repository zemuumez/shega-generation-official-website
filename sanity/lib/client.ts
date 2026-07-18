import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";

// Read path uses the CDN-cached, read-only API. There is no write token
// anywhere near this file, on purpose: the browser and server render path
// must never be able to mutate content. Mutations only happen through
// /api/onboarding/apply, using a separate write token that is never
// exposed to this client.
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-06-01",
  useCdn: true,
  perspective: "published",
});

const builder = imageUrlBuilder(sanityClient);

/**
 * Returns a CDN image URL, or the local placeholder if no image has been
 * uploaded yet. This is what lets every page ship today with dummy
 * imagery and switch to real photos the moment someone drops an asset
 * into Sanity Studio, no code change required.
 */
export function safeImageUrl(source: Image | undefined | null, width = 800): string {
  if (!source?.asset) return "/placeholder.svg";
  try {
    return builder.image(source).width(width).auto("format").url();
  } catch {
    return "/placeholder.svg";
  }
}

/**
 * Fetch wrapper that never throws into a React Server Component.
 * If the Sanity project isn't configured yet (e.g. local dev before the
 * studio exists), pages fall back to `fallback` instead of crashing the
 * build. Remove the fallback path once the dataset is live.
 */
export async function safeFetch<T>(query: string, params: Record<string, unknown> = {}, fallback: T): Promise<T> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return fallback;
  try {
    const data = await sanityClient.fetch<T>(query, params, { cache: "no-store" });
    return data ?? fallback;
  } catch (err) {
    console.error("Sanity fetch failed, using fallback data:", err);
    return fallback;
  }
}
