/**
 * Enriches clause content and adds genuinely-standard clauses for all three
 * documents (NDA, PKWT, Service Agreement) in both jurisdictions (ID & SG).
 *
 * Principles:
 *  - Only well-established, standard contract provisions are added — nothing
 *    invented or party-specific.
 *  - Existing required clauses are renumbered consistently when new clauses are
 *    inserted before the governing-law article.
 *  - Conditional clauses (probation, remote work) keep their un-numbered
 *    "PASAL —" form so they never create gaps when absent.
 *
 * Idempotent: upsert by clause_key. Usage: npx tsx scripts/enrich-clauses.ts
 */
import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({
  host: process.env.PGHOST, port: Number(process.env.PGPORT ?? 5432),
  user: process.env.PGUSER, password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE ?? "lexsea", ssl: { rejectUnauthorized: false },
});

interface ClauseDef {
  slug: "nda" | "pkwt" | "service-agreement";
  code: "ID" | "SG";
  key:  string;
  content: string;
  ref:  string | null;
  sort: number;
}

const C: ClauseDef[] = [];
const add = (slug: ClauseDef["slug"], code: ClauseDef["code"], key: string, sort: number, ref: string | null, content: string) =>
  C.push({ slug, code, key, sort, ref, content: content.trim() });

// ════════════════════════════════════════════════════════════════════════════
// NDA — INDONESIA  (articles 1..10)
// ════════════════════════════════════════════════════════════════════════════
add("nda", "ID", "nda_definition_id", 30, "UU No. 30 Tahun 2000 tentang Rahasia Dagang", `
PASAL 2 — DEFINISI

2.1 "Informasi Rahasia" berarti setiap informasi non-publik yang diungkapkan oleh salah satu Pihak ("Pihak Pengungkap") kepada Pihak lainnya ("Pihak Penerima"), baik secara tertulis, lisan, elektronik, visual, maupun dalam bentuk lainnya, yang ditandai sebagai "Rahasia" atau yang berdasarkan sifat informasi dan keadaan pengungkapannya secara wajar patut dimengerti bersifat rahasia.

2.2 Informasi Rahasia mencakup, namun tidak terbatas pada, rahasia dagang, data teknis, kode sumber, rancangan produk, strategi bisnis, data keuangan, daftar pelanggan dan pemasok, serta informasi harga.

2.3 "Perwakilan" berarti direktur, pejabat, karyawan, afiliasi, penasihat profesional, dan kontraktor dari Pihak Penerima yang perlu mengetahui Informasi Rahasia untuk Tujuan.
`);

add("nda", "ID", "nda_obligations_id", 40, "UU No. 30 Tahun 2000 Pasal 3", `
PASAL 3 — KEWAJIBAN KERAHASIAAN

Pihak Penerima wajib:
(a) menjaga kerahasiaan Informasi Rahasia milik Pihak Pengungkap dengan tingkat kehati-hatian yang sama seperti melindungi informasi rahasianya sendiri, dan sekurang-kurangnya dengan kehati-hatian yang wajar;
(b) tidak mengungkapkan Informasi Rahasia kepada pihak ketiga manapun tanpa persetujuan tertulis terlebih dahulu dari Pihak Pengungkap;
(c) membatasi akses atas Informasi Rahasia hanya kepada Perwakilan yang perlu mengetahuinya untuk Tujuan, dan memastikan Perwakilan tersebut terikat kewajiban kerahasiaan yang tidak kurang ketat dari Perjanjian ini;
(d) menggunakan Informasi Rahasia semata-mata untuk Tujuan dan tidak untuk kepentingan lain;
(e) tidak menyalin atau menggandakan Informasi Rahasia kecuali sepanjang diperlukan untuk Tujuan; dan
(f) memberitahukan Pihak Pengungkap segera secara tertulis setelah mengetahui adanya pengungkapan atau penggunaan Informasi Rahasia yang tidak sah.

Pihak Penerima bertanggung jawab atas setiap pelanggaran Perjanjian ini yang dilakukan oleh Perwakilannya.
`);

