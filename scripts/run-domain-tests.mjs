import { readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const testBuildDir = join(workspaceRoot, ".test-build");
const tscCli = join(workspaceRoot, "node_modules", "typescript", "bin", "tsc");

rmSync(testBuildDir, { force: true, recursive: true });

const compileResult = spawnSync(
  process.execPath,
  [tscCli, "-p", join(workspaceRoot, "tsconfig.test.json")],
  {
    cwd: workspaceRoot,
    stdio: "inherit",
  },
);

if (compileResult.status !== 0) {
  process.exit(compileResult.status ?? 1);
}

writeFileSync(
  join(testBuildDir, "package.json"),
  `${JSON.stringify({ type: "commonjs" }, null, 2)}\n`,
);

function findTests(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return findTests(path);
    }

    return entry.name.endsWith(".test.js") ? [path] : [];
  });
}

const testFiles = findTests(testBuildDir).sort();

if (testFiles.length === 0) {
  console.error("No compiled domain tests were found.");
  process.exit(1);
}

const testResult = spawnSync(process.execPath, ["--test", ...testFiles], {
  cwd: workspaceRoot,
  stdio: "inherit",
});

process.exit(testResult.status ?? 1);
