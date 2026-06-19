-- LexSEA Seed Data
-- Run AFTER 001_init.sql

-- ============================================================
-- JURISDICTIONS
-- ============================================================
INSERT INTO jurisdictions (code, name) VALUES
  ('ID', 'Indonesia'),
  ('SG', 'Singapore')
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- DOCUMENT TYPES
-- ============================================================
INSERT INTO document_types (slug, name, description) VALUES
  ('nda',               'Non-Disclosure Agreement (NDA)',     'Mutual NDA untuk melindungi informasi rahasia antara dua pihak.'),
  ('pkwt',              'Perjanjian Kerja / Employment Agreement', 'Perjanjian kerja untuk karyawan tetap atau kontrak.'),
  ('service-agreement', 'Service Agreement',                  'Perjanjian jasa antara penyedia layanan dan klien.')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- NDA — INDONESIA (Required clauses)
-- ============================================================
WITH doc AS (SELECT id FROM document_types WHERE slug = 'nda'),
     jur AS (SELECT id FROM jurisdictions    WHERE code = 'ID')
INSERT INTO clauses (document_type_id, jurisdiction_id, clause_key, content, article_ref, sort_order, is_required)
VALUES
  ((SELECT id FROM doc), (SELECT id FROM jur),
   'nda_header_id',
   'PERJANJIAN NON-DISCLOSURE (MUTUAL)

Perjanjian ini dibuat pada tanggal {{agreement_date}} oleh dan antara:

1. {{party_a_name}}, berdomisili di {{party_a_address}} ("Pihak A"); dan
2. {{party_b_name}}, berdomisili di {{party_b_address}} ("Pihak B").

Pihak A dan Pihak B selanjutnya secara bersama-sama disebut "Para Pihak".',
   NULL, 10, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'nda_purpose_id',
   'PASAL 1 — TUJUAN PERJANJIAN

Para Pihak bermaksud untuk berbagi Informasi Rahasia satu sama lain sehubungan dengan {{business_purpose}} ("Tujuan"). Perjanjian ini mengatur pengungkapan Informasi Rahasia tersebut.',
   NULL, 20, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'nda_definition_id',
   'PASAL 2 — DEFINISI

"Informasi Rahasia" berarti setiap informasi non-publik yang diungkapkan oleh salah satu Pihak kepada Pihak lainnya, baik secara tertulis, lisan, elektronik, maupun dalam bentuk lainnya, yang ditandai sebagai "Rahasia" atau yang seharusnya dimengerti bersifat rahasia berdasarkan konteks pengungkapannya.',
   'UU No. 30 Tahun 2000 tentang Rahasia Dagang', 30, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'nda_obligations_id',
   'PASAL 3 — KEWAJIBAN KERAHASIAAN

Masing-masing Pihak wajib:
(a) menjaga kerahasiaan Informasi Rahasia milik Pihak lainnya;
(b) tidak mengungkapkan Informasi Rahasia tersebut kepada pihak ketiga manapun tanpa persetujuan tertulis terlebih dahulu dari Pihak pengungkap;
(c) menggunakan Informasi Rahasia tersebut semata-mata untuk Tujuan yang disebutkan dalam Perjanjian ini;
(d) memberitahu Pihak pengungkap segera setelah mengetahui adanya pengungkapan Informasi Rahasia yang tidak sah.',
   'UU No. 30 Tahun 2000 Pasal 3', 40, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'nda_exceptions_id',
   'PASAL 4 — PENGECUALIAN

Kewajiban kerahasiaan tidak berlaku untuk informasi yang:
(a) sudah diketahui umum sebelum atau setelah pengungkapan, bukan karena pelanggaran Perjanjian ini;
(b) sudah diketahui oleh penerima sebelum pengungkapan, dibuktikan dengan catatan tertulis;
(c) diperoleh secara sah dari pihak ketiga tanpa pembatasan kerahasiaan; atau
(d) harus diungkapkan berdasarkan peraturan perundang-undangan atau perintah pengadilan.',
   NULL, 50, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'nda_term_id',
   'PASAL 5 — JANGKA WAKTU

Perjanjian ini berlaku selama {{duration_years}} ({{duration_years_text}}) tahun terhitung sejak tanggal penandatanganan dan tetap berlaku selama {{post_termination_years}} ({{post_termination_years_text}}) tahun setelah pengakhiran atau berakhirnya hubungan bisnis Para Pihak.',
   NULL, 60, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'nda_governing_law_id',
   'PASAL 6 — HUKUM YANG BERLAKU

Perjanjian ini tunduk pada dan ditafsirkan menurut hukum Republik Indonesia. Setiap sengketa yang timbul dari atau sehubungan dengan Perjanjian ini diselesaikan melalui Badan Arbitrase Nasional Indonesia (BANI) di Jakarta, kecuali Para Pihak menyetujui cara penyelesaian lain secara tertulis.',
   'UU No. 30 Tahun 1999 tentang Arbitrase', 70, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'nda_signature_id',
   'TANDA TANGAN

Dengan menandatangani Perjanjian ini, Para Pihak menyatakan telah membaca, memahami, dan menyetujui seluruh ketentuan di dalamnya.

PIHAK A:                              PIHAK B:

___________________________           ___________________________
{{party_a_name}}                      {{party_b_name}}
{{party_a_title}}                     {{party_b_title}}
Tanggal: ___________________          Tanggal: ___________________',
   NULL, 200, true);