add("nda", "ID", "nda_return_id", 55, null, `
PASAL 5 — PENGEMBALIAN INFORMASI

5.1 Atas permintaan tertulis Pihak Pengungkap, atau pada saat berakhirnya Perjanjian ini, Pihak Penerima wajib mengembalikan atau memusnahkan seluruh Informasi Rahasia beserta salinannya yang berada dalam penguasaannya.

5.2 Atas permintaan, Pihak Penerima memberikan konfirmasi tertulis bahwa kewajiban pengembalian atau pemusnahan tersebut telah dilaksanakan.

5.3 Pihak Penerima dapat menyimpan satu salinan arsip sepanjang diwajibkan oleh peraturan perundang-undangan atau kebijakan penyimpanan internal yang wajar, dengan ketentuan salinan tersebut tetap tunduk pada kewajiban kerahasiaan dalam Perjanjian ini.
`);

add("nda", "ID", "nda_term_id", 60, null, `
PASAL 6 — JANGKA WAKTU

Perjanjian ini berlaku selama {{duration_years}} ({{duration_years_text}}) tahun terhitung sejak tanggal penandatanganan dan tetap berlaku selama {{post_termination_years}} ({{post_termination_years_text}}) tahun setelah pengakhiran atau berakhirnya hubungan bisnis Para Pihak. Kewajiban kerahasiaan atas Informasi Rahasia yang merupakan rahasia dagang tetap berlaku selama informasi tersebut memenuhi kualifikasi sebagai rahasia dagang berdasarkan peraturan perundang-undangan.
`);

add("nda", "ID", "nda_remedies_id", 65, null, `
PASAL 7 — UPAYA HUKUM

7.1 Para Pihak mengakui bahwa pelanggaran terhadap Perjanjian ini dapat menimbulkan kerugian yang tidak dapat dipulihkan sepenuhnya dengan ganti rugi uang semata.

7.2 Oleh karena itu, selain upaya hukum lain yang tersedia, Pihak Pengungkap berhak mengajukan permohonan upaya hukum yang bersifat memaksa untuk menghentikan atau mencegah pelanggaran, tanpa mengurangi haknya untuk menuntut ganti rugi atas kerugian yang nyata diderita.
`);

add("nda", "ID", "nda_no_license_id", 67, null, `
PASAL 8 — TANPA LISENSI DAN TANPA JAMINAN

8.1 Tidak ada ketentuan dalam Perjanjian ini yang dapat ditafsirkan sebagai pemberian lisensi atau pengalihan hak kekayaan intelektual apa pun atas Informasi Rahasia kepada Pihak Penerima. Seluruh hak tetap menjadi milik Pihak Pengungkap.

8.2 Informasi Rahasia diberikan "sebagaimana adanya". Pihak Pengungkap tidak memberikan jaminan atas keakuratan atau kelengkapan Informasi Rahasia, dan Perjanjian ini tidak mewajibkan Para Pihak untuk melanjutkan ke transaksi atau hubungan bisnis apa pun.
`);

add("nda", "ID", "nda_governing_law_id", 70, "UU No. 30 Tahun 1999 tentang Arbitrase", `
PASAL 9 — HUKUM YANG BERLAKU DAN PENYELESAIAN SENGKETA

9.1 Perjanjian ini tunduk pada dan ditafsirkan menurut hukum Republik Indonesia.

9.2 Setiap sengketa yang timbul dari atau sehubungan dengan Perjanjian ini terlebih dahulu diupayakan diselesaikan secara musyawarah. Apabila dalam waktu 30 (tiga puluh) hari tidak tercapai penyelesaian, sengketa diselesaikan melalui Badan Arbitrase Nasional Indonesia (BANI) di Jakarta sesuai dengan peraturan dan prosedurnya.
`);

