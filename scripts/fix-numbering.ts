/**
 * Corrects article numbering for SA (ID/SG) and PKWT (ID/SG) after enrichment.
 * Renumbers the existing middle clauses and the appended clauses into a single
 * consistent sequence (NDA was already sequential and is untouched here).
 *
 * Usage: npx tsx scripts/fix-numbering.ts
 */
import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({
  host: process.env.PGHOST, port: Number(process.env.PGPORT ?? 5432),
  user: process.env.PGUSER, password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE ?? "lexsea", ssl: { rejectUnauthorized: false },
});

interface Fix { slug: string; code: string; key: string; sort: number; content: string; }
const F: Fix[] = [];
const fix = (slug: string, code: string, key: string, sort: number, content: string) =>
  F.push({ slug, code, key, sort, content: content.trim() });

// ── Service Agreement ID — final order: 1 scope, 2 term, 3 payment, 4 IP,
//    5 warranty, 6 confidentiality, 7 termination, 8 liability, 9 force majeure,
//    10 relationship, 11 governing law, 12 general ───────────────────────────
fix("service-agreement", "ID", "sa_confidentiality_id", 60, `
PASAL 6 — KERAHASIAAN

Masing-masing Pihak wajib menjaga kerahasiaan informasi bisnis dan teknis milik Pihak lainnya yang diperoleh sehubungan dengan pelaksanaan Perjanjian ini. Kewajiban ini berlaku selama {{confidentiality_years}} tahun setelah berakhirnya Perjanjian.
`);
fix("service-agreement", "ID", "sa_termination_id", 70, `
PASAL 7 — PENGAKHIRAN

7.1 Salah satu Pihak dapat mengakhiri Perjanjian ini dengan memberikan pemberitahuan tertulis {{notice_days}} ({{notice_days_text}}) hari sebelumnya.
7.2 Dalam hal pengakhiran oleh Klien sebelum pekerjaan selesai, Klien wajib membayar seluruh jasa yang telah diselesaikan hingga tanggal pengakhiran.
7.3 Ketentuan mengenai kerahasiaan, hak kekayaan intelektual, dan pembatasan tanggung jawab tetap berlaku setelah berakhirnya Perjanjian ini.
`);
fix("service-agreement", "ID", "sa_liability_id", 75, `
PASAL 8 — TANGGUNG JAWAB DAN GANTI RUGI

8.1 Sepanjang diperbolehkan oleh hukum, total tanggung jawab masing-masing Pihak yang timbul dari atau sehubungan dengan Perjanjian ini tidak melebihi jumlah total biaya yang dibayarkan berdasarkan Perjanjian ini.
8.2 Tidak ada Pihak yang bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial, termasuk kehilangan keuntungan atau peluang usaha.
8.3 Pembatasan ini tidak berlaku terhadap kewajiban yang timbul dari kesengajaan, kelalaian berat, atau pelanggaran kewajiban kerahasiaan.
`);
fix("service-agreement", "ID", "sa_force_majeure_id", 78, `
PASAL 9 — KEADAAN KAHAR (FORCE MAJEURE)

9.1 Tidak ada Pihak yang bertanggung jawab atas keterlambatan atau kegagalan pelaksanaan kewajiban yang disebabkan oleh keadaan di luar kendali yang wajar, termasuk bencana alam, kebakaran, perang, kerusuhan, pandemi, atau tindakan pemerintah ("Keadaan Kahar").
9.2 Pihak yang mengalami Keadaan Kahar wajib memberitahukan Pihak lainnya secara wajar dan berupaya sebaik mungkin untuk meminimalkan dampaknya. Apabila Keadaan Kahar berlangsung lebih dari 60 (enam puluh) hari, salah satu Pihak dapat mengakhiri Perjanjian dengan pemberitahuan tertulis.
`);
fix("service-agreement", "ID", "sa_independent_id", 82, `
PASAL 10 — HUBUNGAN PARA PIHAK

Penyedia Jasa merupakan kontraktor independen. Tidak ada ketentuan dalam Perjanjian ini yang menciptakan hubungan kerja, keagenan, kemitraan, atau usaha patungan antara Para Pihak. Penyedia Jasa bertanggung jawab atas kewajiban perpajakan dan ketenagakerjaannya sendiri.
`);
fix("service-agreement", "ID", "sa_governing_law_id", 85, `
PASAL 11 — HUKUM YANG BERLAKU DAN PENYELESAIAN SENGKETA

11.1 Perjanjian ini tunduk pada hukum Negara Republik Indonesia.
11.2 Setiap sengketa diselesaikan terlebih dahulu secara musyawarah untuk mufakat. Apabila tidak tercapai dalam 30 (tiga puluh) hari, sengketa diselesaikan melalui Pengadilan Negeri di {{dispute_resolution_city}}.
`);
fix("service-agreement", "ID", "sa_general_id", 90, `
PASAL 12 — KETENTUAN UMUM

12.1 Keseluruhan Perjanjian. Perjanjian ini merupakan keseluruhan kesepakatan Para Pihak dan menggantikan seluruh kesepakatan sebelumnya.
12.2 Perubahan. Setiap perubahan hanya sah apabila dibuat tertulis dan ditandatangani Para Pihak.
12.3 Keterpisahan. Apabila salah satu ketentuan tidak sah, ketentuan lainnya tetap berlaku.
12.4 Pengalihan. Tidak ada Pihak yang dapat mengalihkan haknya tanpa persetujuan tertulis Pihak lainnya.
12.5 Pemberitahuan. Seluruh pemberitahuan berdasarkan Perjanjian ini dibuat secara tertulis dan disampaikan ke alamat masing-masing Pihak yang tercantum di atas.
`);

