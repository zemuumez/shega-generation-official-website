import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

function loadEnv(filename) {
  try {
    const envPath = path.resolve(process.cwd(), filename);
    if (fs.existsSync(envPath)) {
      const envFile = fs.readFileSync(envPath, "utf8");
      envFile.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const [key, ...valueParts] = trimmed.split("=");
          if (key && valueParts.length > 0) {
            process.env[key.trim()] = valueParts.join("=").trim();
          }
        }
      });
    }
  } catch (e) {}
}

loadEnv(".env");
loadEnv(".env.local");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "g8zdm74i";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN || process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error("❌ Error: SANITY_API_TOKEN or SANITY_WRITE_TOKEN is missing in environment variables.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

async function cleanup() {
  console.log("🧹 Cleaning up dummy non-members from Sanity CMS...");
  
  // Specific IDs to delete
  const idsToDelete = [
    "team-member-dawit",
    "team-member-bethlehem",
    "team-member-yonas",
    "team-member-kaleb",
    "drafts.team-member-dawit",
    "drafts.team-member-bethlehem",
    "drafts.team-member-yonas",
    "drafts.team-member-kaleb",
  ];

  for (const id of idsToDelete) {
    try {
      await client.delete(id);
      console.log(`  ✓ Deleted document by ID: ${id}`);
    } catch (err) {
      // Ignore if document not found
    }
  }

  // Also query by name pattern
  const nonMembers = await client.fetch(
    `*[_type == "teamMember" && (
      name match "Dawit*" || name match "Bethlehem*" || name match "Yonas*" || name match "Kaleb*" ||
      englishName match "Dawit*" || englishName match "Bethlehem*" || englishName match "Yonas*" || englishName match "Kaleb*"
    )]{ _id, name }`
  );

  for (const doc of nonMembers) {
    try {
      await client.delete(doc._id);
      console.log(`  ✓ Deleted non-member document: ${doc.name} (${doc._id})`);
      if (!doc._id.startsWith("drafts.")) {
        await client.delete(`drafts.${doc._id}`).catch(() => {});
      }
    } catch (err) {
      console.error(`  ❌ Failed to delete ${doc._id}:`, err.message);
    }
  }

  console.log("✨ Cleanup completed successfully! Only official organization members remain in Sanity CMS.");
}

cleanup().catch(console.error);