-- ============================================================
-- NDA — SINGAPORE (Required clauses)
-- ============================================================
WITH doc AS (SELECT id FROM document_types WHERE slug = 'nda'),
     jur AS (SELECT id FROM jurisdictions    WHERE code = 'SG')
INSERT INTO clauses (document_type_id, jurisdiction_id, clause_key, content, article_ref, sort_order, is_required)
VALUES
  ((SELECT id FROM doc), (SELECT id FROM jur),
   'nda_header_sg',
   'MUTUAL NON-DISCLOSURE AGREEMENT

This Agreement is entered into as of {{agreement_date}} by and between:

1. {{party_a_name}}, incorporated/residing at {{party_a_address}} ("Party A"); and
2. {{party_b_name}}, incorporated/residing at {{party_b_address}} ("Party B").

Party A and Party B are hereinafter collectively referred to as the "Parties".',
   NULL, 10, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'nda_purpose_sg',
   '1. PURPOSE

The Parties intend to share Confidential Information with each other for the purpose of {{business_purpose}} (the "Purpose"). This Agreement governs the disclosure of such Confidential Information.',
   NULL, 20, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'nda_definition_sg',
   '2. DEFINITION OF CONFIDENTIAL INFORMATION

"Confidential Information" means any non-public information disclosed by either Party to the other, whether in writing, orally, electronically, or in any other form, that is designated as "Confidential" or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure.',
   'Singapore Official Secrets Act (Cap. 213)', 30, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'nda_obligations_sg',
   '3. CONFIDENTIALITY OBLIGATIONS

Each Party agrees to:
(a) hold the other Party''s Confidential Information in strict confidence;
(b) not disclose the Confidential Information to any third party without the prior written consent of the disclosing Party;
(c) use the Confidential Information solely for the Purpose; and
(d) promptly notify the disclosing Party upon becoming aware of any unauthorized disclosure.',
   NULL, 40, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'nda_exceptions_sg',
   '4. EXCEPTIONS

Confidentiality obligations do not apply to information that:
(a) is or becomes generally available to the public other than through breach of this Agreement;
(b) was known to the receiving Party before disclosure, as evidenced by written records;
(c) is lawfully received from a third party without restriction; or
(d) is required to be disclosed by law, regulation, or court order.',
   NULL, 50, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'nda_term_sg',
   '5. TERM

This Agreement shall commence on the date first written above and continue for a period of {{duration_years}} ({{duration_years_text}}) years. Confidentiality obligations shall survive termination for a further period of {{post_termination_years}} ({{post_termination_years_text}}) years.',
   NULL, 60, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'nda_governing_law_sg',
   '6. GOVERNING LAW AND DISPUTE RESOLUTION

This Agreement is governed by and construed in accordance with the laws of the Republic of Singapore. Any dispute arising out of or in connection with this Agreement shall be submitted to the Singapore International Arbitration Centre (SIAC) in accordance with its rules.',
   'Singapore Arbitration Act 2001', 70, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'nda_signature_sg',
   'IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first written above.

PARTY A:                              PARTY B:

___________________________           ___________________________
{{party_a_name}}                      {{party_b_name}}
{{party_a_title}}                     {{party_b_title}}
Date: _____________________           Date: _____________________',
   NULL, 200, true);