add("nda", "ID", "nda_general_id", 90, null, `
PASAL 10 — KETENTUAN UMUM

10.1 Keseluruhan Perjanjian. Perjanjian ini merupakan keseluruhan kesepakatan Para Pihak mengenai pokok perjanjian dan menggantikan seluruh komunikasi dan kesepakatan sebelumnya, baik lisan maupun tertulis.

10.2 Perubahan. Setiap perubahan atas Perjanjian ini hanya sah apabila dibuat secara tertulis dan ditandatangani oleh Para Pihak.

10.3 Keterpisahan. Apabila salah satu ketentuan dinyatakan tidak sah atau tidak dapat dilaksanakan, ketentuan lainnya tetap berlaku penuh.

10.4 Pengesampingan. Kelalaian salah satu Pihak untuk menuntut pelaksanaan suatu ketentuan tidak dianggap sebagai pengesampingan atas hak tersebut.

10.5 Pengalihan. Tidak ada Pihak yang dapat mengalihkan hak atau kewajibannya berdasarkan Perjanjian ini tanpa persetujuan tertulis terlebih dahulu dari Pihak lainnya.
`);

// ════════════════════════════════════════════════════════════════════════════
// NDA — SINGAPORE  (clauses 1..10)
// ════════════════════════════════════════════════════════════════════════════
add("nda", "SG", "nda_definition_sg", 30, "Singapore — common law of confidence", `
2. DEFINITION OF CONFIDENTIAL INFORMATION

2.1 "Confidential Information" means any non-public information disclosed by one party (the "Disclosing Party") to the other (the "Receiving Party"), whether in writing, orally, electronically, visually, or in any other form, that is designated as "Confidential" or that, given the nature of the information and the circumstances of disclosure, ought reasonably to be treated as confidential.

2.2 Confidential Information includes, without limitation, trade secrets, technical data, source code, product designs, business strategies, financial information, customer and supplier lists, and pricing information.

2.3 "Representatives" means the directors, officers, employees, affiliates, professional advisers, and contractors of the Receiving Party who need to know the Confidential Information for the Purpose.
`);

add("nda", "SG", "nda_obligations_sg", 40, null, `
3. CONFIDENTIALITY OBLIGATIONS

The Receiving Party shall:
(a) hold the Disclosing Party's Confidential Information in strict confidence, using at least the same degree of care it uses to protect its own confidential information and no less than a reasonable degree of care;
(b) not disclose the Confidential Information to any third party without the prior written consent of the Disclosing Party;
(c) limit access to the Confidential Information to those Representatives who need to know it for the Purpose, and ensure those Representatives are bound by confidentiality obligations no less restrictive than those in this Agreement;
(d) use the Confidential Information solely for the Purpose and for no other purpose;
(e) not copy or reproduce the Confidential Information except as necessary for the Purpose; and
(f) promptly notify the Disclosing Party in writing upon becoming aware of any unauthorised disclosure or use of the Confidential Information.

The Receiving Party is responsible for any breach of this Agreement by its Representatives.
`);

add("nda", "SG", "nda_return_sg", 55, null, `
5. RETURN OF CONFIDENTIAL INFORMATION

5.1 Upon the Disclosing Party's written request, or upon termination of this Agreement, the Receiving Party shall return or destroy all Confidential Information and all copies in its possession.

5.2 Upon request, the Receiving Party shall confirm in writing that it has complied with this obligation.

5.3 The Receiving Party may retain one archival copy to the extent required by law or its reasonable internal retention policy, provided that such copy remains subject to the confidentiality obligations of this Agreement.
`);

add("nda", "SG", "nda_term_sg", 60, null, `
6. TERM

This Agreement shall commence on the date first written above and continue for a period of {{duration_years}} ({{duration_years_text}}) years. The confidentiality obligations shall survive termination for a further period of {{post_termination_years}} ({{post_termination_years_text}}) years, and shall continue indefinitely in respect of any Confidential Information that constitutes a trade secret for so long as it remains a trade secret.
`);

add("nda", "SG", "nda_remedies_sg", 65, null, `
7. REMEDIES

7.1 The parties acknowledge that a breach of this Agreement may cause irreparable harm for which monetary damages alone may be an inadequate remedy.

7.2 Accordingly, in addition to any other remedies available, the Disclosing Party shall be entitled to seek injunctive relief to restrain any breach or threatened breach, without prejudice to its right to claim damages for loss actually suffered.
`);

