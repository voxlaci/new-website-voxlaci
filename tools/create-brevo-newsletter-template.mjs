import { readFile } from "node:fs/promises";

const apiKey = process.env.BREVO_API_KEY || await readStdin();
if (!apiKey) {
  console.error("Missing Brevo API key on stdin.");
  process.exit(1);
}

const htmlContent = await readFile(new URL("../brevo/newsletter-voxlaci-template.html", import.meta.url), "utf8");

const payload = {
  sender: {
    name: "VoxLaci",
    email: "info@voxlaci.com",
  },
  templateName: `Newsletter VoxLaci — Premium Dark ${new Date().toISOString().slice(0, 10)}`,
  subject: "Newsletter VoxLaci",
  htmlContent,
  isActive: true,
  replyTo: "info@voxlaci.com",
  tag: "newsletter",
};

const response = await fetch("https://api.brevo.com/v3/smtp/templates", {
  method: "POST",
  headers: {
    "api-key": apiKey,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify(payload),
});

const text = await response.text();
let body;
try {
  body = text ? JSON.parse(text) : {};
} catch {
  body = { raw: text };
}

if (!response.ok) {
  console.error(JSON.stringify({ status: response.status, body }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: response.status, template: body }, null, 2));

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8").trim();
}
