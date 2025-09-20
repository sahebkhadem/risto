// scripts/create-env.js
const fs = require("fs");
const path = require("path");
const src = path.join(process.cwd(), ".env.example");
const dest = path.join(process.cwd(), ".env.local");

if (!fs.existsSync(src)) {
	console.error(".env.example not found. Create one first.");
	process.exit(1);
}

if (fs.existsSync(dest)) {
	console.log(".env.local already exists — leaving it alone.");
	process.exit(0);
}

fs.copyFileSync(src, dest);
console.log("Created .env.local from .env.example — fill in real values.");