add("nda", "SG", "nda_no_license_sg", 67, null, `
8. NO LICENCE; NO WARRANTY

8.1 Nothing in this Agreement grants the Receiving Party any licence or transfer of any intellectual property rights in the Confidential Information. All rights remain with the Disclosing Party.

8.2 The Confidential Information is provided "as is". The Disclosing Party makes no warranty as to its accuracy or completeness, and this Agreement does not oblige either party to proceed with any transaction or business relationship.
`);

add("nda", "SG", "nda_governing_law_sg", 70, "Singapore Arbitration / SIAC Rules", `
9. GOVERNING LAW AND DISPUTE RESOLUTION

9.1 This Agreement is governed by and construed in accordance with the laws of the Republic of Singapore.

9.2 Any dispute arising out of or in connection with this Agreement shall first be attempted to be resolved amicably between the parties. Failing resolution within 30 (thirty) days, the dispute shall be referred to and finally resolved by arbitration at the Singapore International Arbitration Centre (SIAC) in accordance with its rules.
`);

add("nda", "SG", "nda_general_sg", 90, null, `
10. GENERAL PROVISIONS

10.1 Entire Agreement. This Agreement constitutes the entire agreement between the parties regarding its subject matter and supersedes all prior communications and agreements, whether oral or written.

10.2 Amendment. No amendment to this Agreement is effective unless made in writing and signed by both parties.

10.3 Severability. If any provision is held invalid or unenforceable, the remaining provisions shall continue in full force and effect.

10.4 Waiver. A failure by either party to enforce any provision shall not be deemed a waiver of that provision.

10.5 Assignment. Neither party may assign its rights or obligations under this Agreement without the prior written consent of the other party.
`);

// ════════════════════════════════════════════════════════════════════════════
// PKWT — INDONESIA  (required articles 1..7 + appended 8; conditional stay un-numbered)
// ════════════════════════════════════════════════════════════════════════════
add("pkwt", "ID", "pkwt_position_id", 20, null, `
PASAL 1 — JABATAN DAN TUGAS

1.1 Perusahaan mempekerjakan Karyawan sebagai {{job_title}} pada divisi/departemen {{department}}.
1.2 Karyawan wajib melaksanakan tugas dan tanggung jawab sebagaimana ditetapkan oleh Perusahaan, termasuk tugas-tugas lain yang sewaktu-waktu diberikan secara wajar sesuai dengan jabatan tersebut.
1.3 Karyawan bertanggung jawab kepada {{reporting_to}}.
1.4 Karyawan wajib menjalankan tugasnya dengan sungguh-sungguh, jujur, dan sesuai dengan peraturan perusahaan serta kode etik yang berlaku.
`);

add("pkwt", "ID", "pkwt_salary_id", 40, "UU Ketenagakerjaan jo. UU Cipta Kerja — Pengupahan", `
PASAL 3 — GAJI DAN TUNJANGAN

3.1 Perusahaan membayar Karyawan gaji pokok sebesar Rp {{salary_amount}} ({{salary_amount_text}} Rupiah) per bulan.
3.2 Gaji dibayarkan setiap bulan pada tanggal {{salary_payment_date}} melalui transfer ke rekening yang ditunjuk Karyawan.
3.3 Gaji telah dipotong pajak penghasilan (PPh 21) dan iuran sesuai ketentuan peraturan perundang-undangan yang berlaku.
3.4 Karyawan berhak atas tunjangan dan fasilitas lain sesuai peraturan perusahaan yang berlaku, termasuk kepesertaan dalam program jaminan sosial sebagaimana diwajibkan oleh peraturan perundang-undangan.
`);

