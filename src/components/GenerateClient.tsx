"use client";

import { useState, useCallback, useMemo } from "react";
import DocumentPreview from "./DocumentPreview";
import type { UserBranding } from "@/lib/auth";

interface Field {
  field_key: string;
  question_text: string;
  field_type: "text" | "select" | "boolean" | "date";
  options: { value: string; label: string }[] | null;
  sort_order: number;
  is_required: boolean;
}

type Answers = Record<string, string>;

// Number-to-words maps for auto-filling companion _text fields
const NUM_WORDS: Record<string, Record<string, string>> = {
  ID: {
    "1": "satu", "2": "dua", "3": "tiga", "5": "lima", "6": "enam",
    "7": "tujuh", "12": "dua belas", "14": "empat belas",
    "21": "dua puluh satu", "24": "dua puluh empat",
    "30": "tiga puluh", "60": "enam puluh",
  },
  SG: {
    "1": "one", "2": "two", "3": "three", "5": "five", "6": "six",
    "7": "seven", "12": "twelve", "14": "fourteen",
    "21": "twenty-one", "24": "twenty-four",
    "30": "thirty", "60": "sixty",
  },
};

const MONTHS_ID = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ── Number → words (Bug #2 fix) ─────────────────────────────────────────────

const ONES_ID = ["","Satu","Dua","Tiga","Empat","Lima","Enam","Tujuh","Delapan","Sembilan",
  "Sepuluh","Sebelas","Dua Belas","Tiga Belas","Empat Belas","Lima Belas",
  "Enam Belas","Tujuh Belas","Delapan Belas","Sembilan Belas"];
const TENS_ID = ["","","Dua Puluh","Tiga Puluh","Empat Puluh","Lima Puluh",
  "Enam Puluh","Tujuh Puluh","Delapan Puluh","Sembilan Puluh"];

function numToWordsID(x: number): string {
  if (x === 0) return "";
  if (x < 20)  return ONES_ID[x];
  if (x < 100) { const r = x % 10; return r ? `${TENS_ID[Math.floor(x/10)]} ${ONES_ID[r]}` : TENS_ID[Math.floor(x/10)]; }
  if (x < 1_000) {
    const h = Math.floor(x/100); const r = x % 100;
    const hs = h === 1 ? "Seratus" : `${ONES_ID[h]} Ratus`;
    return r ? `${hs} ${numToWordsID(r)}` : hs;
  }
  if (x < 1_000_000) {
    const k = Math.floor(x/1_000); const r = x % 1_000;
    const ks = k === 1 ? "Seribu" : `${numToWordsID(k)} Ribu`;
    return r ? `${ks} ${numToWordsID(r)}` : ks;
  }
  if (x < 1_000_000_000) {
    const m = Math.floor(x/1_000_000); const r = x % 1_000_000;
    return r ? `${numToWordsID(m)} Juta ${numToWordsID(r)}` : `${numToWordsID(m)} Juta`;
  }
  const b = Math.floor(x/1_000_000_000); const r = x % 1_000_000_000;
  return r ? `${numToWordsID(b)} Miliar ${numToWordsID(r)}` : `${numToWordsID(b)} Miliar`;
}

const ONES_EN = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
  "Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen",
  "Sixteen","Seventeen","Eighteen","Nineteen"];
const TENS_EN = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];

function numToWordsEN(x: number): string {
  if (x === 0) return "";
  if (x < 20)  return ONES_EN[x];
  if (x < 100) { const r = x % 10; return r ? `${TENS_EN[Math.floor(x/10)]}-${ONES_EN[r].toLowerCase()}` : TENS_EN[Math.floor(x/10)]; }
  if (x < 1_000) {
    const h = Math.floor(x/100); const r = x % 100;
    return r ? `${ONES_EN[h]} Hundred ${numToWordsEN(r)}` : `${ONES_EN[h]} Hundred`;
  }
  if (x < 1_000_000) {
    const k = Math.floor(x/1_000); const r = x % 1_000;
    return r ? `${numToWordsEN(k)} Thousand ${numToWordsEN(r)}` : `${numToWordsEN(k)} Thousand`;
  }
  const m = Math.floor(x/1_000_000); const r = x % 1_000_000;
  return r ? `${numToWordsEN(m)} Million ${numToWordsEN(r)}` : `${numToWordsEN(m)} Million`;
}

function numericToWords(raw: string, jurisdiction: string): string {
  const n = parseInt(raw.replace(/[^0-9]/g, ""), 10);
  if (!n || n <= 0) return "";
  return jurisdiction === "ID" ? numToWordsID(n) : numToWordsEN(n);
}

