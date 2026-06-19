-- Service Agreement Seed Data
-- Indonesia + Singapore

-- ============================================================
-- SERVICE AGREEMENT — INDONESIA
-- ============================================================
WITH doc AS (SELECT id FROM document_types WHERE slug = 'service-agreement'),
     jur AS (SELECT id FROM jurisdictions    WHERE code = 'ID')
INSERT INTO clauses (document_type_id, jurisdiction_id, clause_key, content, article_ref, sort_order, is_required)
VALUES
  ((SELECT id FROM doc), (SELECT id FROM jur),
   'sa_header_id',
   'PERJANJIAN JASA

Perjanjian ini dibuat pada tanggal {{agreement_date}} oleh dan antara:

1. {{client_name}}, berkedudukan di {{client_address}} ("Klien"); dan
2. {{provider_name}}, berkedudukan di {{provider_address}} ("Penyedia Jasa").

Klien dan Penyedia Jasa selanjutnya secara bersama-sama disebut "Para Pihak".',
   NULL, 10, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'sa_scope_id',
   'PASAL 1 — RUANG LINGKUP JASA

1.1 Penyedia Jasa setuju untuk menyediakan jasa sebagai berikut kepada Klien:
{{service_description}}

1.2 Penyedia Jasa akan menyampaikan hasil pekerjaan ("Deliverable") sebagaimana disepakati secara tertulis antara Para Pihak.',
   NULL, 20, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'sa_term_id',
   'PASAL 2 — JANGKA WAKTU

2.1 Perjanjian ini berlaku mulai tanggal {{start_date}} dan berakhir pada tanggal {{end_date}}, kecuali diakhiri lebih awal sesuai ketentuan Perjanjian ini.
2.2 Para Pihak dapat memperpanjang Perjanjian ini berdasarkan kesepakatan tertulis.',
   NULL, 30, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'sa_payment_id',
   'PASAL 3 — PEMBAYARAN

3.1 Klien membayar kepada Penyedia Jasa sebesar Rp {{total_fee}} ({{total_fee_text}} Rupiah) untuk seluruh jasa yang disepakati.
3.2 Pembayaran dilakukan dengan jadwal: {{payment_schedule}}.
3.3 Pembayaran dilakukan melalui transfer bank ke rekening yang ditentukan oleh Penyedia Jasa.',
   NULL, 40, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'sa_ip_id',
   'PASAL 4 — HAK KEKAYAAN INTELEKTUAL

4.1 Seluruh hasil pekerjaan yang dibuat oleh Penyedia Jasa dalam rangka pelaksanaan Perjanjian ini menjadi milik Klien setelah pembayaran penuh diterima.
4.2 Penyedia Jasa mempertahankan hak atas alat, metode, dan pengetahuan umum yang digunakan dalam pelaksanaan jasa.',
   'UU No. 28 Tahun 2014 tentang Hak Cipta', 50, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'sa_confidentiality_id',
   'PASAL 5 — KERAHASIAAN

Masing-masing Pihak wajib menjaga kerahasiaan informasi bisnis dan teknis milik Pihak lainnya yang diperoleh sehubungan dengan pelaksanaan Perjanjian ini. Kewajiban ini berlaku selama {{confidentiality_years}} tahun setelah berakhirnya Perjanjian.',
   'UU No. 30 Tahun 2000', 60, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'sa_termination_id',
   'PASAL 6 — PENGAKHIRAN

6.1 Salah satu Pihak dapat mengakhiri Perjanjian ini dengan memberikan pemberitahuan tertulis {{notice_days}} ({{notice_days_text}}) hari sebelumnya.
6.2 Dalam hal pengakhiran oleh Klien sebelum pekerjaan selesai, Klien wajib membayar seluruh jasa yang telah diselesaikan hingga tanggal pengakhiran.',
   NULL, 70, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'sa_governing_law_id',
   'PASAL 7 — HUKUM YANG BERLAKU

Perjanjian ini tunduk pada hukum Negara Republik Indonesia. Setiap sengketa diselesaikan secara musyawarah mufakat; apabila tidak tercapai, diselesaikan melalui Pengadilan Negeri di {{dispute_resolution_city}}.',
   NULL, 80, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'sa_signature_id',
   'TANDA TANGAN

KLIEN:                                PENYEDIA JASA:

___________________________           ___________________________
{{client_name}}                       {{provider_name}}
{{client_representative}}             {{provider_representative}}
Tanggal: ___________________          Tanggal: ___________________',
   NULL, 200, true);