// ── Service Agreement SG — same final order ─────────────────────────────────
fix("service-agreement", "SG", "sa_confidentiality_sg", 60, `
6. CONFIDENTIALITY

Each party shall keep confidential all business and technical information of the other party obtained in connection with this Agreement. This obligation shall survive for {{confidentiality_years}} years following termination of this Agreement.
`);
fix("service-agreement", "SG", "sa_termination_sg", 70, `
7. TERMINATION

7.1 Either party may terminate this Agreement by providing {{notice_days}} ({{notice_days_text}}) days' written notice to the other party.
7.2 In the event of termination by the Client before completion of services, the Client shall pay for all services rendered up to the date of termination.
7.3 The provisions on confidentiality, intellectual property, and limitation of liability shall survive termination of this Agreement.
`);
fix("service-agreement", "SG", "sa_liability_sg", 75, `
8. LIMITATION OF LIABILITY

8.1 To the extent permitted by law, each party's total aggregate liability arising out of or in connection with this Agreement shall not exceed the total fees paid under this Agreement.
8.2 Neither party shall be liable for any indirect, incidental, or consequential loss, including loss of profit or business opportunity.
8.3 These limitations do not apply to liability arising from wilful misconduct, gross negligence, or breach of confidentiality obligations.
`);
fix("service-agreement", "SG", "sa_force_majeure_sg", 78, `
9. FORCE MAJEURE

9.1 Neither party shall be liable for any delay or failure to perform caused by circumstances beyond its reasonable control, including acts of God, fire, war, civil unrest, pandemic, or governmental action ("Force Majeure").
9.2 The affected party shall give reasonable notice to the other and use reasonable efforts to mitigate the impact. If a Force Majeure event continues for more than 60 (sixty) days, either party may terminate this Agreement on written notice.
`);
fix("service-agreement", "SG", "sa_independent_sg", 82, `
10. RELATIONSHIP OF THE PARTIES

The Service Provider is an independent contractor. Nothing in this Agreement creates any employment, agency, partnership, or joint venture between the parties. The Service Provider is responsible for its own tax and statutory obligations.
`);
fix("service-agreement", "SG", "sa_governing_law_sg", 85, `
11. GOVERNING LAW AND DISPUTE RESOLUTION

11.1 This Agreement is governed by the laws of the Republic of Singapore.
11.2 Any dispute arising out of or in connection with this Agreement shall first be referred to mediation administered by the Singapore Mediation Centre. Failing resolution, the dispute shall be subject to the exclusive jurisdiction of the Singapore courts.
`);
fix("service-agreement", "SG", "sa_general_sg", 90, `
12. GENERAL PROVISIONS

12.1 Entire Agreement. This Agreement constitutes the entire agreement between the parties and supersedes all prior agreements.
12.2 Amendment. No amendment is effective unless made in writing and signed by both parties.
12.3 Severability. If any provision is held invalid, the remaining provisions shall continue in full force and effect.
12.4 Assignment. Neither party may assign its rights without the prior written consent of the other.
12.5 Notices. All notices under this Agreement shall be in writing and sent to each party's address stated above.
`);

