import type { Product, ProductVariant } from "../data/products";
import type { FormMode } from "./form-mode.ts";

const FORM_PATHS: Record<FormMode, string> = {
  middle: "/middle-form",
  full: "/full-form",
  hybrid: "/hybrid-form",
};

export function parseFormMode(value: unknown): FormMode | null {
  if (value === "middle" || value === "full" || value === "hybrid") {
    return value;
  }
  return null;
}

export function resolveFormVariant(
  product: Product,
  key?: string,
): ProductVariant | undefined {
  if (!key || !key.trim()) return resolvePreferredFormVariant(product);

  const normalized = key.trim();
  return product.variants.find((variant) => variant.id === normalized);
}

/**
 * Resolves the active checkout form variant, defaulting to the 1 Liter package
 * (highest conversion & ROAS anchor) when no explicit variant ID is passed.
 */
export function resolvePreferredFormVariant(
  product: Product,
  key?: string,
): ProductVariant | undefined {
  if (key && key.trim()) {
    const normalized = key.trim();
    const matched = product.variants.find((variant) => variant.id === normalized);
    if (matched) return matched;
  }

  return (
    product.variants.find((variant) => /1\s*liter|\b1\s*l\b/i.test(variant.label)) ??
    product.variants[1] ??
    product.variants[0]
  );
}

export type VariantPresentationMeta = {
  badge?: string;
  badgeTone?: "popular" | "bulk";
  dosageNote?: string;
};

export function getVariantPresentationMeta(
  product: Pick<Product, "slug" | "variants">,
  variant: ProductVariant,
): VariantPresentationMeta {
  const label = variant.label || "";
  const isSawit = /aussie|sawit/i.test(product.slug || "");
  const cheapest = [...product.variants].sort((a, b) => a.price - b.price)[0] ?? null;

  if (/500\s*ml/i.test(label)) {
    return {
      dosageNote: isSawit
        ? "Kemasan Uji Coba (Cukup 16–20 Tangki / 50–100 Pokok Sawit)"
        : "Kemasan Uji Coba (Cukup 16–20 Tangki Semprot)",
    };
  }

  if (/1\s*liter|\b1\s*l\b/i.test(label)) {
    const unitSavings =
      cheapest && cheapest.price * 2 > variant.price
        ? cheapest.price * 2 - variant.price
        : 0;
    const compareSavings =
      (variant.comparePrice ?? variant.price) > variant.price
        ? (variant.comparePrice ?? variant.price) - variant.price
        : 0;
    const savings = unitSavings >= 40000 ? unitSavings : compareSavings;
    const savingsText =
      savings > 0 ? ` • HEMAT Rp ${Math.round(savings).toLocaleString("id-ID")}` : "";
    return {
      badge: `PALING LARIS${savingsText}`,
      badgeTone: "popular",
      dosageNote: isSawit
        ? "Cukup 35–40 Tangki Semprot / 130 Pokok Sawit (1 Ha)"
        : "Cukup 35–40 Tangki Semprot (1 Musim)",
    };
  }

  if (/2\s*liter|\b2\s*l\b/i.test(label)) {
    const unitSavings =
      cheapest && cheapest.price * 4 > variant.price
        ? cheapest.price * 4 - variant.price
        : 0;
    const compareSavings =
      (variant.comparePrice ?? variant.price) > variant.price
        ? (variant.comparePrice ?? variant.price) - variant.price
        : 0;
    const savings = Math.max(unitSavings, compareSavings);
    const savingsText =
      savings > 0 ? ` • HEMAT Rp ${Math.round(savings).toLocaleString("id-ID")}` : "";
    return {
      badge: `${isSawit ? "PAKET 2 HEKTAR" : "PAKET 1 HEKTAR"}${savingsText}`,
      badgeTone: "bulk",
      dosageNote: isSawit
        ? "Stok Aman Sampai Panen Raya (70–80 Tangki / 260 Pokok Sawit)"
        : "Stok Aman Sampai Panen Raya (70–80 Tangki Semprot)",
    };
  }

  return {};
}

export function buildFormUrl(
  mode: FormMode,
  product: Pick<Product, "productId">,
  variant?: Pick<ProductVariant, "id">,
) {
  const params = new URLSearchParams({ product_id: product.productId });
  if (variant) params.set("variant_id", variant.id);
  return `${FORM_PATHS[mode]}?${params.toString()}`;
}

export function buildEmbedFormUrl(
  mode: FormMode,
  product: Pick<Product, "productId">,
  variant?: Pick<ProductVariant, "id">,
) {
  const params = new URLSearchParams({
    mode,
    product_id: product.productId,
  });
  if (variant) params.set("variant_id", variant.id);
  return `/embed/form?${params.toString()}`;
}

export function buildFormUrls(
  product: Pick<Product, "productId">,
  variant?: Pick<ProductVariant, "id">,
) {
  return {
    middle: buildFormUrl("middle", product, variant),
    full: buildFormUrl("full", product, variant),
    hybrid: buildFormUrl("hybrid", product, variant),
  };
}

export function buildEmbedFormUrls(
  product: Pick<Product, "productId">,
  variant?: Pick<ProductVariant, "id">,
) {
  return {
    middle: buildEmbedFormUrl("middle", product, variant),
    full: buildEmbedFormUrl("full", product, variant),
    hybrid: buildEmbedFormUrl("hybrid", product, variant),
  };
}