-- ============================================================
-- SERVICE AGREEMENT — SINGAPORE
-- ============================================================
WITH doc AS (SELECT id FROM document_types WHERE slug = 'service-agreement'),
     jur AS (SELECT id FROM jurisdictions    WHERE code = 'SG')
INSERT INTO clauses (document_type_id, jurisdiction_id, clause_key, content, article_ref, sort_order, is_required)
VALUES
  ((SELECT id FROM doc), (SELECT id FROM jur),
   'sa_header_sg',
   'SERVICE AGREEMENT

This Agreement is entered into on {{agreement_date}} between:

1. {{client_name}}, having its registered office / residing at {{client_address}} ("Client"); and
2. {{provider_name}}, having its registered office / residing at {{provider_address}} ("Service Provider").',
   NULL, 10, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'sa_scope_sg',
   '1. SCOPE OF SERVICES

1.1 The Service Provider agrees to provide the following services to the Client:
{{service_description}}

1.2 The Service Provider shall deliver all agreed deliverables ("Deliverables") as further specified by mutual written agreement of the parties.',
   NULL, 20, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'sa_term_sg',
   '2. TERM

2.1 This Agreement shall commence on {{start_date}} and expire on {{end_date}}, unless terminated earlier in accordance with this Agreement.
2.2 The parties may renew this Agreement by mutual written consent prior to the expiry date.',
   NULL, 30, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'sa_payment_sg',
   '3. FEES AND PAYMENT

3.1 The Client shall pay the Service Provider a total fee of SGD {{total_fee}} (Singapore Dollars {{total_fee_text}}) for all services rendered.
3.2 Payment schedule: {{payment_schedule}}.
3.3 Payments shall be made by bank transfer to the account designated by the Service Provider.',
   NULL, 40, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'sa_ip_sg',
   '4. INTELLECTUAL PROPERTY

4.1 All work product and deliverables created by the Service Provider under this Agreement shall vest in and become the property of the Client upon receipt of full payment.
4.2 The Service Provider retains ownership of all pre-existing intellectual property, tools, methodologies, and general know-how used in performing the services.',
   'Copyright Act 2021 (Singapore)', 50, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'sa_confidentiality_sg',
   '5. CONFIDENTIALITY

Each party shall keep confidential all business and technical information of the other party obtained in connection with this Agreement. This obligation shall survive for {{confidentiality_years}} years following termination of this Agreement.',
   NULL, 60, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'sa_termination_sg',
   '6. TERMINATION

6.1 Either party may terminate this Agreement by providing {{notice_days}} ({{notice_days_text}}) days'' written notice to the other party.
6.2 In the event of termination by the Client before completion of services, the Client shall pay for all services rendered up to the date of termination.',
   NULL, 70, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'sa_governing_law_sg',
   '7. GOVERNING LAW

This Agreement is governed by the laws of the Republic of Singapore. Any dispute arising out of or in connection with this Agreement shall be resolved by the Singapore Mediation Centre or, failing mediation, by the Singapore courts.',
   NULL, 80, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'sa_signature_sg',
   'IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

CLIENT:                               SERVICE PROVIDER:

___________________________           ___________________________
{{client_name}}                       {{provider_name}}
{{client_representative}}             {{provider_representative}}
Date: _____________________           Date: _____________________',
   NULL, 200, true);

-- ============================================================
-- SERVICE AGREEMENT QUESTIONNAIRE — INDONESIA
-- ============================================================
WITH doc AS (SELECT id FROM document_types WHERE slug = 'service-agreement'),
     jur AS (SELECT id FROM jurisdictions    WHERE code = 'ID')
