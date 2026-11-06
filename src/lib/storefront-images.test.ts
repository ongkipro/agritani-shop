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
  ...walk("src/scripts"),
  // /hello is the admin login: admin.css, the admin surface (DESIGN-SYSTEM §0.2), not this contract.
  ...walk("src/pages").filter(
    (f) => !f.startsWith("src/pages/admin/") && !f.startsWith("src/pages/api/") && f !== "src/pages/hello.astro",
  ),
].filter((f) => (f.endsWith(".astro") || f.endsWith(".ts")) && !f.endsWith(".test.ts"));

/**
 * Every `<img …>` in `source`, read to its real end. A `>` inside `{…}` or inside a
 * quoted value is not the end, and a quote opened inside `{…}` is honoured too. A tag
 * that never closes throws: a guard that silently drops what it cannot read fails open.
 */
function imgTags(source: string): { tag: string; index: number }[] {
  const tags: { tag: string; index: number }[] = [];
  for (const start of source.matchAll(/<img\s/g)) {
    let depth = 0;
    let quote = "";
    let end = -1;
    for (let i = start.index; i < source.length && end < 0; i++) {
      const ch = source[i];
      if (quote) {
        if (ch === quote) quote = "";
      } else if (ch === '"' || ch === "'" || ch === "`") {
        quote = ch;
      } else if (ch === "{") {
        depth++;
      } else if (ch === "}") {
        depth--;
      } else if (ch === ">" && depth === 0) {
        end = i;
      }
    }
    if (end < 0) throw new Error(`unterminated <img at offset ${start.index}`);
    tags.push({ tag: source.slice(start.index, end + 1), index: start.index });
  }
  return tags;
}

/** A real attribute name: not `data-loading=`, not `max-width=`, and not text inside a value. */
function hasAttr(tag: string, name: string): boolean {
  const bare = tag.replace(/"[^"]*"|'[^']*'|`[^`]*`/g, '""');
  return new RegExp(`(?<![\\w-])${name}\\s*=`).test(bare);
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
    for (const { tag, index } of imgTags(source)) {
      const missing: Skip[] = [];
      const names: string[] = [];
      if (!hasAttr(tag, "loading")) (missing.push("loading"), names.push("loading"));
      if (!hasAttr(tag, "width")) (missing.push("dimensions"), names.push("width"));
      if (!hasAttr(tag, "height")) (missing.push("dimensions"), names.push("height"));
      const hit = EXCEPTIONS.findIndex((e) => e.file === file && tag.includes(e.contains));
      const excused = hit >= 0 ? EXCEPTIONS[hit].skip : [];
      // An exception counts as used only when it actually excused something.
      if (hit >= 0 && missing.some((m) => excused.includes(m))) used.add(hit);
      const unexcused = names.filter((_, i) => !excused.includes(missing[i]));
      if (unexcused.length) {
        const line = source.slice(0, index).split("\n").length;
        failures.push(`${file}:${line} is missing ${unexcused.join(", ")}`);
      }
    }
  }
  assert.deepEqual(failures, []);
  const stale = EXCEPTIONS.filter((_, i) => !used.has(i)).map((e) => `${e.file} ~ ${e.contains}`);
  assert.deepEqual(stale, [], "an exception that excuses nothing must be deleted");
});

test("the scan reads a tag to its real end and cannot be satisfied by look-alikes", () => {
  const tags = imgTags('<img alt={`a > b`} src="x>y" loading="lazy" /> <img\n width="1"\n/> <img alt={c ? "}" : ""} src="a" />');
  assert.equal(tags.length, 3);
  assert.ok(hasAttr(tags[0].tag, "loading"));
  assert.ok(hasAttr(tags[2].tag, "src") && !hasAttr(tags[2].tag, "loading"), "a `}` in a string must not end the expression early");
  assert.ok(!hasAttr('<img data-loading="x" max-width="1" alt="width = 3" />', "loading"));
  assert.ok(!hasAttr('<img data-loading="x" max-width="1" alt="width = 3" />', "width"));
  assert.throws(() => imgTags('<img src="a" loading="lazy"'), /unterminated/);
  assert.ok(files.some((f) => f.endsWith("form-hybrid.ts")), "the walk must reach the scripts that build <img> strings");
  assert.ok(files.length > 20, "the walk must actually find the storefront files");
});
