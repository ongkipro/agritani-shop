/**
 * The admin Docs book (`/admin/docs/<slug>`): its chapters, in reading order.
 * Text only — a screenshot of the admin goes stale with the first UI change,
 * a sentence naming the menu does not (Paduka, 2026-11-02).
 */
export const DOCS_CHAPTERS = [
  { slug: "mulai", title: "Mulai di sini", summary: "Tiga cara menghubungkan sistem lain ke toko, dan kapan memakai yang mana." },
  { slug: "api-key", title: "API key & scope", summary: "Membuat key, memilih scope, batas pemakaian, dan audit." },
  { slug: "headless-api", title: "Headless API", summary: "Storefront eksternal: katalog, ongkir, checkout, status order, tracking." },
  { slug: "ops-api", title: "Operations API", summary: "Membaca order dari server, spreadsheet, atau agen: browse dan sinkronisasi." },
  { slug: "cli", title: "CLI adsbook", summary: "Membaca order dari terminal: login, daftar, detail, output JSON." },
  { slug: "error", title: "Error & batas", summary: "Kode error, header rate limit, dan cara menanganinya." },
] as const;

export type DocsChapterSlug = (typeof DOCS_CHAPTERS)[number]["slug"];
