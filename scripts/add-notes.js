/**
 * Adds [§] annotation notes to clause list items.
 * Notes are based on:
 *   - Indonesia: KUH Perdata, UU 13/2003, PP 35/2021, PP 36/2021
 *   - Singapore: Employment Act (EA), common law principles (Coco v Clark)
 */
const { Pool } = require("pg");
require("dotenv").config({ path: ".env.local" });

const pool = new Pool({
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT || "5432"),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: { rejectUnauthorized: false },
});

const updates = [
  // ── NDA Indonesia ──────────────────────────────────────────────────────────

  {
    key: "nda_obligations_id",
    content: `PASAL 3 — KEWAJIBAN KERAHASIAAN

Masing-masing Pihak wajib:
(a) menjaga kerahasiaan Informasi Rahasia milik Pihak lainnya;
[§] Berlaku bagi seluruh perwakilan dan karyawan Pihak penerima — dasar Ps. 1365 KUH Perdata.
(b) tidak mengungkapkan Informasi Rahasia tersebut kepada pihak ketiga manapun tanpa persetujuan tertulis terlebih dahulu dari Pihak pengungkap;
[§] Consent harus tertulis dan spesifik — persetujuan lisan tidak cukup sebagai bukti di pengadilan.
(c) menggunakan Informasi Rahasia tersebut semata-mata untuk Tujuan yang disebutkan dalam Perjanjian ini;
[§] Penggunaan di luar Tujuan merupakan wan prestasi meskipun tidak ada pengungkapan kepada pihak luar.
(d) memberitahu Pihak pengungkap segera setelah mengetahui adanya pengungkapan Informasi Rahasia yang tidak sah.
[§] Penundaan pelaporan dapat mengurangi hak ganti rugi Pihak pengungkap di pengadilan.`,
  },

  {
    key: "nda_exceptions_id",
    content: `PASAL 4 — PENGECUALIAN

Kewajiban kerahasiaan tidak berlaku untuk informasi yang:
(a) sudah diketahui umum sebelum atau setelah pengungkapan, bukan karena pelanggaran Perjanjian ini;
[§] Dibuktikan dengan timestamp publik — artikel, filing, atau dokumentasi dengan tanggal sebelum NDA.
(b) sudah diketahui oleh penerima sebelum pengungkapan, dibuktikan dengan catatan tertulis;
[§] Catatan internal harus bertanggal lebih awal dari tanggal NDA agar dapat dijadikan bukti yang sah.
(c) diperoleh secara sah dari pihak ketiga tanpa pembatasan kerahasiaan; atau
[§] Sumber ketiga juga tidak boleh terikat NDA dengan pihak pengungkap mengenai informasi yang sama.
(d) harus diungkapkan berdasarkan peraturan perundang-undangan atau perintah pengadilan.
[§] Ungkapkan hanya sebatas yang diwajibkan — beritahu pihak pengungkap segera agar dapat mengajukan keberatan.`,
  },

  // ── NDA Singapore ─────────────────────────────────────────────────────────

  {
    key: "nda_obligations_sg",
    content: `3. CONFIDENTIALITY OBLIGATIONS

Each Party agrees to:
(a) hold the other Party's Confidential Information in strict confidence;
[§] Mirrors the duty of confidence under Singapore common law (Coco v Clark [1968] FSR 415).
(b) not disclose the Confidential Information to any third party without the prior written consent of the disclosing Party;
[§] Includes employees on a need-to-know basis — broad internal disclosure can still constitute a breach.
(c) use the Confidential Information solely for the Purpose; and
[§] Any use beyond the defined Purpose — even without external disclosure — constitutes a breach.
(d) promptly notify the disclosing Party upon becoming aware of any unauthorized disclosure.
[§] Prompt notification preserves the disclosing Party's right to seek injunctive relief quickly.`,
  },

  {
    key: "nda_exceptions_sg",
    content: `4. EXCEPTIONS

Confidentiality obligations do not apply to information that:
(a) is or becomes generally available to the public other than through breach of this Agreement;
[§] 'Generally available' means accessible to the public at large — not merely to industry specialists.
(b) was known to the receiving Party before disclosure, as evidenced by written records;
[§] Pre-existing knowledge must be documented with a date preceding the NDA's effective date.
(c) is lawfully received from a third party without restriction; or
[§] The third-party source must not itself be bound by confidentiality to the disclosing Party.
(d) is required to be disclosed by law, regulation, or court order.
[§] Disclose only the minimum required — promptly notify the disclosing Party to allow a protective order application.`,
  },

  // ── PKWT Indonesia ────────────────────────────────────────────────────────

  {
    key: "pkwt_position_id",
    content: `PASAL 1 — JABATAN DAN TUGAS

1.1 Perusahaan mempekerjakan Karyawan sebagai {{job_title}} pada divisi/departemen {{department}}.
[§] Jabatan harus spesifik — deskripsi ambigu membuka ruang penolakan tugas oleh karyawan.
1.2 Karyawan wajib melaksanakan tugas dan tanggung jawab sebagaimana ditetapkan oleh Perusahaan, termasuk tugas-tugas lain yang sewaktu-waktu diberikan secara wajar sesuai dengan jabatan tersebut.
[§] Frasa "secara wajar" adalah kunci — tugas yang berbeda fundamental dapat diklaim sebagai pelanggaran kontrak.
1.3 Karyawan bertanggung jawab kepada {{reporting_to}}.
[§] Perubahan jalur pelaporan tanpa persetujuan berpotensi menjadi dasar klaim PHK sepihak (Ps. 169 UU 13/2003).`,
  },

  {
    key: "pkwt_term_id",
    content: `PASAL 2 — JANGKA WAKTU PERJANJIAN

2.1 Perjanjian ini berlaku selama {{contract_duration_months}} ({{contract_duration_months_text}}) bulan, terhitung sejak tanggal {{start_date}} sampai dengan tanggal {{end_date}}.
[§] PP No. 35/2021: PKWT maks. 5 tahun total termasuk perpanjangan. Melampaui batas = otomatis menjadi PKWTT.
2.2 Perjanjian ini dapat diperpanjang berdasarkan kesepakatan tertulis Para Pihak sebelum berakhirnya masa perjanjian, dengan memperhatikan ketentuan perundang-undangan yang berlaku.
[§] Perpanjangan harus ditandatangani sebelum kontrak berakhir — perpanjangan setelahnya otomatis jadi PKWTT.`,
  },

  {
    key: "pkwt_salary_id",
    content: `PASAL 3 — GAJI DAN TUNJANGAN

3.1 Perusahaan membayar Karyawan gaji pokok sebesar Rp {{salary_amount}} ({{salary_amount_text}} Rupiah) per bulan.
[§] Wajib ≥ UMP/UMK setempat — pelanggaran merupakan tindak pidana per Pasal 185 UU No. 13 Tahun 2003.
3.2 Gaji dibayarkan setiap bulan pada tanggal {{salary_payment_date}}.
[§] Keterlambatan > 3 hari kerja dikenakan denda 5%–50% per hari per PP No. 36/2021 Pasal 55.
3.3 Karyawan berhak atas tunjangan dan fasilitas lain sesuai peraturan perusahaan yang berlaku.
[§] Tunjangan rutin > 3 bulan berturut-turut menjadi hak tetap yang tidak dapat dicabut sepihak.`,
  },

  {
    key: "pkwt_working_hours_id",
    content: `PASAL 4 — WAKTU KERJA

4.1 Hari kerja adalah Senin sampai dengan {{work_days}}, dengan jam kerja pukul {{work_hours_start}} sampai dengan {{work_hours_end}} WIB.
[§] Maks. 8 jam/hari atau 40 jam/minggu (UU 13/2003 Ps. 77) — kelebihan wajib dihitung sebagai lembur.
4.2 Ketentuan mengenai lembur mengacu pada peraturan perundang-undangan yang berlaku dan peraturan perusahaan.
[§] Upah lembur: 1,5× jam pertama, 2× jam berikutnya dari upah per jam (PP No. 36/2021 Ps. 31).`,
  },

  {
    key: "pkwt_confidentiality_id",
    content: `PASAL 5 — KERAHASIAAN

5.1 Karyawan wajib menjaga kerahasiaan seluruh informasi bisnis, teknis, keuangan, dan operasional Perusahaan yang diperoleh selama masa kerja.
[§] Ruang lingkup yang terlalu luas berpotensi tidak dapat ditegakkan — pertimbangkan daftar kategori spesifik.
5.2 Kewajiban kerahasiaan ini tetap berlaku setelah berakhirnya perjanjian kerja ini.
[§] Tentukan durasi pasca-kerja secara eksplisit — tanpa batas waktu, klausul ini berpotensi dianggap tidak wajar.`,
  },

  {
    key: "pkwt_termination_id",
    content: `PASAL 6 — PENGAKHIRAN PERJANJIAN

6.1 Perjanjian ini berakhir secara otomatis pada tanggal {{end_date}} tanpa perlu pemberitahuan lebih lanjut.
[§] PKWT berakhir otomatis — tidak perlu prosedur PHK atau pesangon seperti PKWTT (Ps. 61A UU 13/2003).
6.2 Perjanjian dapat diakhiri lebih awal oleh salah satu Pihak dengan alasan-alasan yang diatur dalam peraturan perundang-undangan yang berlaku.
[§] Alasan PHK sebelum waktunya harus sesuai PP No. 35/2021 — PHK tanpa alasan sah dapat digugat ke PHI.
6.3 Dalam hal pengakhiran sebelum waktunya tanpa alasan yang sah, pihak yang mengakhiri wajib membayar ganti rugi sebesar sisa upah yang seharusnya diterima karyawan hingga batas waktu berlakunya perjanjian kerja.
[§] Dasar: Pasal 62 UU No. 13/2003 — besaran = sisa upah × sisa bulan kontrak.`,
  },

  // ── PKWT Singapore ────────────────────────────────────────────────────────

  {
    key: "pkwt_position_sg",
    content: `1. POSITION AND DUTIES

1.1 The Employer employs the Employee as {{job_title}} in the {{department}} department.
[§] Job title determines overtime/leave eligibility under Employment Act (EA) Part IV — specify accurately.
1.2 The Employee shall perform such duties as are reasonably assigned by the Employer from time to time consistent with the position.
[§] 'Reasonably' limits scope — wholly different duties may constitute constructive dismissal.
1.3 The Employee shall report to {{reporting_to}}.
[§] Unilateral change of reporting line may support a constructive dismissal claim at the Employment Claims Tribunal.`,
  },

  {
    key: "pkwt_term_sg",
    content: `2. TERM OF EMPLOYMENT

2.1 This Agreement shall commence on {{start_date}} and terminate on {{end_date}}, a period of {{contract_duration_months}} ({{contract_duration_months_text}}) months, unless terminated earlier in accordance with this Agreement.
[§] FTCs of ≥ 1 year must include notice/termination provisions; shorter contracts may exclude them under the EA.
2.2 This Agreement may be renewed by mutual written agreement of the parties prior to the expiry date.
[§] Back-to-back renewals totalling > 3 years may be reclassified as permanent employment in practice.`,
  },

  {
    key: "pkwt_salary_sg",
    content: `3. SALARY AND BENEFITS

3.1 The Employer shall pay the Employee a monthly salary of SGD {{salary_amount}} (Singapore Dollars {{salary_amount_text}}).
[§] No statutory minimum wage in Singapore (except Progressive Wage Model sectors) — benchmark against industry norms.
3.2 Salary shall be paid on the {{salary_payment_date}} of each calendar month.
[§] EA s.21: salary must be paid within 7 days of the last day of the salary period — late payment is a criminal offence.
3.3 The Employee shall be entitled to benefits as set out in the Employee Handbook.
[§] The Employee Handbook must be consistent with this Agreement — in any conflict, the more favourable provision applies.`,
  },

  {
    key: "pkwt_leave_sg",
    content: `5. LEAVE ENTITLEMENT

5.1 Annual Leave: The Employee is entitled to {{annual_leave_days}} days of paid annual leave per year, pro-rated for the first year of service.
[§] EA s.43: statutory minimum is 7 days after 1 year, rising to 14 days after 8 years — verify entitlement is at or above minimum.
5.2 Sick Leave: The Employee is entitled to paid sick leave in accordance with the Employment Act.
[§] EA s.89: 14 days paid outpatient sick leave after 6 months service; 60 days if hospitalised. No pro-ration below 3 months.
5.3 Public Holidays: The Employee is entitled to all Singapore public holidays.
[§] 11 gazetted PH per year — if required to work, entitled to 1 extra day's salary or a day in lieu (EA s.37).`,
  },

  {
    key: "pkwt_termination_sg",
    content: `7. TERMINATION

7.1 This Agreement shall automatically terminate on {{end_date}} without further notice.
[§] FTCs expire automatically — no notice required, unlike open-ended contracts which require notice or payment in lieu.
7.2 Either party may terminate this Agreement during the term by giving {{notice_period_days}} days' written notice or payment in lieu thereof.
[§] Payment in lieu = daily salary × notice days; the choice is at the terminating party's election under the EA.
7.3 The Employer may terminate this Agreement without notice for cause (gross misconduct, breach of contract, or criminal conviction).
[§] Best practice: conduct a due inquiry before summary dismissal — failure may expose the Employer to unfair dismissal claims.`,
  },

  // ── Service Agreement Indonesia ───────────────────────────────────────────

  {
    key: "sa_term_id",
    content: `PASAL 2 — JANGKA WAKTU

2.1 Perjanjian ini berlaku mulai tanggal {{start_date}} dan berakhir pada tanggal {{end_date}}, kecuali diakhiri lebih awal sesuai ketentuan Perjanjian ini.
[§] Tanggal berakhir yang jelas mencegah perjanjian dianggap berlaku selamanya tanpa batasan.
2.2 Para Pihak dapat memperpanjang Perjanjian ini berdasarkan kesepakatan tertulis.
[§] Perpanjangan tertulis sebelum tanggal berakhir — hindari perpanjangan otomatis yang tidak disengaja.`,
  },

  {
    key: "sa_payment_id",
    content: `PASAL 3 — PEMBAYARAN

3.1 Klien membayar kepada Penyedia Jasa sebesar Rp {{total_fee}} ({{total_fee_text}} Rupiah) untuk seluruh jasa yang disepakati.
[§] Cantumkan ketentuan kurs jika ada transaksi lintas batas — fluktuasi Rupiah dapat berdampak pada nilai riil.
3.2 Pembayaran dilakukan dengan jadwal: {{payment_schedule}}.
[§] Milestone payment lebih aman dari lump sum akhir — melindungi Penyedia Jasa dari risiko non-pembayaran.
3.3 Pembayaran dilakukan melalui transfer bank ke rekening yang ditentukan oleh Penyedia Jasa.
[§] Verifikasi rekening penerima melalui saluran terpisah — penipuan BEC (Business Email Compromise) lazim terjadi.`,
  },

  {
    key: "sa_ip_id",
    content: `PASAL 4 — HAK KEKAYAAN INTELEKTUAL

4.1 Seluruh hasil pekerjaan yang dibuat oleh Penyedia Jasa dalam rangka pelaksanaan Perjanjian ini menjadi milik Klien setelah pembayaran penuh diterima.
[§] "Pembayaran penuh" harus didefinisikan — pastikan mencakup semua invoice termasuk tagihan atas revisi.
4.2 Penyedia Jasa mempertahankan hak atas alat, metode, dan pengetahuan umum yang digunakan dalam pelaksanaan jasa.
[§] Background IP Penyedia harus didokumentasikan sebelum perjanjian dimulai untuk mencegah klaim transfer yang tidak disengaja.`,
  },

  {
    key: "sa_termination_id",
    content: `PASAL 6 — PENGAKHIRAN

6.1 Salah satu Pihak dapat mengakhiri Perjanjian ini dengan memberikan pemberitahuan tertulis {{notice_days}} ({{notice_days_text}}) hari sebelumnya.
[§] Tentukan cara pemberitahuan yang sah (email/surat tercatat) — email tanpa konfirmasi read-receipt sering diperdebatkan.
6.2 Dalam hal pengakhiran oleh Klien sebelum pekerjaan selesai, Klien wajib membayar seluruh jasa yang telah diselesaikan hingga tanggal pengakhiran.
[§] Definisikan metode pengukuran "jasa yang telah diselesaikan" — persentase, milestone, atau jam kerja tercatat.`,
  },

  // ── Service Agreement Singapore ───────────────────────────────────────────

  {
    key: "sa_term_sg",
    content: `2. TERM

2.1 This Agreement shall commence on {{start_date}} and expire on {{end_date}}, unless terminated earlier in accordance with this Agreement.
[§] Explicit end date prevents open-ended obligations — include a long-stop date if scope may expand.
2.2 The parties may renew this Agreement by mutual written consent prior to the expiry date.
[§] Specify the renewal notice period (e.g., 30 days before expiry) to avoid inadvertent lapse or unintended continuation.`,
  },

  {
    key: "sa_payment_sg",
    content: `3. FEES AND PAYMENT

3.1 The Client shall pay the Service Provider a total fee of SGD {{total_fee}} (Singapore Dollars {{total_fee_text}}) for all services rendered.
[§] SGD denomination eliminates FX risk; for USD billing, agree on a fixing mechanism (e.g., MAS rate on invoice date).
3.2 Payment schedule: {{payment_schedule}}.
[§] For larger engagements, milestone-based payment protects both parties against default and scope creep.
3.3 Payments shall be made by bank transfer to the account designated by the Service Provider.
[§] Verify recipient bank details via a separate secure channel — BEC (Business Email Compromise) fraud is prevalent.`,
  },

  {
    key: "sa_ip_sg",
    content: `4. INTELLECTUAL PROPERTY

4.1 All work product and deliverables created by the Service Provider under this Agreement shall vest in and become the property of the Client upon receipt of full payment.
[§] IP does not transfer on partial payment — consider escrow for high-value deliverables to protect both parties.
4.2 The Service Provider retains ownership of all pre-existing intellectual property, tools, methodologies, and general know-how used in performing the services.
[§] Pre-existing IP should be listed in a Schedule — without this, disputes may arise over what counts as 'background IP'.`,
  },

  {
    key: "sa_termination_sg",
    content: `6. TERMINATION

6.1 Either party may terminate this Agreement by providing {{notice_days}} ({{notice_days_text}}) days' written notice to the other party.
[§] Clarify whether email constitutes 'written notice' — specify designated addresses with read-receipt confirmation for certainty.
6.2 In the event of termination by the Client before completion of services, the Client shall pay for all services rendered up to the date of termination.
[§] Define 'services rendered' by reference to milestones, timesheets, or percentage-of-completion to prevent exit disputes.`,
  },
];

async function run() {
  let updated = 0;
  for (const { key, content } of updates) {
    const result = await pool.query(
      "UPDATE clauses SET content = $1 WHERE clause_key = $2",
      [content, key]
    );
    if (result.rowCount > 0) {
      console.log(`✓ ${key}`);
      updated++;
    } else {
      console.warn(`⚠ not found: ${key}`);
    }
  }
  console.log(`\nDone — ${updated}/${updates.length} clauses updated.`);
  await pool.end();
}

run().catch((e) => {
  console.error(e.message);
  pool.end();
});