add("pkwt", "ID", "pkwt_termination_id", 70, "UU Ketenagakerjaan — Pengakhiran PKWT", `
PASAL 6 — PENGAKHIRAN PERJANJIAN

6.1 Perjanjian ini berakhir secara otomatis pada tanggal {{end_date}} tanpa perlu pemberitahuan lebih lanjut.
6.2 Perjanjian dapat diakhiri lebih awal oleh salah satu Pihak dengan alasan-alasan yang diatur dalam peraturan perundang-undangan yang berlaku.
6.3 Dalam hal pengakhiran sebelum waktunya tanpa alasan yang sah, Pihak yang mengakhiri wajib membayar ganti rugi sebesar sisa upah yang seharusnya diterima Karyawan hingga batas waktu berakhirnya perjanjian kerja.
6.4 Pada saat berakhirnya hubungan kerja, Karyawan wajib mengembalikan seluruh barang, dokumen, data, dan aset milik Perusahaan yang berada dalam penguasaannya.
`);

add("pkwt", "ID", "pkwt_ip_id", 75, "UU No. 28 Tahun 2014 tentang Hak Cipta", `
PASAL 7 — HAK KEKAYAAN INTELEKTUAL

7.1 Seluruh hasil kerja, ciptaan, penemuan, dan karya yang dibuat oleh Karyawan dalam rangka pelaksanaan tugasnya selama masa kerja menjadi milik Perusahaan.
7.2 Karyawan, sepanjang diperlukan, memberikan bantuan yang wajar kepada Perusahaan untuk mendaftarkan dan melindungi hak kekayaan intelektual tersebut.
`);

add("pkwt", "ID", "pkwt_general_id", 90, null, `
PASAL 8 — KETENTUAN UMUM

8.1 Perjanjian ini merupakan keseluruhan kesepakatan Para Pihak mengenai hubungan kerja dan menggantikan seluruh kesepakatan sebelumnya.
8.2 Setiap perubahan atas Perjanjian ini hanya sah apabila dibuat secara tertulis dan disepakati Para Pihak.
8.3 Apabila salah satu ketentuan dinyatakan tidak sah, ketentuan lainnya tetap berlaku.
8.4 Hal-hal yang belum atau tidak cukup diatur dalam Perjanjian ini tunduk pada peraturan perusahaan dan peraturan perundang-undangan di bidang ketenagakerjaan.
`);

// ════════════════════════════════════════════════════════════════════════════
// PKWT — SINGAPORE  (clauses 1..8 + appended 9)
// ════════════════════════════════════════════════════════════════════════════
add("pkwt", "SG", "pkwt_salary_sg", 40, "Employment Act 1968 Part III", `
3. SALARY AND BENEFITS

3.1 The Employer shall pay the Employee a monthly salary of SGD {{salary_amount}} (Singapore Dollars {{salary_amount_text}}).
3.2 Salary shall be paid on the {{salary_payment_date}} of each calendar month, and in any event within 7 days after the end of the salary period as required by the Employment Act.
3.3 The Employer shall make Central Provident Fund (CPF) contributions for the Employee where applicable under prevailing law.
3.4 The Employee shall be entitled to benefits as set out in the Employee Handbook, which forms part of the terms of employment.
`);

add("pkwt", "SG", "pkwt_termination_sg", 70, "Employment Act 1968 s.10–11", `
7. TERMINATION

7.1 This Agreement shall automatically terminate on {{end_date}} without further notice.
7.2 Either party may terminate this Agreement during the term by giving {{notice_period_days}} days' written notice or payment in lieu thereof.
7.3 The Employer may terminate this Agreement without notice for cause, including gross misconduct, material breach of contract, or criminal conviction, subject to conducting a due inquiry where required.
7.4 On termination, the Employee shall return all property, documents, data, and assets of the Employer in the Employee's possession.
`);

add("pkwt", "SG", "pkwt_ip_sg", 75, "Copyright Act 2021 (Singapore)", `
8. INTELLECTUAL PROPERTY

8.1 All work product, inventions, and materials created by the Employee in the course of employment shall vest in and be the property of the Employer.
8.2 The Employee shall, where reasonably required, provide assistance to the Employer to register and protect such intellectual property.
`);

