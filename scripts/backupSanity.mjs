import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read env file if present
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) {
  console.error("❌ Error: NEXT_PUBLIC_SANITY_PROJECT_ID environment variable is missing.");
  process.exit(1);
}

console.log(`📦 Starting backup for Sanity project [${projectId}], dataset [${dataset}]...`);

const client = createClient({
  projectId,
  dataset,
  token,
  useCdn: false,
  apiVersion: "2024-06-01",
});

async function runBackup() {
  try {
    // Fetch all published documents in dataset
    const documents = await client.fetch(`*[]`);
    console.log(`✅ Successfully fetched ${documents.length} document(s) from Sanity.`);

    // Group document counts by type
    const counts = {};
    for (const doc of documents) {
      const type = doc._type || "unknown";
      counts[type] = (counts[type] || 0) + 1;
    }

    console.log("\n📊 Document Breakdown:");
    console.table(counts);

    // Prepare backups directory
    const backupDir = path.resolve(__dirname, "../backups");
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Format timestamp YYYY-MM-DD-HHmmss
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const backupFilePath = path.join(backupDir, `sanity-backup-${timestamp}.json`);

    const backupPayload = {
      meta: {
        exportedAt: now.toISOString(),
        projectId,
        dataset,
        totalDocuments: documents.length,
        breakdown: counts,
      },
      documents,
    };

    fs.writeFileSync(backupFilePath, JSON.stringify(backupPayload, null, 2), "utf-8");

    const stats = fs.statSync(backupFilePath);
    const sizeInKB = (stats.size / 1024).toFixed(2);

    console.log(`\n🎉 Backup snapshot created successfully!`);
    console.log(`📁 File location: ${backupFilePath}`);
    console.log(`💾 Size: ${sizeInKB} KB`);
  } catch (err) {
    console.error("❌ Backup failed:", err);
    process.exit(1);
  }
}

runBackup();
