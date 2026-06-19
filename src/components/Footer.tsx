import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-slate-400 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-navy-700">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-md bg-gold-500 text-navy-900 text-xs font-bold">
                Lx
              </span>
              <span className="font-bold text-white text-base">
                Lex<span className="text-gold-400">SEA</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Self-serve legal document assembly for founders and SMEs in Southeast Asia. Indonesia & Singapore.
            </p>
          </div>

          {/* Documents */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Documents</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/generate/nda" className="hover:text-gold-400 transition-colors">Non-Disclosure Agreement (NDA)</Link></li>
              <li><Link href="/generate/pkwt" className="hover:text-gold-400 transition-colors">Employment Agreement / PKWT</Link></li>
              <li><Link href="/generate/service-agreement" className="hover:text-gold-400 transition-colors">Service Agreement</Link></li>
            </ul>
          </div>

          {/* Jurisdictions */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Jurisdictions</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><span>🇮🇩</span> Indonesia</li>
              <li className="flex items-center gap-2"><span>🇸🇬</span> Singapore</li>
              <li className="text-xs mt-3 text-slate-500">Malaysia & Thailand — coming soon</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} LexSEA. Built for H0: Hack the Zero Stack with Vercel & AWS.
          </p>
          <p className="text-xs text-slate-500 max-w-md text-left md:text-right">
            <strong className="text-slate-400">Disclaimer:</strong> LexSEA generates document templates only.
            This is not legal advice. Always consult a qualified lawyer before signing any legal agreement.
          </p>
        </div>
      </div>
    </footer>
  );
}
