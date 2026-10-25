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
  /** A second ad slug that renders another page's content declares that page
   *  here, and its route points `canonical` at it. The sitemap then lists only
   *  the canonical one: Google reports a submitted URL whose canonical is
   *  elsewhere as a duplicate. */
  canonicalSlug?: string;
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
    image: '/images/landing/perisai-anti-bulai/hero-problem.webp',
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
    image: '/images/landing/batang-baja-anti-rebah/hero-problem.webp',
    isActive: true,
  },
  {
    slug: 'penyelamat-bawang-moler',
    title: 'Penyelamat Bawang Merah Moler Inul & Umbi Jumbo',
    productSlug: 'bensu-pupuk-cair-organik',
    description: 'Hentikan serangan jamur Fusarium tanah becek, tegakkan daun kaku jegrik dan cetak umbi merah merona super jumbo.',
    image: '/images/landing/penyelamat-bawang-moler/hero-problem.webp',
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
    image: '/images/landing/pengunci-bunga-anti-rontok/hero-problem.webp',
    isActive: true,
  },
  {
    slug: 'benteng-anti-patek',
    title: 'Benteng Anti-Patek Buah Cabai Lonyot',
    productSlug: 'saratoga-serum-tanaman-premium',
    description: 'Bikin kulit buah cabai liat sekeras perisai baja, jamur antraknosa rontok gagal tembus dan 98% petikan lolos Grade A.',
    image: '/images/landing/benteng-anti-patek/hero-problem.webp',
    isActive: true,
  },
  {
    slug: 'juara-gabah-bernas',
    title: 'Rahasia Gabah Bernas Padi Sawah Sampai Pangkal',
    productSlug: 'saratoga-serum-tanaman-premium',
    description: 'Daun bendera tegak mengawal pengisian susu gabah, bulir padat sampai pangkal malai dan ubinan tembus rekor 9 ton/Ha.',
    image: '/images/landing/juara-gabah-bernas/hero-problem.webp',
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
  {
    slug: 'bibit-sawit-busuk-kuning',
    title: 'Aussie — Penyelamat Bibit Sawit Busuk Kuning, Layu & Tumbang',
    productSlug: 'aussie-pupuk-cair-organik',
    description: 'Hentikan bercak kuning Curvularia, busuk pupus tombak, dan layu stres pindah tanam. 99% bibit sawit hidup tegap berbonggol kokoh bebas tumbang.',
    image: '/images/landing/bibit-sawit-busuk-kuning/hero-problem.webp',
    isActive: true,
  },
  {
    slug: 'booster-umbi-bawang-anti-pucuk-kuning',
    title: 'Bensu - Booster Umbi Bawang Merah Anti-Pucuk Kuning & Anakan Siung Jumbo',
    productSlug: 'bensu-pupuk-cair-organik',
    description: 'Atasi mati pucuk daun bawang merah menguning kering, tegakkan daun pipa hijau kebiruan, pecah 12-16 siung seragam, dan cetak umbi merah padat tahan simpan.',
    image: '/images/landing/booster-umbi-bawang-anti-pucuk-kuning/hero-problem.webp',
    isActive: true,
  },
  {
    slug: 'penyelamat-tomat-busuk-pantat-rontok',
    title: 'Saratoga - Obat Tomat Busuk Pantat Hitam, Pengunci Bunga & Anti-Pecah Buah',
    productSlug: 'saratoga-serum-tanaman-premium',
    description: 'Hentikan busuk pantat buah tomat hitam cekung (Blossom End Rot), kunci 95% tandan bunga jadi 8-10 buah utuh, dan tebalkan kulit tomat merah mulus kelas Grade A.',
    image: '/images/landing/penyelamat-tomat-busuk-pantat-rontok/hero-problem.webp',
    isActive: true,
  },
  {
    slug: 'pertolongan-keracunan-obat',
    title: 'Bensu - Pertolongan Pertama Tanaman Gosong Keracunan Obat & Overdosis Pestisida',
    productSlug: 'bensu-pupuk-cair-organik',
    description: 'Cuci sisa racun panas di pori-pori daun akibat salah oplos atau overdosis obat kimia, dinginkan jaringan melepuh, dan pecahkan tunas baru dalam 72 jam.',
    image: '/images/landing/pertolongan-keracunan-obat/hero-problem.webp',
    isActive: true,
  },
  {
    slug: 'maraton-panen-cabai',
    title: 'Bensu - Rahasia Pohon Cabai Tua Tembus 25-30 Kali Petikan Tanpa Habis Bensin',
    productSlug: 'bensu-pupuk-cair-organik',
    description: 'Remajakan akar tua di bawah mulsa, pecahkan tunas cabang Y dan bunga susulan setiap habis petik, dan tarik masa panen cabai tembus 25-30 kali petikan.',
    image: '/images/landing/maraton-panen-cabai/hero-problem.webp',
    isActive: true,
  },
  {
    slug: 'perisai-keriting-thrips-kutu-kebul',
    title: 'Kojien - Perisai Kaca Silika Anti-Keriting Thrips, Tungau & Bule Virus Kuning',
    productSlug: 'kojien',
    description: 'Lapisi daun dengan perisai Bio-Silika OSA yang bikin rahang Thrips, Tungau, dan Kutu Kebul selip gagal menyedot serta buka pucuk mulus dalam 5-7 hari.',
    image: '/images/landing/perisai-keriting-thrips-kutu-kebul/hero-problem.webp',
    isActive: true,
  },
  {
    slug: 'penyelamat-layu-mendadak',
    title: 'Kojien - Penyelamat Tanaman Layu Siang Mendadak (Layu Bakteri & Fusarium)',
    productSlug: 'kojien',
    description: 'Segel rapat luka akar dari serangan jamur Fusarium dan bakteri lendir Ralstonia, keringkan leher batang busuk, dan hentikan penularan layu sebaris dalam 48 jam.',
    image: '/images/landing/penyelamat-layu-mendadak/hero-problem.webp',
    isActive: true,
  },
  {
    slug: 'benteng-lodoh-umbi-kentang',
    title: 'Kojien - Benteng Anti-Lodoh Busuk Daun Kabut & Pengisi Umbi Kentang Super Grade A',
    productSlug: 'kojien',
    description: 'Ubah permukaan daun kentang menjadi kalis seperti daun talas penolak air kabut dingin, cegah busuk daun lodoh hitam, dan dongkrak umbi Super Grade A/AB.',
    image: '/images/landing/benteng-lodoh-umbi-kentang/hero-problem.webp',
    isActive: true,
  },
  {
    slug: 'perisai-kresek-potong-leher-padi',
    title: 'Kojien - Perisai Padi Anti-Kresek Daun Mengering & Anti-Blast Potong Leher Malai',
    productSlug: 'kojien',
    description: 'Tegakkan daun bendera padi 90 derajat kebal gesekan angin kresek dan keraskan cincin leher malai sekeras kawat tahan jamur Blast potong leher.',
    image: '/images/landing/perisai-kresek-potong-leher-padi/hero-problem.webp',
    isActive: true,
  },
  {
    slug: 'booster-manis-brix-anti-pecah',
    title: 'Saratoga - Pengunci Manis Pasir Semangka Brix 14+, Net Melon Tebal & Anti-Pecah Buah',
    productSlug: 'saratoga-serum-tanaman-premium',
    description: 'Lenturkan kulit buah agar 0% retak meledak saat diguyur hujan, timbulkan ukiran net melon tebal 3D merata, dan kunci manis pasir Brix 14+ merah menyala.',
    image: '/images/landing/booster-manis-brix-anti-pecah/hero-problem.webp',
    isActive: true,
  },
  {
    slug: 'booster-bunga-buah-tahunan',
    title: 'Saratoga - Pemicu Bunga Lebat di Luar Musim & Pengunci Pentil Alpukat, Durian, Mangga',
    productSlug: 'saratoga-serum-tanaman-premium',
    description: 'Hentikan mabuk daun muda, paksa dahan tua memecah dompolan bunga di luar musim raya, dan kunci tangkai pentil buah kebal rontok hujan angin.',
    image: '/images/landing/booster-bunga-buah-tahunan/hero-problem.webp',
    isActive: true,
  },
  {
    slug: 'penakluk-sawit-ganoderma',
    title: 'Aussie - Penyelamat Sawit Busuk Pangkal Batang (Ganoderma), Pelepah Sengkleh & Daun Tombak',
    productSlug: 'aussie-pupuk-cair-organik',
    description: 'Kunci pembusukan jamur Ganoderma di bonggol sawit, pancing akar tombak baru menghujam tanah, dan pulihkan tajuk pelepah hijau mekar produktif.',
    image: '/images/landing/penakluk-sawit-ganoderma/hero-problem.webp',
    isActive: true,
  },
  {
    slug: 'booster-sawit-anti-trek',
    title: 'Aussie - Booster Bobot Janjang Sawit Anti-Trek Musim Kemarau & Pemecah Bunga Betina',
    productSlug: 'aussie-pupuk-cair-organik',
    description: 'Pecahkan kemacetan trek panen sawit, dorong rasio bunga betina di tiap ketiak pelepah, dan dongkrak berat TBS +5 s/d +8 kg per janjang.',
    image: '/images/landing/booster-sawit-anti-trek/hero-problem.webp',
    isActive: true,
  },
  {
    slug: 'booster-tongkol-jagung-bobot',
    title: 'Bensu - Pengisi Tongkol Jagung Penuh Sampai Ujung (Anti-Ompong) & Pendongkrak Bobot Pipilan',
    productSlug: 'bensu-pupuk-cair-organik',
    description: 'Kawal penyerbukan rambut jagung agar tongkol terisi penuh sampai ujung bebas ompong, biji bernas padat, dan rendemen pipilan kering tembus 11+ ton/Ha.',
    image: '/images/landing/booster-tongkol-jagung-bobot/hero-problem.webp',
    isActive: true,
  },
  {
    slug: 'obat-sawit-busuk-pucuk-ganoderma',
    title: 'Aussie - Solusi Sawit Busuk Pucuk Tombak, Bercak Daun Curvularia & Ganoderma Tanpa Bor Batang',
    productSlug: 'aussie-pupuk-cair-organik',
    description: 'Hentikan penularan spora bercak daun kuning-oranye Curvularia, keringkan busuk pucuk tombak, dan kunci mati jamur Ganoderma dalam 14-21 hari.',
    image: '/images/landing/obat-sawit-busuk-pucuk-ganoderma/hero-problem.webp',
    isActive: true,
  },
  {
    slug: 'obat-sawit-buah-cengkeh-landak',
    title: 'Aussie - Pengubah Sawit Buah Cengkeh, Buah Landak & Bunga Jantan Vesipera Jadi Tandan Normal 30+ Kg',
    productSlug: 'aussie-pupuk-cair-organik',
    description: 'Buka kuncian hara tanah gambut dan mineral masam, seimbangkan hormon bunga betina, dan ubah buah cengkeh/landak menjadi janjang TBS padat berbobot.',
    image: '/images/landing/obat-sawit-buah-cengkeh-landak/hero-problem.webp',
    isActive: true,
  },
  {
    slug: 'pemulih-cabai-stres-kuning-keriting',
    title: 'Bensu - Stimulator Imun 3x Lebih Cepat Pemulih Daun Cabai Stres Keriting, Menguning & Layu',
    productSlug: 'bensu-pupuk-cair-organik',
    description: 'Tingkatkan kekebalan tanaman cabai 3x lebih cepat, buka pucuk keriting kaku dan daun menguning layu menjadi trubus hijau segar dalam 72 jam.',
    image: '/images/landing/pemulih-cabai-stres-kuning-keriting/hero-problem.webp',
    isActive: true,
  },
  {
    slug: 'booster-padi-anakan-bulir-bernas',
    title: 'Bensu - Obat Padi Asem-Aseman (Merah Kerdil) & Booster 45+ Anakan Bulir Bernas Formula Thailand',
    productSlug: 'bensu-pupuk-cair-organik',
    description: 'Stop tabur Urea saat padi asem-aseman! Sembuhkan daun merah karat & kerdil dalam 4 hari, keluar akar putih gondrong 48 jam, meledak 45+ anakan produktif, dan bulir bernas padat sampai pangkal malai.',
    image: '/images/landing/booster-padi-anakan-bulir-bernas/hero-problem.webp',
    isActive: true,
  },
  {
    slug: 'imun-bawang-merah-anti-moler',
    title: 'Bensu - Perisai Imun Bawang Merah Sejak 10 HST Anti-Moler Hujan Malam & Pembesar Umbi Merah Merona',
    productSlug: 'bensu-pupuk-cair-organik',
    description: 'Bentengi imun bawang merah sejak 10 HST agar daun pipa tegak kaku tahan guyuran hujan malam, bebas layu moler Fusarium, dan umbi membesar berbobot.',
    image: '/images/landing/imun-bawang-merah-anti-moler/hero-problem.webp',
    isActive: true,
  },
  {
    slug: 'serum-pelebat-buah-asam-amino',
    title: 'Saratoga - Serum Asam Amino Jepang Pelebat Buah Cabai, Tomat & Buah Tahunan Tanpa Bau Amis',
    productSlug: 'saratoga-serum-tanaman-premium',
    description: 'Kunci 98% cincin tangkai bunga dan bakal pentil anti-rontok dalam 48 jam serta lebatkan dompolan buah cabai, tomat, durian, dan mangga tanpa bau amis.',
    image: '/images/landing/serum-pelebat-buah-asam-amino/hero-problem.webp',
    isActive: true,
  },
  {
    slug: 'serum-anggrek-mekar-tanpa-amis',
    title: 'Saratoga - Serum Jepang Pemecah Spike Anggrek Mekar Lebat, Mawar & Aglonema 100% Tanpa Bau Amis',
    productSlug: 'saratoga-serum-tanaman-premium',
    description: 'Bangunkan mata tidur spike anggrek yang susah berbunga dalam 14 hari, tajamkan mutasi warna merah Aglonema, dan belah daun Monstera tanpa bau amis di teras.',
    image: '/images/landing/serum-anggrek-mekar-tanpa-amis/hero-problem.webp',
    isActive: true,
  },
  {
    slug: 'perisai-silika-bulai-jagung-cabai',
    title: 'Kojien - Perisai Kaca Nano-Silika Penakluk Jagung Bule Bulai & Pelindung Cabai 40 HST Tahan Keriting Patek',
    productSlug: 'kojien',
    description: 'Lapisi epidermis daun jagung dan cabai dengan kristal kaca Ortho-Silicic Acid (OSA) agar kebal spora jamur Bulai putih, Patek Antraknosa, dan tusukan Thrips/Kutu Kebul.',
    image: '/images/landing/perisai-silika-bulai-jagung-cabai/hero-problem.webp',
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
export const installRouteSlugs: string[] = ['meta-ads'];
