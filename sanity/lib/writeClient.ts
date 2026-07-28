import "server-only";
import { createClient } from "@sanity/client";

// This client is never imported by any client component or page render
// path. `server-only` throws a build error if that ever happens by
// mistake. It uses SANITY_WRITE_TOKEN, which must be scoped in the
// Sanity project dashboard to "create" permission on the
// studentApplication document type only, nothing else, so a compromised
// token can't be used to edit events, courses, or projects.
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "g8zdm74i";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-06-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});
