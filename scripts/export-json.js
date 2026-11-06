import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

// Dynamically import from compiled ESM
const { VERIFIED_HOLIDAYS, getHolidays } = await import('../dist/index.mjs');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 1. Export all verified holidays
fs.writeFileSync(
  path.join(distDir, 'all-holidays.json'),
  JSON.stringify(VERIFIED_HOLIDAYS, null, 2),
  'utf-8'
);

// 2. Export per-year JSON files (2024 to 2027)
for (const year of [2024, 2025, 2026, 2027]) {
  const holidays = getHolidays({ year });
  fs.writeFileSync(
    path.join(distDir, `pakistan-holidays-${year}.json`),
    JSON.stringify(holidays, null, 2),
    'utf-8'
  );
}

console.log('✓ Successfully exported static JSON distribution files into dist/');
