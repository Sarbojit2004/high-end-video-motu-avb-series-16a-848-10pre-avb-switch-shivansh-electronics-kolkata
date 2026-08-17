// Safety-net deliverable: a self-contained project zip, committed BEFORE the
// full render is attempted. `npm install && npm run setup && npm run render`
// inside the unzipped folder reproduces the render independently.
//
// public/ is NOT included (it is generated), but the repository source assets it
// is generated FROM are, so setup works offline from the zip alone.
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, cpSync, existsSync, statSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { PROJ } from "./_load.mjs";

const REPO = resolve(PROJ, "..");
const STAGE = resolve(PROJ, ".zipstage/motu-avb-series-reels");
const OUT = resolve(PROJ, "out/motu-avb-series-reels-project.zip");

rmSync(resolve(PROJ, ".zipstage"), { recursive: true, force: true });
mkdirSync(STAGE, { recursive: true });

for (const f of ["src", "scripts", "package.json", "tsconfig.json", "remotion.config.ts",
                 "README.md", "asset-manifest.json",
                 "ASSET_COVERAGE_REEL1.md", "BRANDING_CADENCE_REEL1.md",
                 "ASSET_COVERAGE_REEL2.md", "BRANDING_CADENCE_REEL2.md",
                 "ASSET_COVERAGE_REEL3.md", "BRANDING_CADENCE_REEL3.md",
                 "VO_SCRIPT_REEL1_MOTU_10PRE.md",
                 "VO_SCRIPT_REEL2_MOTU_16A.md",
                 "VO_SCRIPT_REEL3_MOTU_848_AVB_SWITCH.md"]) {
  const src = resolve(PROJ, f);
  if (existsSync(src)) cpSync(src, resolve(STAGE, f), { recursive: true });
}
// the creative brief this build derives from
cpSync(resolve(REPO, "MOTU_AVB_ECOSYSTEM_CREATIVE_BRIEF.md"),
       resolve(STAGE, "MOTU_AVB_ECOSYSTEM_CREATIVE_BRIEF.md"));

// Bundled assets. The already-staged (downscaled, render-ready) images go in
// rather than the 74 MB of originals, and the 100 MB of music stays out: the
// zip is committed INTO the repository that ships `sound-effects/`, so
// duplicating it would only push the zip past GitHub's 100 MB file limit for no
// benefit. The ported fonts DO go in — they come from a sibling repository the
// recipient will not have.
cpSync(resolve(PROJ, "public/images"), resolve(STAGE, "assets/images"), { recursive: true });
cpSync(resolve(PROJ, "public/fonts"), resolve(STAGE, "assets/fonts"), { recursive: true });
cpSync(resolve(PROJ, "public/audio/sfx"), resolve(STAGE, "assets/sfx"), { recursive: true });

writeFileSync(resolve(STAGE, "OFFLINE-SETUP.md"), `# Rendering from this zip

    npm install
    node scripts/setup-from-zip.mjs
    npm run render:reel1     # or render:reel2 / render:reel3

\`assets/\` already holds the render-ready images, the two ported woff2 font
families and the 21 synthesized SFX files, so those need no network and no
sibling repository.

The one thing not bundled is the music: the five instrumental tracks and their
17 stems are 100 MB, and this zip is committed inside the repository that
already ships them under \`sound-effects/\`. Duplicating them would push the zip
past GitHub's 100 MB per-file limit for no benefit. Point \`scripts/make-music.mjs\`
at that folder (it looks for \`../sound-effects\` by default) and run:

    node scripts/make-music.mjs

Then \`npm run render:reelN\` reproduces that reel's master, and
\`npm run render:audioN\` reproduces its two standalone audio deliverables.
`);

writeFileSync(resolve(STAGE, "scripts/setup-from-zip.mjs"), `// Stages the bundled assets/ folder into public/ so the project renders
// without the parent repository (music excepted — see OFFLINE-SETUP.md).
import { cpSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const P = resolve(dirname(fileURLToPath(import.meta.url)), "..");
mkdirSync(resolve(P, "public/audio"), { recursive: true });
cpSync(resolve(P, "assets/images"), resolve(P, "public/images"), { recursive: true });
cpSync(resolve(P, "assets/fonts"), resolve(P, "public/fonts"), { recursive: true });
cpSync(resolve(P, "assets/sfx"), resolve(P, "public/audio/sfx"), { recursive: true });
console.log("staged images, fonts and sfx into public/. Next: node scripts/make-music.mjs");
`);

mkdirSync(resolve(PROJ, "out"), { recursive: true });
rmSync(OUT, { force: true });
execFileSync("zip", ["-r", "-q", OUT, "motu-avb-series-reels"], { cwd: resolve(PROJ, ".zipstage") });
rmSync(resolve(PROJ, ".zipstage"), { recursive: true, force: true });
console.log(`wrote ${OUT}  ${(statSync(OUT).size / 1e6).toFixed(0)} MB`);