add("pkwt", "SG", "pkwt_general_sg", 95, null, `
9. GENERAL PROVISIONS

9.1 Entire Agreement. This Agreement, together with the Employee Handbook, constitutes the entire agreement between the parties regarding the employment and supersedes all prior agreements.
9.2 Amendment. No amendment is effective unless made in writing and agreed by both parties.
9.3 Severability. If any provision is held invalid, the remaining provisions shall continue in full force and effect.
9.4 Governing Law. This Agreement is governed by the laws of the Republic of Singapore.
`);

// ════════════════════════════════════════════════════════════════════════════
// SERVICE AGREEMENT — INDONESIA  (articles 1..11)
// ════════════════════════════════════════════════════════════════════════════
add("service-agreement", "ID", "sa_scope_id", 20, null, `
PASAL 1 — RUANG LINGKUP JASA

1.1 Penyedia Jasa setuju untuk menyediakan jasa sebagai berikut kepada Klien:
{{service_description}}

1.2 Penyedia Jasa akan menyampaikan hasil pekerjaan ("Deliverable") sebagaimana disepakati secara tertulis antara Para Pihak.
1.3 Setiap perubahan atas ruang lingkup jasa harus disepakati secara tertulis oleh Para Pihak sebelum dilaksanakan, termasuk penyesuaian biaya dan jangka waktu apabila diperlukan.
1.4 Klien wajib memberikan informasi, akses, dan kerja sama yang wajar yang diperlukan oleh Penyedia Jasa untuk melaksanakan jasa.
`);

add("service-agreement", "ID", "sa_payment_id", 40, null, `
PASAL 3 — PEMBAYARAN

3.1 Klien membayar kepada Penyedia Jasa sebesar Rp {{total_fee}} ({{total_fee_text}} Rupiah) untuk seluruh jasa yang disepakati.
3.2 Pembayaran dilakukan dengan jadwal: {{payment_schedule}}.
3.3 Pembayaran dilakukan melalui transfer bank ke rekening yang ditentukan oleh Penyedia Jasa, dan dianggap lunas pada saat dana diterima.
3.4 Keterlambatan pembayaran lebih dari 14 (empat belas) hari kalender dari tanggal jatuh tempo dapat dikenakan denda yang wajar sebagaimana disepakati Para Pihak, dan Penyedia Jasa berhak menangguhkan pelaksanaan jasa sampai pembayaran diterima.
3.5 Kecuali disepakati lain, biaya tidak termasuk pajak yang berlaku, yang menjadi tanggungan sesuai ketentuan peraturan perundang-undangan.
`);

add("service-agreement", "ID", "sa_warranty_id", 55, null, `
PASAL 5 — JAMINAN PELAKSANAAN

5.1 Penyedia Jasa menjamin bahwa jasa akan dilaksanakan dengan standar profesional dan kehati-hatian yang wajar sesuai praktik industri yang berlaku.
5.2 Penyedia Jasa menjamin bahwa Deliverable merupakan hasil karya yang sah dan, sepanjang pengetahuannya, tidak melanggar hak kekayaan intelektual pihak ketiga.
`);

add("service-agreement", "ID", "sa_liability_id", 75, null, `
PASAL 7 — TANGGUNG JAWAB DAN GANTI RUGI

7.1 Sepanjang diperbolehkan oleh hukum, total tanggung jawab masing-masing Pihak yang timbul dari atau sehubungan dengan Perjanjian ini tidak melebihi jumlah total biaya yang dibayarkan berdasarkan Perjanjian ini.
7.2 Tidak ada Pihak yang bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial, termasuk kehilangan keuntungan atau peluang usaha.
7.3 Pembatasan ini tidak berlaku terhadap kewajiban yang timbul dari kesengajaan, kelalaian berat, atau pelanggaran kewajiban kerahasiaan.
`);

