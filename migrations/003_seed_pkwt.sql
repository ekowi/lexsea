-- PKWT / Employment Agreement Seed Data
-- Indonesia + Singapore

-- ============================================================
-- PKWT — INDONESIA (Required clauses)
-- ============================================================
WITH doc AS (SELECT id FROM document_types WHERE slug = 'pkwt'),
     jur AS (SELECT id FROM jurisdictions    WHERE code = 'ID')
INSERT INTO clauses (document_type_id, jurisdiction_id, clause_key, content, article_ref, sort_order, is_required)
VALUES
  ((SELECT id FROM doc), (SELECT id FROM jur),
   'pkwt_header_id',
   'PERJANJIAN KERJA WAKTU TERTENTU (PKWT)

Perjanjian ini dibuat pada tanggal {{agreement_date}} oleh dan antara:

1. {{employer_name}}, sebuah perusahaan yang berkedudukan di {{employer_address}}, diwakili oleh {{employer_representative}} selaku {{employer_representative_title}} ("Perusahaan"); dan
2. {{employee_name}}, bertempat tinggal di {{employee_address}}, pemegang KTP No. {{employee_ktp}} ("Karyawan").

Perusahaan dan Karyawan selanjutnya secara bersama-sama disebut "Para Pihak".',
   NULL, 10, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'pkwt_position_id',
   'PASAL 1 — JABATAN DAN TUGAS

1.1 Perusahaan mempekerjakan Karyawan sebagai {{job_title}} pada divisi/departemen {{department}}.
1.2 Karyawan wajib melaksanakan tugas dan tanggung jawab sebagaimana ditetapkan oleh Perusahaan, termasuk tugas-tugas lain yang sewaktu-waktu diberikan secara wajar sesuai dengan jabatan tersebut.
1.3 Karyawan bertanggung jawab kepada {{reporting_to}}.',
   NULL, 20, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'pkwt_term_id',
   'PASAL 2 — JANGKA WAKTU PERJANJIAN

2.1 Perjanjian ini berlaku selama {{contract_duration_months}} ({{contract_duration_months_text}}) bulan, terhitung sejak tanggal {{start_date}} sampai dengan tanggal {{end_date}}.
2.2 Perjanjian ini dapat diperpanjang berdasarkan kesepakatan tertulis Para Pihak sebelum berakhirnya masa perjanjian, dengan memperhatikan ketentuan perundang-undangan yang berlaku.',
   'UU No. 13 Tahun 2003 Pasal 59', 30, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'pkwt_salary_id',
   'PASAL 3 — GAJI DAN TUNJANGAN

3.1 Perusahaan membayar Karyawan gaji pokok sebesar Rp {{salary_amount}} ({{salary_amount_text}} Rupiah) per bulan.
3.2 Gaji dibayarkan setiap bulan pada tanggal {{salary_payment_date}}.
3.3 Karyawan berhak atas tunjangan dan fasilitas lain sesuai peraturan perusahaan yang berlaku.',
   'UU No. 13 Tahun 2003 Pasal 88', 40, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'pkwt_working_hours_id',
   'PASAL 4 — WAKTU KERJA

4.1 Hari kerja adalah Senin sampai dengan {{work_days}}, dengan jam kerja pukul {{work_hours_start}} sampai dengan {{work_hours_end}} WIB.
4.2 Ketentuan mengenai lembur mengacu pada peraturan perundang-undangan yang berlaku dan peraturan perusahaan.',
   'UU No. 13 Tahun 2003 Pasal 77-85', 50, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'pkwt_confidentiality_id',
   'PASAL 5 — KERAHASIAAN

5.1 Karyawan wajib menjaga kerahasiaan seluruh informasi bisnis, teknis, keuangan, dan operasional Perusahaan yang diperoleh selama masa kerja.
5.2 Kewajiban kerahasiaan ini tetap berlaku setelah berakhirnya perjanjian kerja ini.',
   'UU No. 30 Tahun 2000 tentang Rahasia Dagang', 60, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'pkwt_termination_id',
   'PASAL 6 — PENGAKHIRAN PERJANJIAN

6.1 Perjanjian ini berakhir secara otomatis pada tanggal {{end_date}} tanpa perlu pemberitahuan lebih lanjut.
6.2 Perjanjian dapat diakhiri lebih awal oleh salah satu Pihak dengan alasan-alasan yang diatur dalam peraturan perundang-undangan yang berlaku.
6.3 Dalam hal pengakhiran sebelum waktunya tanpa alasan yang sah, pihak yang mengakhiri wajib membayar ganti rugi sebesar upah Karyawan sampai dengan batas waktu berakhirnya perjanjian.',
   'UU No. 13 Tahun 2003 Pasal 62', 70, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'pkwt_governing_law_id',
   'PASAL 7 — HUKUM YANG BERLAKU

Perjanjian ini tunduk pada hukum Republik Indonesia, khususnya Undang-Undang Nomor 13 Tahun 2003 tentang Ketenagakerjaan dan peraturan pelaksanaannya. Setiap perselisihan diselesaikan melalui mekanisme yang diatur dalam UU No. 2 Tahun 2004 tentang Penyelesaian Perselisihan Hubungan Industrial.',
   'UU No. 2 Tahun 2004', 80, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'pkwt_signature_id',
   'TANDA TANGAN

Perjanjian ini dibuat dalam rangkap 2 (dua), masing-masing mempunyai kekuatan hukum yang sama.

PERUSAHAAN:                           KARYAWAN:

___________________________           ___________________________
{{employer_representative}}           {{employee_name}}
{{employer_representative_title}}
Tanggal: ___________________          Tanggal: ___________________',
   NULL, 200, true);

