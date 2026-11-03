import assert from "node:assert/strict";
import test from "node:test";
import type { Product } from "../data/products.ts";
import {
  buildEmbedFormUrls,
  buildFormUrls,
  getVariantPresentationMeta,
  parseFormMode,
  cheapestVariant,
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

test("resolvePreferredFormVariant defaults non-sawit (Saratoga/Bensu/Kojien) to 500ml and marks 1 Liter as Lebih Hemat", () => {
  const saratoga = {
    slug: "saratoga-serum-tanaman-premium",
    variants: [
      { id: "13", label: "250ml", price: 75000, comparePrice: 115000 },
      { id: "1", label: "500ml", price: 135000, comparePrice: 198000 },
      { id: "2", label: "1 Liter", price: 235000, comparePrice: 389000 },
      { id: "11", label: "2 Liter", price: 460000, comparePrice: 778000 },
    ],
  } as Product;

  assert.equal(resolvePreferredFormVariant(saratoga)?.id, "1");
  assert.equal(resolvePreferredFormVariant(saratoga, "13")?.id, "13");
  assert.equal(resolvePreferredFormVariant(saratoga, "2")?.id, "2");
  assert.equal(resolvePreferredFormVariant(saratoga, "11")?.id, "11");

  const meta250 = getVariantPresentationMeta(saratoga, saratoga.variants[0]);
  assert.equal(meta250.badge, "PAKET HEMAT COBA • HEMAT Rp 40.000");
  assert.equal(meta250.badgeTone, "bulk");
  assert.match(meta250.dosageNote || "", /8–10 Tangki/);

  const saratogaMeta500 = getVariantPresentationMeta(saratoga, saratoga.variants[1]);
  assert.equal(saratogaMeta500.badge, "PALING LARIS • HEMAT Rp 63.000");
  assert.equal(saratogaMeta500.badgeTone, "popular");

  const saratogaMeta1L = getVariantPresentationMeta(saratoga, saratoga.variants[2]);
  assert.equal(saratogaMeta1L.badge, "LEBIH HEMAT • HEMAT Rp 154.000");
  assert.equal(saratogaMeta1L.badgeTone, "bulk");

  const saratogaMeta2L = getVariantPresentationMeta(saratoga, saratoga.variants[3]);
  assert.equal(saratogaMeta2L.badge, "PAKET 1 HEKTAR • DISKON Rp 10.000");
  assert.equal(saratogaMeta2L.badgeTone, "bulk");

  const bensu = {
    slug: "bensu-pupuk-cair-organik",
    variants: [
      { id: "5", label: "500ml", price: 135000, comparePrice: 198000 },
      { id: "6", label: "1 Liter", price: 235000, comparePrice: 298000 },
      { id: "9", label: "2 Liter", price: 460000, comparePrice: 596000 },
    ],
  } as Product;

  assert.equal(resolvePreferredFormVariant(bensu)?.id, "5");
  assert.equal(resolvePreferredFormVariant(bensu, "6")?.id, "6");
  assert.equal(resolvePreferredFormVariant(bensu, "9")?.id, "9");

  const meta500 = getVariantPresentationMeta(bensu, bensu.variants[0]);
  assert.equal(meta500.badge, "PALING LARIS • HEMAT Rp 63.000");
  assert.equal(meta500.badgeTone, "popular");
  assert.match(meta500.dosageNote || "", /16–20 Tangki/);

  const meta1L = getVariantPresentationMeta(bensu, bensu.variants[1]);
  assert.equal(meta1L.badge, "LEBIH HEMAT • HEMAT Rp 63.000");
  assert.equal(meta1L.badgeTone, "bulk");
  assert.match(meta1L.dosageNote || "", /35–40 Tangki/);

  const meta2L = getVariantPresentationMeta(bensu, bensu.variants[2]);
  assert.equal(meta2L.badge, "PAKET 1 HEKTAR • DISKON Rp 10.000");
  assert.equal(meta2L.badgeTone, "bulk");
  assert.match(meta2L.dosageNote || "", /2 Botol × 1 Liter/);
});
