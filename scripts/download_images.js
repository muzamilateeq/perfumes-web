const fs = require("fs");
const path = require("path");
const https = require("https");

const imagesToDownload = [
  {
    name: "oud-royale.jpg",
    url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1200"
  },
  {
    name: "velvet-rose.jpg",
    url: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=1200"
  },
  {
    name: "midnight-citrus.jpg",
    url: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=1200"
  },
  {
    name: "santal-supreme.jpg",
    url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1200"
  },
  {
    name: "vanilla-whisper.jpg",
    url: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=1200"
  },
  {
    name: "aqua-celestia.jpg",
    url: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=1200"
  }
];

const destDir = path.join(__dirname, "..", "public", "images");
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function downloadImage(item) {
  return new Promise((resolve, reject) => {
    const destPath = path.join(destDir, item.name);
    const file = fs.createWriteStream(destPath);

    https.get(item.url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        https.get(response.headers.location, (redirectRes) => {
          redirectRes.pipe(file);
          file.on("finish", () => {
            file.close();
            console.log("Saved redirected:", item.name);
            resolve();
          });
        }).on("error", reject);
      } else {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          console.log("Saved:", item.name);
          resolve();
        });
      }
    }).on("error", (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function main() {
  for (const it of imagesToDownload) {
    try {
      await downloadImage(it);
    } catch (e) {
      console.error("Failed to download", it.name, e);
    }
  }
  console.log("All perfume images downloaded successfully into public/images!");
}

main();