// Fields whose _text companion is auto-filled from numeric input
const NUMERIC_TEXT_MAP: Record<string, string> = {
  salary_amount: "salary_amount_text",
  total_fee:     "total_fee_text",
};

function formatDate(iso: string, jurisdiction: string): string {
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  const [year, month, day] = parts;
  const m = parseInt(month, 10) - 1;
  const d = parseInt(day, 10);
  if (isNaN(m) || isNaN(d) || m < 0 || m > 11) return iso;
  return jurisdiction === "ID"
    ? `${d} ${MONTHS_ID[m]} ${year}`
    : `${d} ${MONTHS_EN[m]} ${year}`;
}

const JURISDICTIONS = [
  {
    code: "ID",
    flag: "🇮🇩",
    label: "Indonesia",
    law: "UU No. 13/2003 · UU No. 30/2000 · BANI",
    note: "Bahasa Indonesia / English bilingual",
  },
  {
    code: "SG",
    flag: "🇸🇬",
    label: "Singapore",
    law: "Employment Act 1968 · SIAC · Singapore courts",
    note: "English, Singapore law",
  },
];

const FIELDS_PER_PAGE = 6;

// Optional context fields (feed the AI background recital; never block the flow)
const CONTEXT_KEYS = new Set(["agreement_context", "party_a_type", "party_b_type"]);

// Which answer keys represent "Party A" (the first party) per document — used to
// prefill from the logged-in user's saved company profile. Party A is always the
// company/initiating side: NDA Party A, PKWT Employer, SA Client.
const PARTY_A_PREFILL: Record<string, { nameKey: string; addrKey: string }> = {
  nda:                 { nameKey: "party_a_name",  addrKey: "party_a_address" },
  pkwt:                { nameKey: "employer_name", addrKey: "employer_address" },
  "service-agreement": { nameKey: "client_name",   addrKey: "client_address" },
};

