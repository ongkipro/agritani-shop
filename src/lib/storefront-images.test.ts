import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

/**
 * The storefront image contract (DESIGN-SYSTEM.md "Contract"): a public `<img>`
 * says whether it is the page's first paint or can wait (`loading="eager"` for
 * the likely LCP image and the header brand, `"lazy"` for everything else), and
 * reserves its box with `width` and `height` so nothing shifts when it arrives.
 * `loading` left off means eager, which on a below-the-fold photo costs an ad
 * landing real bytes and on a forgotten one nobody can tell intent from
 * oversight. CMS landing HTML is covered separately by `deferOffscreenImages`.
 *
 * Fix the tag, not this test. An exception below needs a reason a reviewer can
 * check against the file, and an exception that no longer matches a tag fails
 * the suite so the list cannot outlive the code it excuses.
 */
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const files = [
  ...walk("src/components/storefront"),
  ...walk("src/layouts"),
  ...walk("src/pages").filter((f) => !f.startsWith("src/pages/admin/") && !f.startsWith("src/pages/api/")),
].filter((f) => f.endsWith(".astro"));

/** Every `<img …>` in `source`, read to its real end: a `>` inside `{…}` or a quoted value is not the end. */
function imgTags(source: string): string[] {
  const tags: string[] = [];
  for (const start of source.matchAll(/<img\s/g)) {
    let depth = 0;
    let quote = "";
    for (let i = start.index; i < source.length; i++) {
      const ch = source[i];
      if (quote) {
        if (ch === quote) quote = "";
      } else if (depth === 0 && (ch === '"' || ch === "'")) {
        quote = ch;
      } else if (ch === "{") {
        depth++;
      } else if (ch === "}") {
        depth--;
      } else if (ch === ">" && depth === 0) {
        tags.push(source.slice(start.index, i + 1));
        break;
      }
    }
  }
  return tags;
}

type Skip = "loading" | "dimensions";
const EXCEPTIONS: { file: string; contains: string; skip: Skip[]; why: string }[] = [
  {
    file: "src/components/storefront/tracking/MetaPixelBase.astro",
    contains: "facebook.com/tr",
    skip: ["loading"],
    why: "1x1 pixel inside <noscript>; no layout, and a lazy beacon might never fire",
  },
  {
    file: "src/components/storefront/shared/SiteBrand.astro",
    contains: "src={uploadedLogo}",
    skip: ["dimensions"],
    why: "uploaded logo of unknown aspect: height-bound inline, width auto, max 168px",
  },
  {
    file: "src/components/storefront/forms/FormHybridContent.astro",
    contains: "src={bannerImage}",
    skip: ["dimensions"],
    why: "merchant promo banner, unknown intrinsic size; h-auto w-full, lazy, below the form",
  },
  {
    file: "src/components/storefront/forms/FormMiddleContent.astro",
    contains: "src={bannerImage}",
    skip: ["dimensions"],
    why: "merchant promo banner, unknown intrinsic size; h-auto w-full, lazy, below the form",
  },
  {
    file: "src/pages/[slug].astro",
    contains: "src={config.src}",
    skip: ["dimensions"],
    why: "a CMS image section stores only src and alt, so there is no size to declare",
  },
  {
    file: "src/pages/payment.astro",
    contains: 'id="qr-image"',
    skip: ["loading", "dimensions"],
    why: "hidden until script sets a generated QR, inside a fixed-size box",
  },
  {
    file: "src/pages/thanks.astro",
    contains: 'id="payment-qr-image"',
    skip: ["loading", "dimensions"],
    why: "hidden until script sets a generated QR, inside a fixed-size box",
  },
];

test("every public <img> declares loading and reserves its box", () => {
  const used = new Set<number>();
  const failures: string[] = [];
  for (const file of files) {
    const source = readFileSync(file, "utf8");
    for (const tag of imgTags(source)) {
      const hit = EXCEPTIONS.findIndex((e) => e.file === file && tag.includes(e.contains));
      if (hit >= 0) used.add(hit);
      const skip = new Set<Skip>(hit >= 0 ? EXCEPTIONS[hit].skip : []);
      const line = source.slice(0, source.indexOf(tag)).split("\n").length;
      const missing: string[] = [];
      if (!skip.has("loading") && !/\bloading\s*=/.test(tag)) missing.push("loading");
      if (!skip.has("dimensions") && !/\bwidth\s*=/.test(tag)) missing.push("width");
      if (!skip.has("dimensions") && !/\bheight\s*=/.test(tag)) missing.push("height");
      if (missing.length) failures.push(`${file}:${line} is missing ${missing.join(", ")}`);
    }
  }
  assert.deepEqual(failures, []);
  const stale = EXCEPTIONS.filter((_, i) => !used.has(i)).map((e) => `${e.file} ~ ${e.contains}`);
  assert.deepEqual(stale, [], "an exception that matches no tag must be deleted");
});

test("the scan reads a tag to its real end and sees what the guard needs to see", () => {
  const tags = imgTags('<img alt={`a > b`} src="x>y" loading="lazy" /> <img\n width="1"\n/>');
  assert.equal(tags.length, 2);
  assert.match(tags[0], /loading="lazy"/);
  assert.match(tags[1], /width="1"/);
  assert.ok(files.length > 20, "the walk must actually find the storefront files");
});