-- ============================================================
-- PKWT — INDONESIA (Conditional clauses)
-- ============================================================
WITH doc AS (SELECT id FROM document_types WHERE slug = 'pkwt'),
     jur AS (SELECT id FROM jurisdictions    WHERE code = 'ID')
INSERT INTO clauses (document_type_id, jurisdiction_id, clause_key, content, article_ref, sort_order, is_required)
VALUES
  ((SELECT id FROM doc), (SELECT id FROM jur),
   'pkwt_probation_id',
   'PASAL — MASA PERCOBAAN

Para Pihak sepakat bahwa tidak ada masa percobaan dalam PKWT sebagaimana dilarang oleh Pasal 58 UU No. 13 Tahun 2003.',
   'UU No. 13 Tahun 2003 Pasal 58', 25, false),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'pkwt_remote_id',
   'PASAL — KETENTUAN KERJA JARAK JAUH (REMOTE)

Karyawan dapat bekerja dari lokasi jarak jauh (remote) sesuai kebijakan perusahaan yang berlaku. Karyawan tetap wajib hadir di kantor apabila diperlukan oleh Perusahaan dengan pemberitahuan yang wajar.',
   NULL, 55, false);

-- Condition: probation notice hanya muncul jika work_arrangement = 'office'
WITH c AS (SELECT id FROM clauses WHERE clause_key = 'pkwt_probation_id')
INSERT INTO clause_conditions (clause_id, condition_key, condition_value)
VALUES ((SELECT id FROM c), 'show_probation_note', 'true');

-- Condition: remote clause hanya muncul jika work_arrangement = 'remote' atau 'hybrid'
WITH c AS (SELECT id FROM clauses WHERE clause_key = 'pkwt_remote_id')
INSERT INTO clause_conditions (clause_id, condition_key, condition_value)
VALUES ((SELECT id FROM c), 'work_arrangement', 'remote');

-- ============================================================
-- PKWT — SINGAPORE (Employment Agreement)
-- ============================================================
WITH doc AS (SELECT id FROM document_types WHERE slug = 'pkwt'),
     jur AS (SELECT id FROM jurisdictions    WHERE code = 'SG')
