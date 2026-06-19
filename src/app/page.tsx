import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const DOCUMENTS = [
  {
    slug: "nda",
    title: "Non-Disclosure Agreement",
    subtitle: "Mutual · Bilateral",
    law: "UU 30/2000 · CIA 2023",
    description:
      "Mutual confidentiality obligations, carve-outs for public information, BANI arbitration clause (ID) or SIAC (SG).",
    time: "~3 min",
    clauses: 8,
    lawyerPrice: { ID: "IDR 3–8 juta", SG: "SGD 350–600" },
  },
  {
    slug: "pkwt",
    title: "Employment Agreement",
    subtitle: "PKWT / Fixed-Term",
    law: "UU 13/2003 · EA 1968",
    description:
      "Maximum contract period, probation clause, working hours, IP assignment, and non-compete provisions.",
    time: "~5 min",
    clauses: 11,
    lawyerPrice: { ID: "IDR 5–15 juta", SG: "SGD 500–1,200" },
  },
  {
    slug: "service-agreement",
    title: "Service Agreement",
    subtitle: "Freelance / Agency",
    law: "KUHPerdata · Contract Act",
    description:
      "Scope of work, payment milestones, IP ownership transfer, termination for cause, limitation of liability.",
    time: "~4 min",
    clauses: 9,
    lawyerPrice: { ID: "IDR 4–12 juta", SG: "SGD 400–900" },
  },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">

        {/* ── HERO ── */}
        <section className="bg-navy-900 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 grid md:grid-cols-[1fr_280px] gap-14 items-start">

            {/* Left: editorial copy */}
            <div className="max-w-xl">
              <p className="text-gold-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-8">
                Indonesia · Singapore · Self-serve
              </p>
              <h1 className="font-serif text-5xl sm:text-6xl leading-[1.1] font-bold mb-6">
                Your co-founder wants an NDA.
                <br />
                Your lawyer charges{" "}
                <span className="text-gold-400">SGD 600/hr.</span>
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed mb-10 max-w-md">
                LexSEA assembles complete, law-referenced legal documents for Indonesia
                and Singapore — from a validated clause library, not a language model.
                Ready to sign in under 5 minutes.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <Link
                  href="/#documents"
                  className="px-7 py-3.5 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold rounded text-sm transition-colors"
                >
                  Generate NDA — it&apos;s free
                </Link>
                <Link
                  href="/#how-it-works"
                  className="px-7 py-3.5 border border-white/20 hover:border-white/40 text-white text-sm rounded transition-colors"
                >
                  How it works ↓
                </Link>
              </div>
              <div className="flex flex-col sm:flex-row gap-x-8 gap-y-2 text-sm text-slate-400 border-t border-white/10 pt-6">
                <span>— Template assembly, not AI-generated content</span>
                <span>— Every clause cites the actual law article</span>
                <span>— Ready in under 5 minutes</span>
              </div>
            </div>

            {/* Right: document paper (no browser chrome) */}
            <div className="hidden md:block mt-3">
              <div className="bg-parchment text-navy-900 border-t-[3px] border-t-gold-500 shadow-2xl shadow-black/40 p-5">
                <div className="font-mono text-[10px] space-y-3 leading-relaxed">
                  <div className="text-center pb-3 border-b border-slate-200">
                    <p className="font-bold text-[11px] tracking-wide uppercase text-navy-900">
                      Perjanjian Non-Disclosure
                    </p>
                    <p className="text-[10px] font-normal text-slate-500 mt-0.5">
                      Mutual · Indonesia · Jun 2026
                    </p>
                  </div>
                  <p className="text-slate-600">
                    Perjanjian ini dibuat pada tanggal{" "}
                    <span className="font-semibold text-navy-900">18 Juni 2026</span>
                  </p>
                  <p className="text-slate-600">
                    1. <span className="font-semibold">PT Teknologi Maju Indonesia</span> (&ldquo;Pihak A&rdquo;)
                  </p>
                  <p className="text-slate-600">
                    2. <span className="font-semibold">PT Inovasi Digital Nusantara</span> (&ldquo;Pihak B&rdquo;)
                  </p>
                  <div className="pt-3 border-t border-slate-200">
                    <p className="font-bold text-[10px] uppercase tracking-wide">Pasal 3 — Kewajiban Kerahasiaan</p>
                    <p className="mt-1.5 text-slate-600">
                      Para Pihak wajib menjaga Informasi Rahasia berdasarkan{" "}
                      <span className="bg-amber-50 text-amber-700 px-0.5 font-semibold">UU No. 30/2000</span>{" "}
                      tentang Rahasia Dagang. Kewajiban berlaku selama{" "}
                      <span className="font-semibold text-navy-900">2 (dua) tahun</span>...
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-200">
                    <p className="font-bold text-[10px] uppercase tracking-wide">Pasal 6 — Penyelesaian Sengketa</p>
                    <p className="mt-1.5 text-slate-600">
                      Sengketa diselesaikan melalui{" "}
                      <span className="bg-amber-50 text-amber-700 px-0.5 font-semibold">BANI</span>{" "}
                      di Jakarta sesuai UU No. 30/1999...
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200">
                  <span className="text-[9px] text-slate-400 font-mono">8 clauses · 2m 41s</span>
                  <span className="text-[9px] bg-navy-900 text-white px-2.5 py-1 font-semibold">
                    Download PDF
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 text-right">
                Actual document output — not a mockup
              </p>
            </div>

          </div>
        </section>

        {/* ── DOCUMENTS ── */}
        <section id="documents" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-gold-600 text-[11px] font-bold uppercase tracking-[0.2em] mb-3">Documents</p>
            <h2 className="font-serif text-3xl font-bold text-navy-900 mb-2">
              Three documents. Two jurisdictions.
            </h2>
            <p className="text-slate-500 text-sm max-w-xl">
              Each template is validated against current Indonesian and Singapore law.
              Every clause includes its legal basis — no black box.
            </p>
          </div>

          {/* Cards: sharp corners, dark top border, slate gap = editorial docket look */}
          <div className="grid md:grid-cols-3 gap-px bg-slate-200">
            {DOCUMENTS.map((doc) => (
              <div
                key={doc.slug}
                className="group bg-white border-t-[3px] border-t-navy-900 flex flex-col hover:shadow-xl hover:shadow-slate-100 transition-shadow duration-200"
              >
                <div className="p-6 flex-1">
                  <div className="mb-4">
                    <h3 className="font-serif font-bold text-navy-900 text-xl leading-tight">
                      {doc.title}
                    </h3>
                    <p className="text-[11px] text-gold-600 font-bold uppercase tracking-widest mt-1">
                      {doc.subtitle}
                    </p>
                  </div>
                  <p className="text-[11px] font-mono text-slate-400 mb-4 border-l-2 border-slate-200 pl-2">
                    {doc.law}
                  </p>
                  <p className="text-slate-500 text-sm leading-relaxed mb-5">{doc.description}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <span>{doc.time}</span>
                    <span>·</span>
                    <span>{doc.clauses} clauses</span>
                    <span>·</span>
                    <span>ID · SG</span>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-0">
                  <div className="text-xs text-slate-400 py-3 border-t border-slate-100 mb-3 space-y-1">
                    <div className="flex justify-between">
                      <span>Lawyer (ID):</span>
                      <span className="text-red-400 line-through">{doc.lawyerPrice.ID}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lawyer (SG):</span>
                      <span className="text-red-400 line-through">{doc.lawyerPrice.SG}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-green-600 pt-1">
                      <span>LexSEA:</span>
                      <span>from $0 — instant</span>
                    </div>
                  </div>
                  <Link
                    href={`/generate/${doc.slug}`}
                    className="block w-full text-center py-3 px-4 bg-navy-900 text-white text-sm font-semibold hover:bg-gold-500 hover:text-navy-900 transition-colors"
                  >
                    Generate →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" className="bg-parchment-dark py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">

            <div>
              <p className="text-gold-600 text-[11px] font-bold uppercase tracking-[0.2em] mb-3">Process</p>
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-3">
                From zero to signed-ready
              </h2>
              <p className="text-slate-500 text-sm mb-10 leading-relaxed">
                No account. No subscription. Pick a document, answer specific questions
                about your situation, and get a law-referenced PDF.
              </p>

              {/* Editorial numbered steps — large numerals, dividers */}
              <div>
                {[
                  {
                    n: "01",
                    title: "Pick jurisdiction + document type",
                    detail:
                      "Indonesia uses Bahasa bilingual format + BANI arbitration. Singapore uses English law + SIAC.",
                  },
                  {
                    n: "02",
                    title: "Answer 10–23 specific questions",
                    detail:
                      "Party names, addresses, duration, compensation, dispute city. No legal knowledge required.",
                  },
                  {
                    n: "03",
                    title: "Preview + download the PDF",
                    detail:
                      "Every paragraph cites the relevant law article. Review with a lawyer if needed — the structure is already done.",
                  },
                ].map((s, i) => (
                  <div
                    key={s.n}
                    className={`flex gap-6 py-7 ${i < 2 ? "border-b border-slate-200" : ""}`}
                  >
                    <span className="font-serif text-5xl font-bold text-gold-300 leading-none shrink-0 select-none">
                      {s.n}
                    </span>
                    <div className="pt-2">
                      <p className="font-semibold text-navy-900 text-sm mb-1.5">{s.title}</p>
                      <p className="text-slate-500 text-sm leading-relaxed">{s.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Law reference card — sharp corners, dark top border */}
            <div className="bg-white p-6 border-t-[3px] border-t-navy-900">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                What&apos;s inside every clause
              </p>
              <div className="space-y-4">
                {[
                  { doc: "NDA — Indonesia", law: "UU No. 30/2000 Rahasia Dagang", clauses: "8 clauses", arb: "BANI, Jakarta" },
                  { doc: "NDA — Singapore", law: "Confidential Information Act 2023", clauses: "8 clauses", arb: "SIAC, Singapore" },
                  { doc: "Employment — Indonesia", law: "UU No. 13/2003 Ketenagakerjaan", clauses: "11 clauses", arb: "PHI Court" },
                  { doc: "Employment — Singapore", law: "Employment Act 1968 (Cap. 91A)", clauses: "10 clauses", arb: "MOM / TADM" },
                ].map((row) => (
                  <div
                    key={row.doc}
                    className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-navy-900">{row.doc}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">{row.law}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-slate-500">{row.clauses}</p>
                      <p className="text-[11px] text-gold-600 font-semibold">{row.arb}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-4">
                * Service Agreement follows KUHPerdata and Singapore Contract Act.
              </p>
            </div>

          </div>
        </section>

        {/* ── WHY LEXSEA ── */}
        <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">

            <div>
              <p className="text-gold-600 text-[11px] font-bold uppercase tracking-[0.2em] mb-3">Coverage</p>
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-3">
                The only self-serve platform that covers{" "}
                <em className="text-gold-500 not-italic">both</em> jurisdictions
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Existing tools force you to choose. If you&apos;re building in Indonesia
                and Singapore simultaneously — which is how most SEA startups scale —
                you&apos;re switching between tools, paying twice, and getting inconsistent clauses.
              </p>
              <ul className="space-y-3 text-sm text-slate-600">
                {[
                  "One platform, two jurisdictions, consistent clause library",
                  "Bilingual output (Bahasa + English) for ID documents",
                  "Law articles cited in every clause — no black box",
                  "From $0 — not a subscription trap",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-slate-400 mt-0.5 font-bold select-none">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {/* Coverage table — editorial, sharp borders */}
              <div className="overflow-hidden border border-slate-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] text-slate-400 uppercase tracking-wider">
                      <th className="text-left px-4 py-3 font-semibold border-b border-slate-200">Platform</th>
                      <th className="text-center px-3 py-3 font-semibold border-b border-slate-200">ID</th>
                      <th className="text-center px-3 py-3 font-semibold border-b border-slate-200">SG</th>
                      <th className="text-left px-3 py-3 font-semibold border-b border-slate-200">Model</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { name: "LegalZoom", id: false, sg: false, model: "US only" },
                      { name: "Zegal", id: false, sg: true, model: "Subscription" },
                      { name: "KontrakHukum", id: true, sg: false, model: "Human-assisted" },
                      { name: "LexSEA", id: true, sg: true, model: "Instant · free", highlight: true },
                    ].map((row) => (
                      <tr key={row.name} className={row.highlight ? "bg-navy-900" : ""}>
                        <td
                          className={`px-4 py-3 font-semibold text-sm ${
                            row.highlight ? "text-white" : "text-slate-700"
                          }`}
                        >
                          {row.name}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {row.id ? (
                            <span className="text-green-500 font-bold">✓</span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {row.sg ? (
                            <span className="text-green-500 font-bold">✓</span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td
                          className={`px-3 py-3 text-xs font-medium ${
                            row.highlight ? "text-gold-400" : "text-slate-400"
                          }`}
                        >
                          {row.model}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-slate-400 mt-3">
                Based on publicly available information, June 2026.
              </p>
            </div>

          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" className="bg-navy-900 py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <p className="text-gold-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-3">Pricing</p>
              <h2 className="font-serif text-3xl font-bold text-white mb-2">Simple pricing.</h2>
              <p className="text-slate-400 text-sm">
                A lawyer charges SGD 350–600 for a 3-page NDA.
                Start free — no card, no account required.
              </p>
            </div>

            {/* Pricing: border-separated columns, not heavy cards */}
            <div className="grid md:grid-cols-3 border border-white/10">
              {[
                {
                  name: "Free",
                  price: "$0",
                  period: "no card needed",
                  features: ["1 document / month", "Watermarked PDF", "ID + SG jurisdictions", "Instant download"],
                  cta: "Start free",
                  href: "/#documents",
                  featured: false,
                  disabled: false,
                },
                {
                  name: "Pay per doc",
                  price: "$15",
                  period: "per document",
                  features: ["No watermark", "Full-quality PDF", "ID + SG jurisdictions", "Email delivery"],
                  cta: "Get document",
                  href: "/#documents",
                  featured: true,
                  disabled: false,
                },
                {
                  name: "Startup",
                  price: "$29",
                  period: "/ month",
                  features: ["Unlimited documents", "All jurisdictions", "Team access", "Priority support"],
                  cta: "Coming soon",
                  href: "#",
                  featured: false,
                  disabled: true,
                },
              ].map((plan, i) => (
                <div
                  key={plan.name}
                  className={`p-6 flex flex-col ${i < 2 ? "border-r border-r-white/10" : ""} ${
                    plan.featured ? "border-t-[3px] border-t-gold-500" : "border-t-[3px] border-t-transparent"
                  }`}
                >
                  <p
                    className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${
                      plan.featured ? "text-gold-400" : "text-slate-400"
                    }`}
                  >
                    {plan.name}
                  </p>
                  <div className="font-serif text-4xl font-bold text-white mb-0.5">{plan.price}</div>
                  <p className="text-sm text-slate-400 mb-6">{plan.period}</p>
                  <ul className="space-y-2.5 flex-1 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className={`font-bold mt-0.5 select-none ${plan.featured ? "text-gold-400" : "text-slate-500"}`}>
                          —
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.href}
                    className={`text-center py-2.5 text-sm font-bold transition-colors ${
                      plan.featured
                        ? "bg-gold-500 text-navy-900 hover:bg-gold-400"
                        : plan.disabled
                        ? "bg-navy-800 text-slate-500 cursor-not-allowed pointer-events-none"
                        : "bg-white/10 text-white hover:bg-white/15"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