add("service-agreement", "ID", "sa_force_majeure_id", 78, null, `
PASAL 8 — KEADAAN KAHAR (FORCE MAJEURE)

8.1 Tidak ada Pihak yang bertanggung jawab atas keterlambatan atau kegagalan pelaksanaan kewajiban yang disebabkan oleh keadaan di luar kendali yang wajar, termasuk bencana alam, kebakaran, perang, kerusuhan, pandemi, atau tindakan pemerintah ("Keadaan Kahar").

8.2 Pihak yang mengalami Keadaan Kahar wajib memberitahukan Pihak lainnya secara wajar dan berupaya sebaik mungkin untuk meminimalkan dampaknya. Apabila Keadaan Kahar berlangsung lebih dari 60 (enam puluh) hari, salah satu Pihak dapat mengakhiri Perjanjian dengan pemberitahuan tertulis.
`);

add("service-agreement", "ID", "sa_independent_id", 82, null, `
PASAL 9 — HUBUNGAN PARA PIHAK

Penyedia Jasa merupakan kontraktor independen. Tidak ada ketentuan dalam Perjanjian ini yang menciptakan hubungan kerja, keagenan, kemitraan, atau usaha patungan antara Para Pihak. Penyedia Jasa bertanggung jawab atas kewajiban perpajakan dan ketenagakerjaannya sendiri.
`);

add("service-agreement", "ID", "sa_governing_law_id", 85, null, `
PASAL 10 — HUKUM YANG BERLAKU DAN PENYELESAIAN SENGKETA

10.1 Perjanjian ini tunduk pada hukum Negara Republik Indonesia.
10.2 Setiap sengketa diselesaikan terlebih dahulu secara musyawarah untuk mufakat. Apabila tidak tercapai dalam 30 (tiga puluh) hari, sengketa diselesaikan melalui Pengadilan Negeri di {{dispute_resolution_city}}.
`);

add("service-agreement", "ID", "sa_general_id", 90, null, `
PASAL 11 — KETENTUAN UMUM

11.1 Keseluruhan Perjanjian. Perjanjian ini merupakan keseluruhan kesepakatan Para Pihak dan menggantikan seluruh kesepakatan sebelumnya.
11.2 Perubahan. Setiap perubahan hanya sah apabila dibuat tertulis dan ditandatangani Para Pihak.
11.3 Keterpisahan. Apabila salah satu ketentuan tidak sah, ketentuan lainnya tetap berlaku.
11.4 Pengalihan. Tidak ada Pihak yang dapat mengalihkan haknya tanpa persetujuan tertulis Pihak lainnya.
11.5 Pemberitahuan. Seluruh pemberitahuan berdasarkan Perjanjian ini dibuat secara tertulis dan disampaikan ke alamat masing-masing Pihak yang tercantum di atas.
`);

// ════════════════════════════════════════════════════════════════════════════
// SERVICE AGREEMENT — SINGAPORE  (clauses 1..11)
// ════════════════════════════════════════════════════════════════════════════
add("service-agreement", "SG", "sa_scope_sg", 20, null, `
1. SCOPE OF SERVICES

1.1 The Service Provider agrees to provide the following services to the Client:
{{service_description}}

1.2 The Service Provider shall deliver all agreed deliverables ("Deliverables") as further specified by mutual written agreement of the parties.
1.3 Any change to the scope of services must be agreed in writing before being carried out, including any adjustment to fees and timelines.
1.4 The Client shall provide the information, access, and reasonable cooperation required by the Service Provider to perform the services.
`);

add("service-agreement", "SG", "sa_payment_sg", 40, null, `
3. FEES AND PAYMENT

3.1 The Client shall pay the Service Provider a total fee of SGD {{total_fee}} (Singapore Dollars {{total_fee_text}}) for all services rendered.
3.2 Payment schedule: {{payment_schedule}}.
3.3 Payments shall be made by bank transfer to the account designated by the Service Provider and are deemed received upon credit of cleared funds.
3.4 Payments overdue by more than 14 (fourteen) calendar days may attract reasonable late-payment interest as agreed by the parties, and the Service Provider may suspend performance until payment is received.
3.5 Unless otherwise agreed, fees are exclusive of applicable taxes (including GST), which shall be borne in accordance with law.
`);

add("service-agreement", "SG", "sa_warranty_sg", 55, null, `
5. WARRANTIES

5.1 The Service Provider warrants that the services will be performed with reasonable skill, care, and professional diligence in accordance with prevailing industry standards.
5.2 The Service Provider warrants that the Deliverables are its original work and, to the best of its knowledge, do not infringe the intellectual property rights of any third party.
`);

