import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

// Simple .env parser using Node fs
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

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-06-01",
  useCdn: false,
});

async function exportBackup() {
  console.log("📦 Starting Sanity CMS Full Backup Export...");
  console.log(`Project ID: ${projectId}, Dataset: ${dataset}`);

  try {
    // Fetch ALL documents in dataset
    const allDocs = await client.fetch('*[!(_type match "system.**")]');
    console.log(`\n✅ Fetched ${allDocs.length} total CMS documents from dataset "${dataset}".`);

    // Ensure backups directory exists
    const backupsDir = path.resolve(process.cwd(), "backups");
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filenameWithTimestamp = `sanity-backup-${timestamp}.json`;
    const filepathTimestamp = path.join(backupsDir, filenameWithTimestamp);
    const filepathLatest = path.join(backupsDir, "sanity-backup-latest.json");

    const payload = JSON.stringify(
      {
        exportTimestamp: new Date().toISOString(),
        projectId,
        dataset,
        totalDocuments: allDocs.length,
        documents: allDocs,
      },
      null,
      2
    );

    fs.writeFileSync(filepathTimestamp, payload, "utf8");
    fs.writeFileSync(filepathLatest, payload, "utf8");

    console.log(`\n🎉 CMS Backup Successfully Exported!`);
    console.log(`--------------------------------------------------`);
    console.log(`1. Timestamp Backup File: ${filepathTimestamp}`);
    console.log(`2. Latest Backup Pointer: ${filepathLatest}`);
    console.log(`--------------------------------------------------`);
    console.log(`You can download or save this file to Google Drive anytime.`);

    // Summary of document counts by type
    const countsByType = allDocs.reduce((acc, doc) => {
      acc[doc._type] = (acc[doc._type] || 0) + 1;
      return acc;
    }, {});

    console.log("\n📊 Document Breakdown by Type:");
    Object.entries(countsByType).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count} document(s)`);
    });
  } catch (err) {
    console.error("❌ Export Backup Failed:", err);
    process.exit(1);
  }
}

exportBackup();