export default function GenerateClient({ docType, branding }: { docType: string; branding?: UserBranding | null }) {
  const [step, setStep] = useState<"jurisdiction" | "form" | "preview">("jurisdiction");
  const [jurisdiction, setJurisdiction] = useState("");
  const [fields, setFields] = useState<Field[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [formPage, setFormPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [assembledDoc, setAssembledDoc] = useState("");
  const [error, setError] = useState("");
  // Keys prefilled from the company profile — shown with a badge, still editable
  const [prefilledKeys, setPrefilledKeys] = useState<Set<string>>(new Set());

  // Companion _text fields (select/date auto-fill) + numeric-to-words targets are hidden
  const companionTextKeys = useMemo(() => {
    const keys = new Set(
      fields
        .filter((f) => f.field_type === "select" || f.field_type === "date")
        .map((f) => f.field_key + "_text")
    );
    // Also hide salary_amount_text and total_fee_text — auto-filled from numeric input
    for (const textKey of Object.values(NUMERIC_TEXT_MAP)) {
      if (fields.some((f) => f.field_key === textKey)) keys.add(textKey);
    }
    return keys;
  }, [fields]);

  // Fields that are auto-calculated — shown with a hint label, still editable
  const computedKeys = useMemo(() => new Set(["end_date"]), []);

  // Only show non-companion fields
  const visibleFields = useMemo(
    () => fields.filter((f) => !companionTextKeys.has(f.field_key)),
    [fields, companionTextKeys]
  );

  const totalFormPages = Math.ceil(visibleFields.length / FIELDS_PER_PAGE);
  const currentFields = visibleFields.slice(
    formPage * FIELDS_PER_PAGE,
    (formPage + 1) * FIELDS_PER_PAGE
  );
  const totalVisible = visibleFields.length;
  const filledSoFar = Math.min((formPage + 1) * FIELDS_PER_PAGE, totalVisible);
  const overallStep = step === "jurisdiction" ? 1 : step === "form" ? 2 : 3;

  const handleSelectJurisdiction = useCallback(
    async (code: string) => {
      setJurisdiction(code);
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/questionnaire/${docType}?jurisdiction=${code}`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error ?? "Could not load the questionnaire. Please try again.");
          setJurisdiction("");
          return;
        }

        setFields(data.fields);

        // Prefill Party A from the saved company profile (Pro users with branding)
        const seeded: Answers = {};
        const seededKeys = new Set<string>();
        const map = PARTY_A_PREFILL[docType];
        if (branding?.companyName && map) {
          const has = (k: string) => data.fields.some((f: Field) => f.field_key === k);
          if (has(map.nameKey)) { seeded[map.nameKey] = branding.companyName; seededKeys.add(map.nameKey); }
          if (branding.companyAddress && has(map.addrKey)) {
            seeded[map.addrKey] = branding.companyAddress; seededKeys.add(map.addrKey);
          }
        }
        setAnswers(seeded);
        setPrefilledKeys(seededKeys);
        setFormPage(0);
        setStep("form");
      } catch {
        setError("Network error — please check your connection and try again.");
        setJurisdiction("");
      } finally {
        setLoading(false);
      }
    },
    [docType, branding]
  );

  const handleAnswer = useCallback(
    (key: string, value: string, fieldType?: string) => {
      setAnswers((prev) => {
        const next = { ...prev, [key]: value };

        // Auto-fill companion _text field when a select changes
        const companionKey = key + "_text";
        const hasSelectCompanion = fields.some((f) => f.field_key === companionKey);
        if (hasSelectCompanion && fieldType === "select" && value) {
          const words = NUM_WORDS[jurisdiction]?.[value];
          if (words) next[companionKey] = words;
        }

        // Bug #2: auto-fill salary_amount_text / total_fee_text from numeric input
        const numericCompanion = NUMERIC_TEXT_MAP[key];
        if (numericCompanion && fields.some((f) => f.field_key === numericCompanion) && value) {
          const words = numericToWords(value, jurisdiction);
          if (words) next[numericCompanion] = words;
        }

        // Bug #3: auto-calculate end_date from start_date + contract_duration_months
        if (key === "start_date" || key === "contract_duration_months") {
          const start  = key === "start_date"                 ? value : prev["start_date"];
          const months = key === "contract_duration_months"   ? value : prev["contract_duration_months"];
          if (start && months) {
            const d = new Date(start);
            d.setMonth(d.getMonth() + parseInt(months, 10));
            d.setDate(d.getDate() - 1);
            if (!isNaN(d.getTime())) next["end_date"] = d.toISOString().slice(0, 10);
          }
        }

        return next;
      });
    },
    [fields, jurisdiction]
  );

  const currentPageValid = currentFields
    .filter((f) => f.is_required)
    .every((f) => answers[f.field_key]?.trim());

  const handleNextPage = () => {
    if (formPage < totalFormPages - 1) {
      setFormPage((p) => p + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleAssemble();
    }
  };

  const handleAssemble = async () => {
    setLoading(true);
    setError("");
    try {
      // Format date fields before sending to API
      const formattedAnswers: Answers = { ...answers };
      for (const field of fields) {
        const val = formattedAnswers[field.field_key];
        if (field.field_type === "date" && val) {
          formattedAnswers[field.field_key] = formatDate(val, jurisdiction);
        }
      }

      const res = await fetch("/api/document/assemble", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docType, jurisdiction, answers: formattedAnswers }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not generate the document. Please try again.");
        return;
      }
      setAssembledDoc(data.document);
      setStep("preview");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Network error — please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("jurisdiction");
    setJurisdiction("");
    setFields([]);
    setAnswers({});
    setFormPage(0);
    setAssembledDoc("");
    setError("");
  };

  return (
    <div>
      {/* Progress stepper */}
      <div className="mb-8 flex items-center gap-2">
        {(["Jurisdiction", "Details", "Download"] as const).map((label, i) => {
          const n = i + 1;
          const active = n === overallStep;
          const done = n < overallStep;
          return (
            <div key={label} className="flex items-center gap-2 flex-1 last:flex-none">
              <div className="flex items-center gap-2 shrink-0">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    done
                      ? "bg-gold-500 text-navy-900"
                      : active
                      ? "bg-navy-900 text-white"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  {done ? (
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : n}
                </div>
                <span className={`text-sm font-medium hidden sm:inline ${active ? "text-navy-900" : done ? "text-slate-400" : "text-slate-400"}`}>
                  {label}
                </span>
              </div>
              {i < 2 && <div className={`flex-1 h-px ${done ? "bg-gold-400" : "bg-slate-200"}`} />}
            </div>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* ── STEP 1: Jurisdiction ── */}
      {step === "jurisdiction" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-base font-bold text-navy-900 mb-1">
            Which country's law should govern this document?
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            Each jurisdiction uses different law references, terminology, and dispute resolution.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {JURISDICTIONS.map((j) => (
              <button
                key={j.code}
                onClick={() => handleSelectJurisdiction(j.code)}
                disabled={loading}
                className="group text-left p-5 rounded-xl border-2 border-slate-150 bg-slate-50 hover:border-navy-900 hover:bg-white transition-all duration-150 disabled:opacity-50"
              >
                <div className="text-2xl mb-2">{j.flag}</div>
                <div className="font-bold text-navy-900 text-base mb-1">{j.label}</div>
                <div className="text-xs text-slate-500 font-mono mb-2">{j.law}</div>
                <div className="text-xs text-gold-600 font-medium">{j.note}</div>
              </button>
            ))}
          </div>
          {loading && (
            <div className="mt-5 flex items-center gap-2 text-slate-400 text-sm">
              <svg className="animate-spin w-4 h-4 text-gold-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading questionnaire…
            </div>
          )}
        </div>
      )}

      {/* ── STEP 2: Form ── */}
      {step === "form" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-5 sm:px-8 pt-6 sm:pt-7 pb-5 border-b border-slate-100">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                  {jurisdiction === "ID" ? "🇮🇩 Indonesia" : "🇸🇬 Singapore"}
                </p>
                <h2 className="text-base font-bold text-navy-900">Fill in the details</h2>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 mb-1.5">
                  {Math.min(filledSoFar, totalVisible)} of {totalVisible} fields
                </div>
                <div className="w-28 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-400 rounded-full transition-all duration-300"
                    style={{ width: `${(filledSoFar / totalVisible) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fields */}
          <div className="px-5 sm:px-8 py-6 space-y-5">
            {currentFields.map((field) => (
              <div key={field.field_key}>
                <label className="block text-sm font-semibold text-navy-900 mb-1.5">
                  {field.question_text}
                  {field.is_required && <span className="text-red-400 ml-1">*</span>}
                  {computedKeys.has(field.field_key) && (
                    <span className="ml-2 text-xs text-gold-500 font-normal">auto-calculated</span>
                  )}
                  {prefilledKeys.has(field.field_key) && (
                    <span className="ml-2 text-xs text-gold-600 font-normal">· from your company profile</span>
                  )}
                  {CONTEXT_KEYS.has(field.field_key) && (
                    <span className="ml-2 text-xs text-slate-400 font-normal">optional</span>
                  )}
                </label>

                {field.field_type === "select" && field.options ? (
                  <select
                    value={answers[field.field_key] ?? ""}
                    onChange={(e) => handleAnswer(field.field_key, e.target.value, "select")}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition appearance-none"
                  >
                    <option value="">— Select —</option>
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : field.field_type === "date" ? (
                  <div className="relative">
                    <input
                      type="date"
                      value={answers[field.field_key] ?? ""}
                      onChange={(e) => handleAnswer(field.field_key, e.target.value, "date")}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition"
                    />
                    {computedKeys.has(field.field_key) && answers[field.field_key] && (
                      <span className="absolute right-3 top-2.5 text-xs text-gold-500 font-medium pointer-events-none">
                        ↺ auto
                      </span>
                    )}
                  </div>
                ) : field.field_type === "boolean" ? (
                  <div className="flex gap-3">
                    {["true", "false"].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => handleAnswer(field.field_key, v)}
                        className={`px-5 py-2 rounded-lg text-sm font-medium border transition-colors ${
                          answers[field.field_key] === v
                            ? "bg-navy-900 text-white border-navy-900"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {v === "true" ? "Yes" : "No"}
                      </button>
                    ))}
                  </div>
                ) : field.field_key === "agreement_context" ? (
                  <textarea
                    rows={3}
                    value={answers[field.field_key] ?? ""}
                    onChange={(e) => handleAnswer(field.field_key, e.target.value)}
                    placeholder="Describe what this agreement is for. Used to generate an optional background section — leave blank to skip."
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-navy-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition resize-y"
                  />
                ) : (
                  <input
                    type="text"
                    value={answers[field.field_key] ?? ""}
                    onChange={(e) => {
                      handleAnswer(field.field_key, e.target.value);
                      if (prefilledKeys.has(field.field_key)) {
                        setPrefilledKeys((prev) => {
                          const n = new Set(prev); n.delete(field.field_key); return n;
                        });
                      }
                    }}
                    placeholder={CONTEXT_KEYS.has(field.field_key) ? "" : `e.g. ${getPlaceholder(field.field_key, jurisdiction)}`}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-navy-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Nav */}
          <div className="px-5 sm:px-8 pb-7 flex items-center justify-between gap-3">
            <button
              onClick={formPage === 0 ? handleReset : () => { setFormPage((p) => p - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="text-sm text-slate-400 hover:text-navy-900 transition-colors"
            >
              ← {formPage === 0 ? "Change jurisdiction" : "Back"}
            </button>
            <button
              onClick={handleNextPage}
              disabled={!currentPageValid || loading}
              className="px-6 py-2.5 bg-navy-900 text-white text-sm font-semibold rounded-lg hover:bg-navy-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating…
                </>
              ) : formPage < totalFormPages - 1 ? (
                "Continue →"
              ) : (
                "Generate Document →"
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Preview ── */}
      {step === "preview" && (
        <DocumentPreview
          text={assembledDoc}
          docType={docType}
          jurisdiction={jurisdiction}
          onBack={handleReset}
          branding={branding}
        />
      )}
    </div>
  );
}

// Smart placeholders so the form feels more grounded
function getPlaceholder(fieldKey: string, jurisdiction: string): string {
  const map: Record<string, string> = {
    party_a_name:   jurisdiction === "ID" ? "PT Teknologi Maju Indonesia" : "Acme Pte. Ltd.",
    party_b_name:   jurisdiction === "ID" ? "CV Karya Digital Nusantara"  : "Bright Ideas Pte. Ltd.",
    party_a_address: jurisdiction === "ID" ? "Jl. Sudirman No.1, Jakarta Selatan" : "71 Robinson Rd, Singapore 068895",
    party_b_address: jurisdiction === "ID" ? "Jl. Gatot Subroto No.5, Jakarta" : "1 Harbourfront Ave, Singapore 098632",
    party_a_title:  jurisdiction === "ID" ? "Direktur Utama" : "Chief Executive Officer",
    party_b_title:  jurisdiction === "ID" ? "Direktur"       : "Managing Director",
    business_purpose: jurisdiction === "ID" ? "eksplorasi kerja sama pengembangan produk digital" : "exploring a potential joint venture in Southeast Asia",
    employer_name:  jurisdiction === "ID" ? "PT Startup Indonesia" : "TechVenture Pte. Ltd.",
    employee_name:  jurisdiction === "ID" ? "Budi Santoso"  : "John Tan Wei Ming",
    employee_address: jurisdiction === "ID" ? "Jl. Kebon Jeruk No.12, Jakarta Barat" : "Blk 123 Tampines St 11, Singapore 521123",
    employee_ktp:   "3171XXXXXXXXXX0001",
    employee_nric:  "S9XXXXXXXA",
    job_title:      jurisdiction === "ID" ? "Software Engineer" : "Senior Software Engineer",
    department:     "Engineering",
    reporting_to:   jurisdiction === "ID" ? "VP of Engineering" : "Head of Technology",
    salary_amount:  jurisdiction === "ID" ? "8000000" : "4500",
    salary_amount_text: jurisdiction === "ID" ? "Delapan Juta" : "Four Thousand Five Hundred",
    salary_payment_date: "25",
    work_hours_start: "09:00",
    work_hours_end:   "18:00",
    client_name:    jurisdiction === "ID" ? "PT Klien Indonesia" : "Client Corp Pte. Ltd.",
    provider_name:  jurisdiction === "ID" ? "Studio Digital" : "Creative Agency Pte. Ltd.",
    service_description: jurisdiction === "ID" ? "Desain dan pengembangan aplikasi mobile iOS/Android" : "Design and development of a web application",
    total_fee:      jurisdiction === "ID" ? "30000000" : "5000",
    total_fee_text: jurisdiction === "ID" ? "Tiga Puluh Juta" : "Five Thousand",
    dispute_resolution_city: "Jakarta",
    employer_representative: jurisdiction === "ID" ? "Andi Wijaya" : "David Lim",
    employer_representative_title: jurisdiction === "ID" ? "Direktur Utama" : "Director",
    client_representative: jurisdiction === "ID" ? "Rina Kusuma" : "Sarah Tan",
    provider_representative: jurisdiction === "ID" ? "Budi Hartono" : "James Wong",
    employer_address: jurisdiction === "ID" ? "Gedung Menara BCA Lt.20, Jakarta Pusat" : "71 Robinson Rd #14-01, Singapore 068895",
    client_address:   jurisdiction === "ID" ? "Jl. HR Rasuna Said, Kuningan, Jakarta" : "1 Raffles Place, Singapore 048616",
    provider_address: jurisdiction === "ID" ? "Jl. Kemang Raya No.9, Jakarta Selatan" : "50 Tanjong Pagar Rd, Singapore 089536",
  };
  return map[fieldKey] ?? "…";
}
