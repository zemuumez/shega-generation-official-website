import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";
import https from "https";

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

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https
      .get(url, (response) => {
        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          return downloadFile(response.headers.location, destPath)
            .then(resolve)
            .catch(reject);
        }
        if (response.statusCode !== 200) {
          return reject(
            new Error(`Failed to download asset: HTTP ${response.statusCode}`)
          );
        }
        response.pipe(file);
        file.on("finish", () => {
          file.close(() => resolve(destPath));
        });
      })
      .on("error", (err) => {
        fs.unlink(destPath, () => reject(err));
      });
  });
}

async function exportBackup() {
  console.log("📦 Starting Sanity CMS Full Backup Export (Documents + Media Assets)...");
  console.log(`Project ID: ${projectId}, Dataset: ${dataset}`);

  try {
    // Fetch ALL documents in dataset including image assets
    const allDocs = await client.fetch('*[!(_type match "system.**")]');
    console.log(
      `\n✅ Fetched ${allDocs.length} total CMS documents from dataset "${dataset}".`
    );

    // Ensure backups directory exists
    const backupsDir = path.resolve(process.cwd(), "backups");
    const mediaDir = path.join(backupsDir, "media_assets");
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }
    if (!fs.existsSync(mediaDir)) {
      fs.mkdirSync(mediaDir, { recursive: true });
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

    console.log(`\n📄 Saved JSON Documents Backup:`);
    console.log(`  - Latest: ${filepathLatest}`);
    console.log(`  - Archive: ${filepathTimestamp}`);

    // Filter image assets with download URLs
    const imageAssets = allDocs.filter(
      (doc) => doc._type === "sanity.imageAsset" && doc.url
    );

    console.log(
      `\n🖼️  Downloading ${imageAssets.length} media assets into backups/media_assets/...`
    );

    let downloadedCount = 0;
    let failedCount = 0;

    for (let i = 0; i < imageAssets.length; i++) {
      const asset = imageAssets[i];
      const ext = asset.extension || "jpg";
      const cleanId = asset._id.replace(/^image-/, "");
      const assetFileName = `${cleanId}.${ext}`;
      const destPath = path.join(mediaDir, assetFileName);

      try {
        await downloadFile(asset.url, destPath);
        downloadedCount++;
        process.stdout.write(
          `  [${downloadedCount}/${imageAssets.length}] Downloaded ${assetFileName}\r`
        );
      } catch (err) {
        failedCount++;
        console.error(`\n  ❌ Error downloading asset ${asset._id}:`, err.message);
      }
    }

    console.log(
      `\n\n🎉 Full CMS Backup Completed Successfully!`
    );
    console.log(`--------------------------------------------------`);
    console.log(`1. Documents Backup JSON: ${filepathLatest}`);
    console.log(`2. Media Assets Directory: ${mediaDir}`);
    console.log(`   Total Images Downloaded: ${downloadedCount}`);
    if (failedCount > 0) {
      console.log(`   Failed Images: ${failedCount}`);
    }
    console.log(`--------------------------------------------------`);
    console.log(`You can copy or upload the whole 'backups/' directory directly to Google Drive!`);

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
