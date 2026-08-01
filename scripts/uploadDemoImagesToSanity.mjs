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

// Helper to download an image from URL into a Buffer
function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetchBuffer(res.headers.location).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`Failed to fetch image: HTTP status ${res.statusCode}`));
        }
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

const milestoneImageUrls = {
  "story-milestone-1": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800",
  "story-milestone-2": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
  "story-milestone-3": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
  "story-milestone-4": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800",
  "story-milestone-5": "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
  "story-milestone-6": "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800",
  "story-milestone-7": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
};

const teamAvatarUrls = {
  "team-member-1": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
  "team-member-2": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
  "team-member-3": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
  "team-member-4": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
  "team-member-5": "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=600",
  "team-member-6": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600",
};

async function uploadAssetsAndLink() {
  console.log("🚀 Starting Sanity Image Asset Upload...");

  // 1. Upload Milestone Images
  console.log("\n📸 Uploading Story Milestone Images to Sanity Asset Store...");
  for (const [docId, url] of Object.entries(milestoneImageUrls)) {
    try {
      const existingDoc = await client.getDocument(docId);
      if (existingDoc?.image?.asset?._ref) {
        console.log(`  ⏩ Skipping ${docId}: Custom CMS image already exists (${existingDoc.image.asset._ref})`);
        continue;
      }

      console.log(`  Downloading image for ${docId}...`);
      const buffer = await fetchBuffer(url);
      console.log(`  Uploading asset for ${docId} to Sanity...`);
      const asset = await client.assets.upload("image", buffer, {
        filename: `${docId}.jpg`,
      });
      console.log(`  ✓ Created Sanity Asset: ${asset._id}`);

      console.log(`  Updating document ${docId} with asset reference...`);
      await client
        .patch(docId)
        .set({
          image: {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: asset._id,
            },
          },
        })
        .commit();
      console.log(`  ✓ Linked image to ${docId}`);
    } catch (err) {
      console.error(`  ❌ Error processing ${docId}:`, err.message);
    }
  }

  // 2. Upload Team Member Avatars
  console.log("\n👤 Uploading Team Member Profile Photos to Sanity Asset Store...");
  for (const [docId, url] of Object.entries(teamAvatarUrls)) {
    try {
      const existingDoc = await client.getDocument(docId);
      if (existingDoc?.avatar?.asset?._ref) {
        console.log(`  ⏩ Skipping ${docId}: Custom CMS avatar already exists (${existingDoc.avatar.asset._ref})`);
        continue;
      }

      console.log(`  Downloading avatar for ${docId}...`);
      const buffer = await fetchBuffer(url);
      console.log(`  Uploading asset for ${docId} to Sanity...`);
      const asset = await client.assets.upload("image", buffer, {
        filename: `${docId}.jpg`,
      });
      console.log(`  ✓ Created Sanity Asset: ${asset._id}`);

      console.log(`  Updating document ${docId} with asset reference...`);
      await client
        .patch(docId)
        .set({
          avatar: {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: asset._id,
            },
          },
        })
        .commit();
      console.log(`  ✓ Linked avatar to ${docId}`);
    } catch (err) {
      console.error(`  ❌ Error processing ${docId}:`, err.message);
    }
  }

  console.log("\n🎉 All images successfully uploaded & linked in Sanity CMS!");
}

uploadAssetsAndLink();
