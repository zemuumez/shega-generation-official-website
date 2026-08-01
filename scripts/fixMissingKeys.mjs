import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

try {
  const envPath = path.resolve(process.cwd(), ".env");
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
} catch (e) {
  console.warn("Could not load .env file manually:", e);
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "g8zdm74i";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error("Missing SANITY_WRITE_TOKEN in .env");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-06-01",
  useCdn: false,
});

async function fixKeys() {
  console.log("🛠️ Patching array _key values in Sanity CMS documents...");

  const defaultStats = [
    { _key: "stat_box_1", value: "500+", label: "Talented Geniuses Trained" },
    { _key: "stat_box_2", value: "100% Free", label: "Tuition Cost to Students" },
    { _key: "stat_box_3", value: "12+", label: "Summer & Annual Cohorts" },
    { _key: "stat_box_4", value: "15+", label: "Institutional Partners" },
  ];

  // 1. Fetch siteSettings and aboutPageSettings
  const docs = await client.fetch(`*[_type in ["siteSettings", "aboutPageSettings"]]`);

  for (const doc of docs) {
    let stats = doc.aboutHeroStats;
    if (Array.isArray(stats) && stats.length > 0) {
      const patchedStats = stats.map((item, idx) => ({
        ...item,
        _key: item._key || `stat_box_${idx + 1}_${Date.now()}`,
      }));
      await client.patch(doc._id).set({ aboutHeroStats: patchedStats }).commit();
      console.log(`  ✓ Patched keys for ${doc._type} (${doc._id})`);
    } else {
      await client.patch(doc._id).set({ aboutHeroStats: defaultStats }).commit();
      console.log(`  ✓ Added default stats with keys for ${doc._type} (${doc._id})`);
    }
  }

  console.log("✅ All missing array keys fixed successfully!");
}

fixKeys().catch((err) => {
  console.error("❌ Error fixing keys:", err);
  process.exit(1);
});
