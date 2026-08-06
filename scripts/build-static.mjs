import { cp, mkdir, rename, rm, symlink } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const buildRoot = path.join(root, ".static-build");
const output = path.join(root, "out");
const copiedPaths = [
  "src",
  "public",
  "keystatic.config.ts",
  "next.config.mjs",
  "package.json",
  "package-lock.json",
  "tsconfig.json"
];

async function runNextBuild() {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [path.join(root, "node_modules/next/dist/bin/next"), "build"],
      {
        cwd: buildRoot,
        env: {
          ...process.env,
          NEXT_TELEMETRY_DISABLED: "1",
          WENWEB_STATIC_EXPORT: "1",
          WENWEB_TURBOPACK_ROOT: root
        },
        stdio: "inherit"
      }
    );

    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (signal) reject(new Error(`next build terminated by ${signal}`));
      else resolve(code ?? 1);
    });
  });
}

await rm(buildRoot, { recursive: true, force: true });
await mkdir(buildRoot, { recursive: true });

try {
  for (const relativePath of copiedPaths) {
    await cp(path.join(root, relativePath), path.join(buildRoot, relativePath), {
      recursive: true
    });
  }

  // Keystatic remains available for local authoring, but is deliberately absent
  // from the immutable public website build.
  await rm(path.join(buildRoot, "src/app/keystatic"), { recursive: true, force: true });
  await rm(path.join(buildRoot, "src/app/api/keystatic"), { recursive: true, force: true });
  await symlink(path.join(root, "node_modules"), path.join(buildRoot, "node_modules"), "dir");

  const code = await runNextBuild();
  if (code !== 0) throw new Error(`next build exited with status ${code}`);
  await rm(output, { recursive: true, force: true });
  await rename(path.join(buildRoot, "out"), output);
} finally {
  await rm(buildRoot, { recursive: true, force: true });
}
