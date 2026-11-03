import type { Product, ProductVariant } from "../data/products";
import type { FormMode } from "./form-mode.ts";

/**
 * The cheapest variant, the first among equals: the "from" price the cards,
 * the Product JSON-LD and both catalog feeds lead with. A form that opened on
 * another variant showed Merchant Center a price its item never had.
 */
export function cheapestVariant<T extends { price: number }>(variants: readonly T[]): T | undefined {
  return variants.reduce<T | undefined>((low, variant) => (!low || variant.price < low.price ? variant : low), undefined);
}

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

export function isSawitProduct(
  product: Pick<Product, "slug" | "variants">,
): boolean {
  if (/aussie|sawit/i.test(product.slug || "")) return true;
  return (product.variants ?? []).some((v) =>
    /^aus-|aussie|sawit/i.test(`${v.sku || ""} ${v.label || ""}`),
  );
}

/**
 * Resolves the active checkout form variant:
 * - Sawit (Aussie) defaults to 1 Liter (plantation acreage anchor).
 * - Non-Sawit (Saratoga, Bensu, Kojien) defaults to 500ml so farmers do not get
 *   sticker shock when COD shipping is added, while 1 Liter is offered as "Lebih Hemat".
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

  if (isSawitProduct(product)) {
    return (
      product.variants.find((variant) => /1\s*liter|\b1\s*l\b/i.test(variant.label)) ??
      product.variants[1] ??
      product.variants[0]
    );
  }

  // A store's preferred size wins; with none to match, the cheapest variant,
  // the price the feeds and cards lead with (product rule, 2026-11-02).
  return (
    product.variants.find((variant) => /500\s*ml/i.test(variant.label)) ??
    cheapestVariant(product.variants)
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
  const isSawit = isSawitProduct(product);
  const compareSavings =
    (variant.comparePrice ?? variant.price) > variant.price
      ? (variant.comparePrice ?? variant.price) - variant.price
      : 0;
  const savingsText =
    compareSavings > 0
      ? ` • HEMAT Rp ${Math.round(compareSavings).toLocaleString("id-ID")}`
      : "";

  if (/250\s*ml/i.test(label)) {
    return {
      badge: `PAKET HEMAT COBA${savingsText}`,
      badgeTone: "bulk",
      dosageNote: "Kemasan Coba Awal (Cukup 8–10 Tangki Semprot)",
    };
  }

  if (/500\s*ml/i.test(label)) {
    if (isSawit) {
      return {
        dosageNote: "Kemasan Uji Coba (Cukup 16–20 Tangki / 50–100 Pokok Sawit)",
      };
    }
    return {
      badge: `PALING LARIS${savingsText}`,
      badgeTone: "popular",
      dosageNote: "Paket Hemat Awal (Cukup 16–20 Tangki Semprot)",
    };
  }

  if (/1\s*liter|\b1\s*l\b/i.test(label)) {
    if (isSawit) {
      return {
        badge: `PALING LARIS${savingsText}`,
        badgeTone: "popular",
        dosageNote: "Cukup 35–40 Tangki Semprot / 130 Pokok Sawit (1 Ha)",
      };
    }
    return {
      badge: `LEBIH HEMAT${savingsText}`,
      badgeTone: "bulk",
      dosageNote: "Lebih Hemat untuk 1 Musim (Cukup 35–40 Tangki Semprot)",
    };
  }

  if (/2\s*liter|\b2\s*l\b/i.test(label)) {
    const oneLiter = product.variants.find((v) =>
      /1\s*liter|\b1\s*l\b/i.test(v.label),
    );
    const extraDiscount =
      oneLiter && oneLiter.price * 2 > variant.price
        ? oneLiter.price * 2 - variant.price
        : 10000;
    return {
      badge: `${isSawit ? "PAKET 2 HEKTAR" : "PAKET 1 HEKTAR"} • DISKON Rp ${Math.round(extraDiscount).toLocaleString("id-ID")}`,
      badgeTone: "bulk",
      dosageNote: isSawit
        ? "2 Botol × 1 Liter (Stok Aman 70–80 Tangki / 260 Pokok Sawit)"
        : "2 Botol × 1 Liter (Stok Aman 70–80 Tangki Semprot)",
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