INSERT INTO questionnaire_fields (document_type_id, jurisdiction_id, field_key, question_text, field_type, options, sort_order, is_required)
VALUES
  ((SELECT id FROM doc), (SELECT id FROM jur), 'agreement_date',         'Tanggal Perjanjian',                          'date',   NULL, 10, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'client_name',            'Nama Klien (individu/perusahaan)',            'text',   NULL, 20, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'client_address',         'Alamat Klien',                                'text',   NULL, 30, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'client_representative',  'Nama Penandatangan Klien',                    'text',   NULL, 35, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'provider_name',          'Nama Penyedia Jasa (individu/perusahaan)',    'text',   NULL, 40, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'provider_address',       'Alamat Penyedia Jasa',                        'text',   NULL, 50, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'provider_representative','Nama Penandatangan Penyedia Jasa',            'text',   NULL, 55, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'service_description',    'Deskripsi Jasa yang Diberikan',               'text',   NULL, 60, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'start_date',             'Tanggal Mulai',                               'date',   NULL, 70, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'end_date',               'Tanggal Selesai',                             'date',   NULL, 80, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'total_fee',              'Total Biaya Jasa (Rupiah, angka saja)',        'text',   NULL, 90, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'total_fee_text',         'Total Biaya dalam huruf (e.g. "Lima Juta")',  'text',   NULL, 95, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'payment_schedule',       'Jadwal Pembayaran',                           'select',
    '[{"value":"Dibayar penuh di muka sebelum pekerjaan dimulai","label":"Full di muka"},{"value":"50% di muka, 50% setelah pekerjaan selesai","label":"50/50"},{"value":"Dibayar setelah pekerjaan selesai dan diterima","label":"Full setelah selesai"}]',
    100, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'confidentiality_years',  'Lama Kewajiban Kerahasiaan (tahun)',          'select',
    '[{"value":"1","label":"1 tahun"},{"value":"2","label":"2 tahun"},{"value":"3","label":"3 tahun"}]',
    110, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'notice_days',            'Masa Pemberitahuan Pengakhiran (hari)',        'select',
    '[{"value":"7","label":"7 hari"},{"value":"14","label":"14 hari"},{"value":"30","label":"30 hari"}]',
    120, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'notice_days_text',       'Masa pemberitahuan dalam huruf (e.g. "empat belas")', 'text', NULL, 125, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'dispute_resolution_city','Kota Pengadilan Negeri untuk Sengketa',       'text',   NULL, 130, true);

-- ============================================================
-- SERVICE AGREEMENT QUESTIONNAIRE — SINGAPORE
-- ============================================================
WITH doc AS (SELECT id FROM document_types WHERE slug = 'service-agreement'),
     jur AS (SELECT id FROM jurisdictions    WHERE code = 'SG')
INSERT INTO questionnaire_fields (document_type_id, jurisdiction_id, field_key, question_text, field_type, options, sort_order, is_required)
VALUES
  ((SELECT id FROM doc), (SELECT id FROM jur), 'agreement_date',         'Agreement Date',                              'date',   NULL, 10, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'client_name',            'Client Name (individual/company)',            'text',   NULL, 20, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'client_address',         'Client Address',                              'text',   NULL, 30, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'client_representative',  'Client Signatory Name',                       'text',   NULL, 35, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'provider_name',          'Service Provider Name (individual/company)',  'text',   NULL, 40, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'provider_address',       'Service Provider Address',                    'text',   NULL, 50, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'provider_representative','Provider Signatory Name',                     'text',   NULL, 55, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'service_description',    'Description of Services to be Provided',      'text',   NULL, 60, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'start_date',             'Service Start Date',                          'date',   NULL, 70, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'end_date',               'Service End Date',                            'date',   NULL, 80, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'total_fee',              'Total Fee (SGD, numbers only)',               'text',   NULL, 90, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'total_fee_text',         'Total Fee in words (e.g. "Five Thousand")',   'text',   NULL, 95, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'payment_schedule',       'Payment Schedule',                            'select',
    '[{"value":"Full payment upfront before work commences","label":"Full upfront"},{"value":"50% upfront, 50% upon completion","label":"50/50"},{"value":"Full payment upon completion and acceptance","label":"Full on completion"}]',
    100, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'confidentiality_years',  'Confidentiality Survival Period (years)',     'select',
    '[{"value":"1","label":"1 year"},{"value":"2","label":"2 years"},{"value":"3","label":"3 years"}]',
    110, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'notice_days',            'Termination Notice Period (days)',            'select',
    '[{"value":"7","label":"7 days"},{"value":"14","label":"14 days"},{"value":"30","label":"30 days"}]',
    120, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'notice_days_text',       'Notice period in words (e.g. "fourteen")',    'text',   NULL, 125, true);