// ── PKWT ID — final: ...6 termination, 7 IP, 8 governing law, 9 general ──────
fix("pkwt", "ID", "pkwt_governing_law_id", 80, `
PASAL 8 — HUKUM YANG BERLAKU

Perjanjian ini tunduk pada hukum Republik Indonesia, khususnya peraturan perundang-undangan di bidang ketenagakerjaan dan peraturan pelaksanaannya. Setiap perselisihan hubungan industrial diselesaikan terlebih dahulu melalui perundingan bipartit, dan apabila tidak tercapai, melalui mekanisme yang diatur dalam peraturan perundang-undangan tentang penyelesaian perselisihan hubungan industrial.
`);
fix("pkwt", "ID", "pkwt_general_id", 90, `
PASAL 9 — KETENTUAN UMUM

9.1 Perjanjian ini merupakan keseluruhan kesepakatan Para Pihak mengenai hubungan kerja dan menggantikan seluruh kesepakatan sebelumnya.
9.2 Setiap perubahan atas Perjanjian ini hanya sah apabila dibuat secara tertulis dan disepakati Para Pihak.
9.3 Apabila salah satu ketentuan dinyatakan tidak sah, ketentuan lainnya tetap berlaku.
9.4 Hal-hal yang belum atau tidak cukup diatur dalam Perjanjian ini tunduk pada peraturan perusahaan dan peraturan perundang-undangan di bidang ketenagakerjaan.
`);

// ── PKWT SG — final: ...7 termination, 8 IP, 9 governing law, 10 general ─────
fix("pkwt", "SG", "pkwt_governing_law_sg", 80, `
9. GOVERNING LAW

This Agreement is governed by and shall be construed in accordance with the laws of the Republic of Singapore. Any dispute shall be referred to the Employment Claims Tribunal (ECT) or such other body as may be designated by applicable law.
`);
fix("pkwt", "SG", "pkwt_general_sg", 95, `
10. GENERAL PROVISIONS

10.1 Entire Agreement. This Agreement, together with the Employee Handbook, constitutes the entire agreement between the parties regarding the employment and supersedes all prior agreements.
10.2 Amendment. No amendment is effective unless made in writing and agreed by both parties.
10.3 Severability. If any provision is held invalid, the remaining provisions shall continue in full force and effect.
`);

async function run() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    let n = 0;
    for (const f of F) {
      const res = await client.query(
        `UPDATE clauses SET content = $1, sort_order = $2
         WHERE clause_key = $3
           AND document_type_id = (SELECT id FROM document_types WHERE slug = $4)
           AND jurisdiction_id  = (SELECT id FROM jurisdictions   WHERE code = $5)`,
        [f.content, f.sort, f.key, f.slug, f.code]
      );
      if (res.rowCount === 0) console.warn(`!! not found: ${f.slug}/${f.code}/${f.key}`);
      else n += res.rowCount ?? 0;
    }
    await client.query("COMMIT");
    console.log(`✅  Numbering fixed — ${n} clauses updated.`);
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
