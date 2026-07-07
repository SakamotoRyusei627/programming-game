import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("Next.js の主要ファイルが存在する", () => {
  const requiredFiles = [
    "package.json",
    "next.config.ts",
    "tsconfig.json",
    "src/app/layout.tsx",
    "src/app/page.tsx",
    "src/app/globals.css",
  ];

  for (const file of requiredFiles) {
    assert.equal(fs.existsSync(file), true, `${file} が見つかりません`);
  }
});
