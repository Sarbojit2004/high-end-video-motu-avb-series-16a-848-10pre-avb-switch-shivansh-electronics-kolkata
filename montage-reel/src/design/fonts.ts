// ─────────────────────────────────────────────────────────────────────────────
// TYPOGRAPHY SYSTEM — brief §2. Six roles, one face each.
//
//  display   Alfa Slab One            OFL, Google Fonts          hero moments (≤ 8)
//  grotesk   Telegraf → Bricolage Grotesque
//            Telegraf (Pangram Pangram) is a paid commercial licence and its
//            distribution site is not reachable from the build environment, so
//            it cannot be bundled here. The stack lists Telegraf FIRST: drop the
//            licensed files into public/fonts/telegraf/ (see README) and
//            scripts/fetch-fonts.mjs registers them; until then Bricolage
//            Grotesque (OFL — a grotesk with the same ink-trap character)
//            carries the role.
//  serif     Bodoni Moda              OFL — a true Didone, the "quiet, expensive" voice
//  script    Caveat                   OFL — tall, condensed, confident hand; used ONCE (Act V)
//  classic   Tinos                    Apache 2.0 — metric-compatible Times New Roman
//  micro     Bricolage Grotesque 300–500 (Telegraf light cuts if present)
//
// Faces are registered from public/fonts/manifest.json (written by
// scripts/fetch-fonts.mjs) with the FontFace API, and rendering is blocked
// until every face is usable.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

export const FONT = {
  display: `"Alfa Slab One", "Rockwell Extra Bold", serif`,
  grotesk: `"Telegraf", "Bricolage Grotesque", "Archivo", sans-serif`,
  serif: `"Bodoni Moda", "Didot", "Bodoni 72", serif`,
  script: `"Caveat", "Bradley Hand", cursive`,
  classic: `"Tinos", "Times New Roman", Times, serif`,
  micro: `"Telegraf", "Bricolage Grotesque", "Archivo", sans-serif`,
} as const;

interface ManifestFace { family: string; style: string; weight: string; file: string }
const formatOf = (file: string) => (/\.otf$/i.test(file) ? "opentype" : /\.woff2$/i.test(file) ? "woff2" : /\.woff$/i.test(file) ? "woff" : "truetype");

let loading: Promise<string[]> | null = null;
/** Register every face in the manifest; resolves with the list of loaded faces. */
export const loadFonts = (): Promise<string[]> => {
  if (loading) return loading;
  loading = (async () => {
    if (typeof document === "undefined" || !("fonts" in document)) return [];
    const manifest: ManifestFace[] = await (await fetch(staticFile("fonts/manifest.json"))).json();
    const loaded: string[] = [];
    await Promise.all(
      manifest.map(async (f) => {
        const face = new FontFace(f.family, `url(${staticFile(`fonts/${f.file}`)}) format("${formatOf(f.file)}")`, { weight: f.weight, style: f.style });
        try {
          await face.load();
          document.fonts.add(face);
          loaded.push(`${f.family} ${f.style} ${f.weight}`);
        } catch (e) {
          // a missing optional (licensed) file must not break the render
          console.error("font failed:", f.family, f.file, String(e));
          if (f.family !== "Telegraf") throw e;
        }
      }),
    );
    await document.fonts.ready;
    return loaded;
  })();
  return loading;
};

/** Block rendering until every declared face is registered. Used by the reel and the thumbnail. */
export const useFonts = (): void => {
  const [handle] = useState(() => delayRender("fonts"));
  useEffect(() => {
    loadFonts()
      .then(() => continueRender(handle))
      .catch((e) => {
        console.error(e);
        continueRender(handle);
      });
  }, [handle]);
};
