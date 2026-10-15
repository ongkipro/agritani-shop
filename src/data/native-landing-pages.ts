/**
 * The register of native Astro landing pages.
 *
 * A native landing page is a real route file — `src/pages/<slug>.astro` — built
 * and deployed with the Worker. Adding an entry here is what makes the CMS
 * aware of it: the admin can see it, copy its link, and hand it a product page.
 * Without an entry the route still answers on its URL, but the operator has no
 * way to know it exists.
 *
 * **This is a manifest, not discovery.** Cloudflare Workers bundles routes and
 * cannot enumerate `src/pages/` at runtime, so the list is written down and
 * compiled in. `validateNativeLandingPages` fails the build on a duplicate or
 * an incomplete entry rather than shipping a register that misrepresents the
 * site.
 *
 * To add one:
 *   1. create `src/pages/<slug>.astro` (see `docs/LANDING-PAGES.md`);
 *   2. add its entry below, with `slug` matching the filename exactly;
 *   3. deploy. The CMS picks it up on the next landing-page list load, or
 *      within the hour from the scheduled re-sync — the sitemap with it.
 *
 * To remove one: delete both. Removing only the file leaves a register entry
 * pointing at a 404; removing only the entry leaves an unlisted live URL.
 */
export type NativeLandingPage = {
  /** Must equal the route filename, and is the public path: `/<slug>`. */
  slug: string;
  /** Shown in the CMS list. */
  title: string;
  /** The product this page sells, by product slug. */
  productSlug: string;
  /** Shown in the CMS list beneath the title. */
  description: string;
  /** Optional list thumbnail (root-relative or https). Without it the lists
   *  show the product's photo. */
  image?: string;
  /** A page can be registered before it is ready to be linked. */
  isActive?: boolean;
};

export const nativeLandingPages: NativeLandingPage[] = [
  // Example, and the only entry that ships with the product:
  // {
  //   slug: 'promo-lebaran',
  //   title: 'Promo Lebaran',
  //   productSlug: 'pupuk-organik-cair',
  //   description: 'Landing khusus kampanye Lebaran.',
  // },
  {
    slug: 'perisai-anti-bulai',
    title: 'Perisai Anti-Bulai Daun Putih Jagung Hibrida',
    productSlug: 'bensu-pupuk-cair-organik',
    description: 'Bentengi daun jagung muda dari spora jamur bulai, daun tegap kaku hijau pekat dan tongkol padat berisi rekor 9.8 ton/Ha.',
    image: '/images/landing/perisai-anti-bulai/hero-bulai.webp',
    isActive: true,
  },
  {
    slug: 'anti-layu-mulsa',
    title: 'Anti-Layu Mulsa Panas — 100% Bibit Hidup Tegap',
    productSlug: 'bensu-pupuk-cair-organik',
    description: 'Protokol celup baki semai pelindung bibit dari panas mulsa & anti-stres pindah tanam.',
    image: '/images/landing/anti-layu-mulsa/hero-problem.webp',
    isActive: true,
  },
  {
    slug: 'bangkitkan-tanaman-mandek',
    title: 'Bangkitkan Tanaman Mandek — Panic Recovery 72 Jam',
    productSlug: 'bensu-pupuk-cair-organik',
    description: 'Solusi darurat tanaman kerdil, macet tumbuh, dan kaget cuaca pasca hujan atau kemarau.',
    image: '/images/landing/bangkitkan-tanaman-mandek/hero-problem.webp',
    isActive: true,
  },
  {
    slug: 'batang-baja-anti-rebah',
    title: 'Batang Baja Anti-Rebah Padi Sawah & Jagung',
    productSlug: 'bensu-pupuk-cair-organik',
    description: 'Bikin batang padi dan jagung sekeras kawat tahan badai rendeng, batang tegak lurus sampai panen bebas busuk lumpur.',
    image: '/images/landing/batang-baja-anti-rebah/hero-batang.webp',
    isActive: true,
  },
  {
    slug: 'penyelamat-bawang-moler',
    title: 'Penyelamat Bawang Merah Moler Inul & Umbi Jumbo',
    productSlug: 'bensu-pupuk-cair-organik',
    description: 'Hentikan serangan jamur Fusarium tanah becek, tegakkan daun kaku jegrik dan cetak umbi merah merona super jumbo.',
    image: '/images/landing/penyelamat-bawang-moler/hero-bawang.webp',
    isActive: true,
  },
  {
    slug: 'penyembuh-asem-aseman',
    title: 'Penyelamat Padi Asem-Aseman & Booster 40+ Anakan',
    productSlug: 'bensu-pupuk-cair-organik',
    description: 'Cuci racun asam tanah & pirit besi pasca hujan atau jerami mentah, daun merah karat pulih hijau royo-royo dan anakan meledak 40+ batang.',
    image: '/images/landing/penyembuh-asem-aseman/hero-problem.webp',
    isActive: true,
  },
  {
    slug: 'pengunci-bunga-anti-rontok',
    title: 'Pengunci Bunga & Pencegah Rontok Pentil Buah',
    productSlug: 'saratoga-serum-tanaman-premium',
    description: 'Kunci tangkai bunga dan pentil buah agar tidak rontok kena cuaca ekstrem, 95% sukses jadi buah bernas.',
    image: '/images/landing/pengunci-bunga-anti-rontok/hero-bunga.webp',
    isActive: true,
  },
  {
    slug: 'benteng-anti-patek',
    title: 'Benteng Anti-Patek Buah Cabai Lonyot',
    productSlug: 'saratoga-serum-tanaman-premium',
    description: 'Bikin kulit buah cabai liat sekeras perisai baja, jamur antraknosa rontok gagal tembus dan 98% petikan lolos Grade A.',
    image: '/images/landing/benteng-anti-patek/hero-patek.webp',
    isActive: true,
  },
  {
    slug: 'juara-gabah-bernas',
    title: 'Rahasia Gabah Bernas Padi Sawah Sampai Pangkal',
    productSlug: 'saratoga-serum-tanaman-premium',
    description: 'Daun bendera tegak mengawal pengisian susu gabah, bulir padat sampai pangkal malai dan ubinan tembus rekor 9 ton/Ha.',
    image: '/images/landing/juara-gabah-bernas/hero-gabah.webp',
    isActive: true,
  },
  {
    slug: 'perisai-kebal-jamur',
    title: 'Kojien — Perisai Sel Baja Kebal Jamur & Virus Tanaman',
    productSlug: 'kojien',
    description: 'Teknologi Immune Cellactivator Thailand: lapiskan dinding sel dengan Bio-Silika OSA & Sulfur aktif, 99% spora jamur bulai, moler, dan patek gagal tembus.',
    image: '/images/landing/perisai-kebal-jamur/hero-problem.webp',
    isActive: true,
  },
  {
    slug: 'booster-anggrek-aglonema-monstera',
    title: 'Saratoga — Booster Anggrek, Aglonema & Monstera',
    productSlug: 'saratoga-serum-tanaman-premium',
    description: 'Picu spike anggrek mekar serempak hingga 3 bulan, cetak daun aglonema merah merona tebal, dan pacu fenestrasi monstera robek raksasa.',
    image: '/images/landing/booster-anggrek-aglonema-monstera/hero-problem.webp',
    isActive: true,
  },
];

/**
 * Other top-level route files this install serves that are not landing pages —
 * a legacy slug that 301s to a renamed page, say. A CMS landing page on one of
 * these slugs would save and never be reachable, because the route file
 * answers first, so the CMS refuses them. Every entry in `nativeLandingPages`
 * is refused the same way without being repeated here.
 */
export const installRouteSlugs: string[] = [];