-- ============================================================
-- NDA QUESTIONNAIRE FIELDS — INDONESIA
-- ============================================================
WITH doc AS (SELECT id FROM document_types WHERE slug = 'nda'),
     jur AS (SELECT id FROM jurisdictions    WHERE code = 'ID')
INSERT INTO questionnaire_fields (document_type_id, jurisdiction_id, field_key, question_text, field_type, options, sort_order, is_required)
VALUES
  ((SELECT id FROM doc), (SELECT id FROM jur), 'agreement_date',    'Tanggal Perjanjian',                       'date',    NULL, 10, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'party_a_name',      'Nama lengkap Pihak A (individu/perusahaan)', 'text',  NULL, 20, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'party_a_address',   'Alamat Pihak A',                            'text',  NULL, 30, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'party_a_title',     'Jabatan/Title Pihak A',                     'text',  NULL, 35, false),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'party_b_name',      'Nama lengkap Pihak B (individu/perusahaan)', 'text',  NULL, 40, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'party_b_address',   'Alamat Pihak B',                            'text',  NULL, 50, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'party_b_title',     'Jabatan/Title Pihak B',                     'text',  NULL, 55, false),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'business_purpose',  'Tujuan bisnis / konteks kerja sama',        'text',  NULL, 60, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'duration_years',    'Durasi kerahasiaan (tahun)',                'select',
    '[{"value":"1","label":"1 tahun"},{"value":"2","label":"2 tahun"},{"value":"3","label":"3 tahun"},{"value":"5","label":"5 tahun"}]',
    70, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'duration_years_text', 'Durasi dalam huruf (e.g. "dua")',         'text',  NULL, 75, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'post_termination_years', 'Lama kewajiban setelah perjanjian berakhir (tahun)', 'select',
    '[{"value":"1","label":"1 tahun"},{"value":"2","label":"2 tahun"},{"value":"3","label":"3 tahun"}]',
    80, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'post_termination_years_text', 'Dalam huruf (e.g. "dua")',        'text',  NULL, 85, true);

-- ============================================================
-- NDA QUESTIONNAIRE FIELDS — SINGAPORE
-- ============================================================
WITH doc AS (SELECT id FROM document_types WHERE slug = 'nda'),
     jur AS (SELECT id FROM jurisdictions    WHERE code = 'SG')
INSERT INTO questionnaire_fields (document_type_id, jurisdiction_id, field_key, question_text, field_type, options, sort_order, is_required)
VALUES
  ((SELECT id FROM doc), (SELECT id FROM jur), 'agreement_date',    'Agreement Date',                         'date',  NULL, 10, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'party_a_name',      'Party A Full Name (individual/company)', 'text',  NULL, 20, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'party_a_address',   'Party A Address',                       'text',  NULL, 30, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'party_a_title',     'Party A Title/Designation',             'text',  NULL, 35, false),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'party_b_name',      'Party B Full Name (individual/company)', 'text',  NULL, 40, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'party_b_address',   'Party B Address',                       'text',  NULL, 50, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'party_b_title',     'Party B Title/Designation',             'text',  NULL, 55, false),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'business_purpose',  'Purpose / nature of business discussion','text',  NULL, 60, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'duration_years',    'Confidentiality period (years)',        'select',
    '[{"value":"1","label":"1 year"},{"value":"2","label":"2 years"},{"value":"3","label":"3 years"},{"value":"5","label":"5 years"}]',
    70, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'duration_years_text',   'Duration in words (e.g. "two")',    'text',  NULL, 75, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'post_termination_years', 'Survival period after termination (years)', 'select',
    '[{"value":"1","label":"1 year"},{"value":"2","label":"2 years"},{"value":"3","label":"3 years"}]',
    80, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'post_termination_years_text', 'In words (e.g. "two")',       'text',  NULL, 85, true);