INSERT INTO clauses (document_type_id, jurisdiction_id, clause_key, content, article_ref, sort_order, is_required)
VALUES
  ((SELECT id FROM doc), (SELECT id FROM jur),
   'pkwt_header_sg',
   'FIXED-TERM EMPLOYMENT AGREEMENT

This Agreement is made on {{agreement_date}} between:

1. {{employer_name}}, a company incorporated in Singapore with its registered office at {{employer_address}}, represented by {{employer_representative}}, {{employer_representative_title}} ("Employer"); and
2. {{employee_name}}, residing at {{employee_address}}, NRIC/FIN No. {{employee_nric}} ("Employee").',
   NULL, 10, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'pkwt_position_sg',
   '1. POSITION AND DUTIES

1.1 The Employer employs the Employee as {{job_title}} in the {{department}} department.
1.2 The Employee shall perform such duties as are reasonably assigned by the Employer from time to time consistent with the position.
1.3 The Employee shall report to {{reporting_to}}.',
   NULL, 20, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'pkwt_term_sg',
   '2. TERM OF EMPLOYMENT

2.1 This Agreement shall commence on {{start_date}} and terminate on {{end_date}}, a period of {{contract_duration_months}} ({{contract_duration_months_text}}) months, unless terminated earlier in accordance with this Agreement.
2.2 This Agreement may be renewed by mutual written agreement of the parties prior to the expiry date.',
   'Employment Act 1968 (Cap. 91A)', 30, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'pkwt_salary_sg',
   '3. SALARY AND BENEFITS

3.1 The Employer shall pay the Employee a monthly salary of SGD {{salary_amount}} (Singapore Dollars {{salary_amount_text}}).
3.2 Salary shall be paid on the {{salary_payment_date}} of each calendar month.
3.3 The Employee shall be entitled to benefits as set out in the Employee Handbook.',
   'Employment Act 1968 Part III', 40, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'pkwt_working_hours_sg',
   '4. HOURS OF WORK

4.1 The Employee shall work from Monday to {{work_days}}, {{work_hours_start}} to {{work_hours_end}}.
4.2 Overtime shall be compensated in accordance with the Employment Act and Company policy.',
   'Employment Act 1968 Part IV', 50, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'pkwt_leave_sg',
   '5. LEAVE ENTITLEMENT

5.1 Annual Leave: The Employee is entitled to {{annual_leave_days}} days of paid annual leave per year, pro-rated for the first year of service.
5.2 Sick Leave: The Employee is entitled to paid sick leave in accordance with the Employment Act.
5.3 Public Holidays: The Employee is entitled to all Singapore public holidays.',
   'Employment Act 1968 Part X', 55, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'pkwt_confidentiality_sg',
   '6. CONFIDENTIALITY

6.1 The Employee shall keep confidential all business, technical, financial and operational information of the Employer obtained during employment.
6.2 This obligation shall survive the termination of this Agreement.',
   NULL, 60, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'pkwt_termination_sg',
   '7. TERMINATION

7.1 This Agreement shall automatically terminate on {{end_date}} without further notice.
7.2 Either party may terminate this Agreement during the term by giving {{notice_period_days}} days'' written notice or payment in lieu thereof.
7.3 The Employer may terminate this Agreement without notice for cause (gross misconduct, breach of contract, or criminal conviction).',
   'Employment Act 1968 s.10', 70, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'pkwt_governing_law_sg',
   '8. GOVERNING LAW

This Agreement is governed by and shall be construed in accordance with the laws of the Republic of Singapore. Any dispute shall be referred to the Employment Claims Tribunal (ECT) or such other body as may be designated by applicable law.',
   'Employment Claims Act 2016', 80, true),

  ((SELECT id FROM doc), (SELECT id FROM jur),
   'pkwt_signature_sg',
   'IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

EMPLOYER:                             EMPLOYEE:

___________________________           ___________________________
{{employer_representative}}           {{employee_name}}
{{employer_representative_title}}
Date: _____________________           Date: _____________________',
   NULL, 200, true);

-- ============================================================
-- PKWT QUESTIONNAIRE — INDONESIA
-- ============================================================
WITH doc AS (SELECT id FROM document_types WHERE slug = 'pkwt'),
     jur AS (SELECT id FROM jurisdictions    WHERE code = 'ID')