add("service-agreement", "SG", "sa_liability_sg", 75, null, `
7. LIMITATION OF LIABILITY

7.1 To the extent permitted by law, each party's total aggregate liability arising out of or in connection with this Agreement shall not exceed the total fees paid under this Agreement.
7.2 Neither party shall be liable for any indirect, incidental, or consequential loss, including loss of profit or business opportunity.
7.3 These limitations do not apply to liability arising from wilful misconduct, gross negligence, or breach of confidentiality obligations.
`);

add("service-agreement", "SG", "sa_force_majeure_sg", 78, null, `
8. FORCE MAJEURE

8.1 Neither party shall be liable for any delay or failure to perform caused by circumstances beyond its reasonable control, including acts of God, fire, war, civil unrest, pandemic, or governmental action ("Force Majeure").

8.2 The affected party shall give reasonable notice to the other and use reasonable efforts to mitigate the impact. If a Force Majeure event continues for more than 60 (sixty) days, either party may terminate this Agreement on written notice.
`);

add("service-agreement", "SG", "sa_independent_sg", 82, null, `
9. RELATIONSHIP OF THE PARTIES

The Service Provider is an independent contractor. Nothing in this Agreement creates any employment, agency, partnership, or joint venture between the parties. The Service Provider is responsible for its own tax and statutory obligations.
`);

add("service-agreement", "SG", "sa_governing_law_sg", 85, null, `
10. GOVERNING LAW AND DISPUTE RESOLUTION

10.1 This Agreement is governed by the laws of the Republic of Singapore.
10.2 Any dispute arising out of or in connection with this Agreement shall first be referred to mediation administered by the Singapore Mediation Centre. Failing resolution, the dispute shall be subject to the exclusive jurisdiction of the Singapore courts.
`);

add("service-agreement", "SG", "sa_general_sg", 90, null, `
11. GENERAL PROVISIONS

11.1 Entire Agreement. This Agreement constitutes the entire agreement between the parties and supersedes all prior agreements.
11.2 Amendment. No amendment is effective unless made in writing and signed by both parties.
11.3 Severability. If any provision is held invalid, the remaining provisions shall continue in full force and effect.
11.4 Assignment. Neither party may assign its rights without the prior written consent of the other.
11.5 Notices. All notices under this Agreement shall be in writing and sent to each party's address stated above.
`);

// ════════════════════════════════════════════════════════════════════════════

async function run() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    let updated = 0, inserted = 0;

    for (const c of C) {
      const ids = await client.query<{ doc_id: number; jur_id: number }>(
        `SELECT dt.id AS doc_id, j.id AS jur_id
         FROM document_types dt, jurisdictions j
         WHERE dt.slug = $1 AND j.code = $2`,
        [c.slug, c.code]
      );
      if (ids.rows.length === 0) { console.warn(`!! missing ${c.slug}/${c.code}`); continue; }
      const { doc_id, jur_id } = ids.rows[0];

      const existing = await client.query<{ id: number }>(
        `SELECT id FROM clauses WHERE document_type_id = $1 AND jurisdiction_id = $2 AND clause_key = $3`,
        [doc_id, jur_id, c.key]
      );

      if (existing.rows.length > 0) {
        await client.query(
          `UPDATE clauses SET content = $1, article_ref = $2, sort_order = $3 WHERE id = $4`,
          [c.content, c.ref, c.sort, existing.rows[0].id]
        );
        updated++;
      } else {
        await client.query(
          `INSERT INTO clauses (document_type_id, jurisdiction_id, clause_key, content, article_ref, sort_order, is_required)
           VALUES ($1, $2, $3, $4, $5, $6, true)`,
          [doc_id, jur_id, c.key, c.content, c.ref, c.sort]
        );
        inserted++;
      }
    }

    await client.query("COMMIT");
    console.log(`✅  Clauses enriched — ${updated} updated, ${inserted} added.`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌  Failed:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
