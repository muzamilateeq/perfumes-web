const fs = require("fs");
const path = require("path");
const https = require("https");

// Supabase Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lhltlrxgncmdnexltwnj.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const BUCKET_NAME = "perfumes";

const IMAGES_DIR = path.join(__dirname, "..", "public", "images");

async function uploadFile(fileName) {
  if (!SUPABASE_KEY) {
    throw new Error("SUPABASE_KEY missing! Please provide your Supabase API Key from Project Settings > API.");
  }

  const filePath = path.join(IMAGES_DIR, fileName);
  const fileData = fs.readFileSync(filePath);

  const endpoint = new URL(`/storage/v1/object/${BUCKET_NAME}/${fileName}`, SUPABASE_URL);

  return new Promise((resolve, reject) => {
    const req = https.request(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "apikey": SUPABASE_KEY,
        "Content-Type": "image/jpeg",
        "x-upsert": "true",
        "Content-Length": fileData.length,
      }
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${fileName}`;
          console.log(`Uploaded ${fileName} -> ${publicUrl}`);
          resolve(publicUrl);
        } else {
          reject(new Error(`Failed to upload ${fileName} (${res.statusCode}): ${data}`));
        }
      });
    });

    req.on("error", reject);
    req.write(fileData);
    req.end();
  });
}

async function main() {
  console.log("Starting upload to Supabase Storage Bucket:", BUCKET_NAME);
  const files = fs.readdirSync(IMAGES_DIR).filter(f => f.endsWith(".jpg") || f.endsWith(".png"));

  const results = {};
  for (const f of files) {
    try {
      const url = await uploadFile(f);
      results[f] = url;
    } catch (err) {
      console.error(err.message);
    }
  }

  console.log("\nFinished! Supabase Image URLs:", results);
}

main();