INSERT INTO questionnaire_fields (document_type_id, jurisdiction_id, field_key, question_text, field_type, options, sort_order, is_required)
VALUES
  ((SELECT id FROM doc), (SELECT id FROM jur), 'agreement_date',               'Tanggal Perjanjian',                              'date',   NULL, 10, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'employer_name',                'Nama Perusahaan',                                 'text',   NULL, 20, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'employer_address',             'Alamat Perusahaan',                               'text',   NULL, 30, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'employer_representative',      'Nama Perwakilan Perusahaan',                      'text',   NULL, 40, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'employer_representative_title','Jabatan Perwakilan',                              'text',   NULL, 45, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'employee_name',                'Nama Lengkap Karyawan',                           'text',   NULL, 50, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'employee_address',             'Alamat Karyawan',                                 'text',   NULL, 60, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'employee_ktp',                 'Nomor KTP Karyawan',                              'text',   NULL, 70, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'job_title',                    'Jabatan / Posisi',                                'text',   NULL, 80, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'department',                   'Divisi / Departemen',                             'text',   NULL, 90, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'reporting_to',                 'Atasan Langsung',                                 'text',   NULL, 100, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'start_date',                   'Tanggal Mulai Kerja',                             'date',   NULL, 110, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'end_date',                     'Tanggal Berakhir Kontrak',                        'date',   NULL, 120, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'contract_duration_months',     'Durasi Kontrak (bulan)',                          'select',
    '[{"value":"3","label":"3 bulan"},{"value":"6","label":"6 bulan"},{"value":"12","label":"12 bulan"},{"value":"24","label":"24 bulan"}]',
    130, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'contract_duration_months_text','Durasi dalam huruf (e.g. "dua belas")',           'text',   NULL, 135, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'salary_amount',                'Gaji Pokok (Rupiah, angka saja)',                  'text',   NULL, 140, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'salary_amount_text',           'Gaji dalam huruf (e.g. "Lima Juta")',             'text',   NULL, 145, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'salary_payment_date',          'Tanggal Pembayaran Gaji (e.g. 25)',               'text',   NULL, 150, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'work_days',                    'Hari Kerja Terakhir dalam Seminggu',              'select',
    '[{"value":"Jumat","label":"Senin – Jumat"},{"value":"Sabtu","label":"Senin – Sabtu"}]',
    160, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'work_hours_start',             'Jam Mulai Kerja (e.g. 09:00)',                    'text',   NULL, 170, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'work_hours_end',               'Jam Selesai Kerja (e.g. 18:00)',                  'text',   NULL, 180, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'work_arrangement',             'Pengaturan Kerja',                                'select',
    '[{"value":"office","label":"Full Office"},{"value":"remote","label":"Full Remote"},{"value":"hybrid","label":"Hybrid"}]',
    190, true);

-- ============================================================
-- PKWT QUESTIONNAIRE — SINGAPORE
-- ============================================================
WITH doc AS (SELECT id FROM document_types WHERE slug = 'pkwt'),
     jur AS (SELECT id FROM jurisdictions    WHERE code = 'SG')
INSERT INTO questionnaire_fields (document_type_id, jurisdiction_id, field_key, question_text, field_type, options, sort_order, is_required)
VALUES
  ((SELECT id FROM doc), (SELECT id FROM jur), 'agreement_date',               'Agreement Date',                                  'date',   NULL, 10, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'employer_name',                'Employer Company Name',                           'text',   NULL, 20, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'employer_address',             'Employer Registered Address',                     'text',   NULL, 30, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'employer_representative',      'Employer Representative Name',                    'text',   NULL, 40, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'employer_representative_title','Representative Title',                            'text',   NULL, 45, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'employee_name',                'Employee Full Name',                              'text',   NULL, 50, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'employee_address',             'Employee Residential Address',                    'text',   NULL, 60, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'employee_nric',                'Employee NRIC / FIN Number',                      'text',   NULL, 70, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'job_title',                    'Job Title / Position',                            'text',   NULL, 80, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'department',                   'Department / Division',                           'text',   NULL, 90, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'reporting_to',                 'Reporting To',                                    'text',   NULL, 100, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'start_date',                   'Employment Start Date',                           'date',   NULL, 110, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'end_date',                     'Employment End Date',                             'date',   NULL, 120, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'contract_duration_months',     'Contract Duration (months)',                      'select',
    '[{"value":"3","label":"3 months"},{"value":"6","label":"6 months"},{"value":"12","label":"12 months"},{"value":"24","label":"24 months"}]',
    130, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'contract_duration_months_text','Duration in words (e.g. "twelve")',               'text',   NULL, 135, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'salary_amount',                'Monthly Salary (SGD, numbers only)',              'text',   NULL, 140, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'salary_amount_text',           'Salary in words (e.g. "Five Thousand")',          'text',   NULL, 145, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'salary_payment_date',          'Salary Payment Day of Month (e.g. 25)',           'text',   NULL, 150, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'work_days',                    'Last Working Day of Week',                        'select',
    '[{"value":"Friday","label":"Monday – Friday"},{"value":"Saturday","label":"Monday – Saturday"}]',
    160, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'work_hours_start',             'Work Start Time (e.g. 09:00)',                    'text',   NULL, 170, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'work_hours_end',               'Work End Time (e.g. 18:00)',                      'text',   NULL, 180, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'annual_leave_days',            'Annual Leave Entitlement (days)',                 'select',
    '[{"value":"7","label":"7 days"},{"value":"14","label":"14 days"},{"value":"21","label":"21 days"}]',
    190, true),
  ((SELECT id FROM doc), (SELECT id FROM jur), 'notice_period_days',           'Notice Period (days)',                            'select',
    '[{"value":"14","label":"14 days"},{"value":"30","label":"30 days"},{"value":"60","label":"60 days"}]',
    200, true);
