import assert from "node:assert/strict";
import test from "node:test";
import type { Product } from "../data/products.ts";
import {
  buildEmbedFormUrls,
  buildFormUrls,
  getVariantPresentationMeta,
  parseFormMode,
  resolveFormVariant,
  resolvePreferredFormVariant,
} from "./form-config.ts";

const product = {
  catalogId: 10001,
  productId: "10001",
  variants: [
    {
      catalogId: 20001,
      sku: "AUS-500ML",
      id: "20001",
      label: "Alpha - 500ml",
      price: 150000,
    },
    {
      catalogId: 20002,
      sku: "AUS-1L",
      id: "20002",
      label: "Alpha - 1 Liter",
      price: 300000,
    },
  ],
} as Product;

test("form modes accept only middle, full, and hybrid", () => {
  assert.equal(parseFormMode("middle"), "middle");
  assert.equal(parseFormMode("full"), "full");
  assert.equal(parseFormMode("hybrid"), "hybrid");
  assert.equal(parseFormMode("adaptive"), null);
});

test("form variants resolve only by canonical D1 variant ID and default to 1 Liter when omitted", () => {
  assert.equal(resolveFormVariant(product)?.catalogId, 20002);
  assert.equal(resolveFormVariant(product, "20001")?.catalogId, 20001);
  assert.equal(resolveFormVariant(product, "20002")?.catalogId, 20002);
  assert.equal(resolveFormVariant(product, "AUS-1L"), undefined);
  assert.equal(resolveFormVariant(product, "99999999"), undefined);
});

test("generated URLs bind canonical product and variant IDs across all modes", () => {
  assert.deepEqual(buildFormUrls(product, product.variants[1]), {
    middle: "/middle-form?product_id=10001&variant_id=20002",
    full: "/full-form?product_id=10001&variant_id=20002",
    hybrid: "/hybrid-form?product_id=10001&variant_id=20002",
  });
});

test("generated embed URLs keep mode and canonical IDs explicit", () => {
  assert.deepEqual(buildEmbedFormUrls(product, product.variants[1]), {
    middle: "/embed/form?mode=middle&product_id=10001&variant_id=20002",
    full: "/embed/form?mode=full&product_id=10001&variant_id=20002",
    hybrid: "/embed/form?mode=hybrid&product_id=10001&variant_id=20002",
  });
});

test("resolvePreferredFormVariant defaults to 1 Liter and returns DB-exact dosage & savings badges", () => {
  const bensu = {
    slug: "bensu-pupuk-cair-organik",
    variants: [
      { id: "5", label: "500ml", price: 130000, comparePrice: 198000 },
      { id: "6", label: "1 Liter", price: 215000, comparePrice: 298000 },
    ],
  } as Product;

  assert.equal(resolvePreferredFormVariant(bensu)?.id, "6");
  assert.equal(resolvePreferredFormVariant(bensu, "5")?.id, "5");

  const meta500 = getVariantPresentationMeta(bensu, bensu.variants[0]);
  assert.equal(meta500.badge, undefined);
  assert.match(meta500.dosageNote || "", /16–20 Tangki/);

  const meta1L = getVariantPresentationMeta(bensu, bensu.variants[1]);
  assert.equal(meta1L.badge, "PALING LARIS • HEMAT Rp 83.000");
  assert.equal(meta1L.badgeTone, "popular");
  assert.match(meta1L.dosageNote || "", /35–40 Tangki/);
});
