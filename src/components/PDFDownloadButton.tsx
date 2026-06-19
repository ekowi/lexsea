"use client";

import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { UserBranding } from "@/lib/auth";

// ── Palette ──────────────────────────────────────────────────────────────────

const C = {
  navy:       "#0d1b2a",
  navyLight:  "#22405f",
  gold:       "#b8883a",
  body:       "#1a1a1a",
  muted:      "#777777",
  rule:       "#d8d0c4",
  dashBorder: "#bbb",
} as const;

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  page: {
    paddingTop:        60,
    paddingBottom:     80,
    paddingHorizontal: 78,         // ~27.5 mm — within Weagree 25–30 mm range
    fontFamily:        "Times-Roman",
    backgroundColor:   "#fff",
    fontSize:          11,          // Weagree default; Butterick 10–12pt range
    color:             C.body,
  },

  // ── Fixed header (every page) ────────────────────────────────────────────

  header: {
    position:          "absolute",
    top:               18,
    left:              78,
    right:             78,
    flexDirection:     "row",
    justifyContent:    "space-between",
    alignItems:        "flex-end",
    paddingBottom:     5,
    borderBottomColor: C.gold,
    borderBottomWidth: 0.8,
  },
  headerBrand: {
    fontFamily:    "Helvetica-Bold",
    fontSize:      7.5,
    color:         C.gold,
    letterSpacing: 1.5,
  },
  headerMeta: {
    fontFamily: "Helvetica",
    fontSize:   7,
    color:      C.muted,
    textAlign:  "right",
  },

  // ── Fixed footer (every page) ────────────────────────────────────────────

  footer: {
    position:        "absolute",
    bottom:          20,
    left:            78,
    right:           78,
    flexDirection:   "row",
    justifyContent:  "space-between",
    alignItems:      "flex-start",
    paddingTop:      5,
    borderTopColor:  C.rule,
    borderTopWidth:  0.5,
  },
  footerLeft: {
    fontFamily: "Helvetica",
    fontSize:   6.5,
    color:      C.muted,
    maxWidth:   260,
  },
  footerRight: {
    fontFamily: "Helvetica",
    fontSize:   6.5,
    color:      C.muted,
    textAlign:  "right",
  },

  // ── Closing disclaimer note (foot of document) ───────────────────────────

  disclaimer: {
    marginTop:         26,
    paddingTop:        8,
    paddingHorizontal: 9,
    borderTopColor:    C.rule,
    borderTopWidth:    0.5,
  },
  disclaimerText: {
    fontFamily: "Helvetica",
    fontSize:   6.5,
    color:      C.muted,
    textAlign:  "center",
    lineHeight: 1.5,
  },

  // ── Document title block (cover area) ───────────────────────────────────

  titleBlock: {
    alignItems:    "center",
    marginTop:     4,
    marginBottom:  20,
  },
  titleRuleThick: {
    width:           "100%",
    height:          2,               // slightly heavier for authority
    backgroundColor: C.gold,
    marginBottom:    12,
  },
  titlePlatform: {
    fontFamily:    "Helvetica",
    fontSize:      7,
    color:         C.muted,
    letterSpacing: 2.5,
    marginBottom:  8,
  },
  titleText: {
    fontFamily:    "Times-Bold",
    fontSize:      15,                // ~136% of body — clear title hierarchy
    color:         C.navy,
    textAlign:     "center",
    letterSpacing: 0.9,               // ~6% of 15pt — Butterick ALL CAPS 5-12%
    marginBottom:  2,
  },
  titleRuleThin: {
    width:           "60%",
    height:          0.5,
    backgroundColor: C.rule,
    marginVertical:  10,
  },
  titleRef: {
    fontFamily:    "Helvetica",
    fontSize:      8,
    color:         C.muted,
    textAlign:     "center",
    letterSpacing: 0.3,
    lineHeight:    1.5,
  },

  // ── PASAL heading — Indonesian style ────────────────────────────────────
  // Visual separator above + gold "PASAL X" label + navy bold centered title

  pasalBlock: {
    marginTop:        22,
    marginBottom:      8,
    alignItems:       "center",
    paddingTop:        8,
    borderTopColor:   C.rule,
    borderTopWidth:   0.5,
  },
  pasalNumber: {
    fontFamily:    "Helvetica",
    fontSize:      8,
    color:         C.gold,
    letterSpacing: 2,
    marginBottom:  3,
  },
  pasalTitle: {
    fontFamily:    "Times-Bold",
    fontSize:      11.5,
    color:         C.navy,
    textAlign:     "center",
    letterSpacing: 0.4,
  },

  // ── Numbered clause heading — Singapore/SG style ─────────────────────────
  // "1. DEFINITIONS AND INTERPRETATION" — left aligned, bold, with rules

  sgClauseBlock: {
    marginTop:        20,
    marginBottom:      6,
    paddingTop:        8,
    paddingBottom:     5,
    borderTopColor:   C.rule,
    borderTopWidth:   0.5,
    borderBottomColor: C.rule,
    borderBottomWidth: 0.5,
  },
  sgClauseText: {
    fontFamily:    "Times-Bold",
    fontSize:      11.5,
    color:         C.navy,
    letterSpacing: 0.3,
  },

  // ── Generic ALL-CAPS section heading ────────────────────────────────────

  sectionBlock: {
    marginTop:        20,
    marginBottom:      6,
    paddingTop:        6,
    borderTopColor:   C.rule,
    borderTopWidth:   0.5,
  },
  sectionText: {
    fontFamily:    "Times-Bold",
    fontSize:      10,
    color:         C.navy,
    letterSpacing: 0.55,  // ~5% of 10pt — meets Butterick ALL CAPS minimum
  },

  // ── Body paragraph ───────────────────────────────────────────────────────
  // lineHeight 1.4 = 140% of 11pt = 15.4pt leading — Butterick 120–145% rule

  para: {
    marginBottom: 10,              // Butterick: 4–10pt paragraph spacing
    lineHeight:   1.4,
    textAlign:    "justify",
  },

  // ── Numbered list items — (1. text / 1.1 text) ───────────────────────────

  numRow: {
    flexDirection: "row",
    marginBottom:  8,
  },
  numLabel: {
    fontFamily: "Times-Bold",
    fontSize:   11,
    width:      34,
    color:      C.navy,
    flexShrink: 0,
  },
  numText: {
    flex:       1,
    lineHeight: 1.4,
    textAlign:  "justify",
  },

  // ── Lettered sub-items — (a) text ────────────────────────────────────────

  letRow: {
    flexDirection: "row",
    marginBottom:  6,
    paddingLeft:   20,             // ~1.8× 11pt — Butterick: 1–4× point size
  },
  letLabel: {
    fontFamily: "Times-Roman",
    fontSize:   11,
    width:      22,
    color:      C.navy,
    flexShrink: 0,
  },
  letText: {
    flex:       1,
    lineHeight: 1.4,
    textAlign:  "justify",
  },

  // ── Signature section ─────────────────────────────────────────────────────

  sigSection: {
    marginTop:       28,
    paddingTop:      14,
    borderTopColor:  C.rule,
    borderTopWidth:  0.8,            // slightly more prominent before signatures
  },
  rangkapText: {
    fontFamily:   "Times-Italic",
    fontSize:      9.5,
    color:        C.muted,
    textAlign:    "center",
    marginBottom: 20,
    lineHeight:   1.4,
  },
  sigColumns: {
    flexDirection:  "row",
    justifyContent: "space-between",
    marginTop:       8,
  },
  sigCol: {
    width: "44%",
  },

  // Role label: "PIHAK A:" / "PARTY A:"
  sigRole: {
    fontFamily:   "Times-Bold",
    fontSize:     10,
    color:        C.navy,
    marginBottom: 12,
    letterSpacing: 0.5,              // ~5% of 10pt — Butterick ALL CAPS minimum
  },

  // Materai box (ID only)
  materaiWrap: {
    marginBottom: 8,
  },
  materaiBox: {
    width:            70,
    height:           56,
    borderWidth:      0.6,
    borderColor:      C.dashBorder,
    borderStyle:      "dashed",
    alignItems:       "center",
    justifyContent:   "center",
  },
  materaiLabel: {
    fontFamily: "Helvetica",
    fontSize:   6,
    color:      C.muted,
    letterSpacing: 1,
    marginBottom: 2,
  },
  materaiValue: {
    fontFamily: "Helvetica-Bold",
    fontSize:   7.5,
    color:      C.muted,
  },
  materaiNote: {
    fontFamily: "Helvetica",
    fontSize:   5.5,
    color:      C.dashBorder,
    textAlign:  "center",
    marginTop:  3,
    maxWidth:   70,
  },

  // Signature line
  sigLine: {
    borderBottomColor: C.body,
    borderBottomWidth: 0.8,
    marginBottom:       5,
    marginTop:          4,
    height:             1,
  },

  sigName: {
    fontFamily: "Times-Bold",
    fontSize:   10,
    color:      C.body,
    marginBottom: 2,
  },
  sigJobTitle: {
    fontFamily: "Times-Roman",
    fontSize:   9,
    color:      C.muted,
    marginBottom: 2,
  },
  sigDateLabel: {
    fontFamily: "Times-Roman",
    fontSize:   9,
    color:      C.muted,
  },

  // "For and on behalf of" (SG style)
  sigOnBehalf: {
    fontFamily:   "Times-Italic",
    fontSize:     9,
    color:        C.muted,
    marginBottom: 22,
  },
});

// ── Document types ────────────────────────────────────────────────────────────

type Seg =
  | { k: "title";     t: string }
  | { k: "pasal_id";  num: string; title: string }
  | { k: "sg_clause"; num: string; title: string }
  | { k: "section";   t: string }
  | { k: "para";      t: string }
  | { k: "num";       n: string; t: string }
  | { k: "let";       n: string; t: string }
  | { k: "sig";       intro: string; left: SigCol; right: SigCol };

interface SigCol {
  role:     string;
  name:     string;
  jobTitle: string;
  date:     string;
}

// ── Pre-compiled regex (avoids re-creation and keeps complexity low) ──────────

const RE = {
  twoCol:   /^(.+?)\s{5,}(.+)$/,
  role:     /^[A-Z][A-Z\s/]+:?$/,
  titleKw:  /Direktur|Director|CEO|CFO|COO|Manager|Manajer|Representative|Officer|Engineer|Founder|President/i,
  dateLabel:/^(Tanggal|Date)\s*:/i,
  sigHead:  /^(TANDA TANGAN|IN WITNESS WHEREOF)/i,
  pasal:    /^(PASAL\s+\d+)\s*[—–-]\s*(.+)$/i,
  sgClause: /^(\d+)[.]\s+([A-Z][A-Z\s/&,']+)$/,
  allCaps:  /^[A-Z][A-Z\s—–/&]+$/,
  // numItem/numCap handle both "1." style and "1.1" decimal sub-clause style
  numItem:  /^\d+(?:\.\d+)*[.) ]/,
  letItem:  /^\(?[a-z]\)?[.)]\s/i,
  numCap:   /^(\d+(?:\.\d+)*)[.) ]+(.+)/,
  letCap:   /^(?:\(([a-z])\)|([a-z])[.)])\s+(.*)/i,
  annotation: /^\s*\[§\]/,
  mixedCol: /\s{5,}/,
} as const;

// ── Parser helpers ────────────────────────────────────────────────────────────

function pickCol(l: string, side: "left" | "right"): string {
  const m = RE.twoCol.exec(l);
  if (m) return side === "left" ? m[1].trim() : m[2].trim();
  return l.trim();
}

function extractSigCol(allLines: string[], side: "left" | "right"): SigCol {
  const cols = allLines.map((l) => pickCol(l, side));

  const role = cols.find(
    (c) => RE.role.test(c.trim()) && c.trim().length > 2 && c.trim().length < 40 && !c.includes("_")
  ) ?? "";

  // Company (PT/CV) or mixed-case proper noun; exclude role labels and underscores
  const name = cols.find((c) => {
    const t = c.trim();
    return /^(?:PT|CV)[. ]|^[A-Z][a-z]/.test(t) && !t.includes("_") && t !== role;
  }) ?? "";

  const jobTitle = cols.find(
    (c) => RE.titleKw.test(c) && !c.includes("_")
  ) ?? "";

  const date = cols.find((c) => RE.dateLabel.test(c)) ?? "Tanggal / Date: _______________";

  return { role, name, jobTitle, date };
}

function buildSigSeg(paragraphs: string[], sigStart: number): Seg {
  const sigParas = paragraphs.slice(sigStart).filter((x) => x.trim());
  const allLines = sigParas.flatMap((sp) => sp.split("\n")).filter((l) => l.trim());

  const intro = sigParas.find((x) => {
    const t = x.trim();
    return t && !RE.sigHead.test(t) && !RE.mixedCol.test(t) && !t.includes("___") && t.length > 30;
  }) ?? "";

  return {
    k:     "sig",
    intro: intro.trim(),
    left:  extractSigCol(allLines, "left"),
    right: extractSigCol(allLines, "right"),
  };
}

function classifyParagraph(p: string): Seg | null {
  const pasalM = RE.pasal.exec(p);
  if (pasalM) return { k: "pasal_id", num: pasalM[1].toUpperCase(), title: pasalM[2].trim().toUpperCase() };

  const sgM = RE.sgClause.exec(p);
  if (sgM && sgM[2].length > 3) return { k: "sg_clause", num: sgM[1], title: sgM[2].trim() };

  if (RE.allCaps.test(p) && p.length > 4 && !p.includes(".") && !p.includes(","))
    return { k: "section", t: p };

  return null;
}

function parseListLines(lines: string[]): Seg[] | null {
  if (lines.every((l) => RE.numItem.test(l))) {
    return lines.flatMap((l) => {
      const m = RE.numCap.exec(l);
      return m ? [{ k: "num" as const, n: m[1], t: m[2] }] : [];
    });
  }
  if (lines.every((l) => RE.letItem.test(l))) {
    return lines.flatMap((l) => {
      const m = RE.letCap.exec(l);
      return m ? [{ k: "let" as const, n: (m[1] ?? m[2]).toLowerCase(), t: m[3] }] : [];
    });
  }
  return null;
}

function parseMixedLines(lines: string[]): Seg[] {
  return lines.flatMap<Seg>((l) => {
    const nm = RE.numCap.exec(l);
    if (nm) return [{ k: "num", n: nm[1], t: nm[2] }];
    const lm = RE.letCap.exec(l);
    if (lm) return [{ k: "let", n: (lm[1] ?? lm[2]).toLowerCase(), t: lm[3] }];
    return [{ k: "para", t: l }];
  });
}

function parseParagraph(p: string): Seg[] {
  // Defensive: drop any stray [§] advisory annotations (never in executed docs)
  const lines = p.split("\n").map((l) => l.trim()).filter((l) => l && !RE.annotation.test(l));
  if (lines.length === 0) return [];

  const listSegs = parseListLines(lines);
  if (listSegs) return listSegs;

  const hasList = lines.some((l) => RE.numItem.test(l) || RE.letItem.test(l));
  if (hasList) return parseMixedLines(lines);

  return [{ k: "para", t: lines.join(" ") }];
}

function parseDoc(raw: string): Seg[] {
  const paragraphs = raw.split(/\n{2,}/);
  const segs: Seg[] = [];
  let isFirst = true;
  const sigStart = paragraphs.findIndex((p) => RE.sigHead.test(p.trim()));

  for (let pi = 0; pi < paragraphs.length; pi++) {
    const p = paragraphs[pi].trim();
    if (!p) continue;

    if (isFirst) { segs.push({ k: "title", t: p }); isFirst = false; continue; }
    if (sigStart !== -1 && pi === sigStart) { segs.push(buildSigSeg(paragraphs, sigStart)); break; }

    const classified = classifyParagraph(p);
    if (classified) { segs.push(classified); continue; }

    segs.push(...parseParagraph(p));
  }

  return segs;
}

// ── Renderer ─────────────────────────────────────────────────────────────────

function renderSig(seg: Extract<Seg, { k: "sig" }>, jurisdiction: string, segKey: number) {
  const isID = jurisdiction === "ID";

  return (
    <View key={segKey} style={s.sigSection} wrap={false}>
      {/* Rangkap phrase — Indonesia only */}
      {isID && (
        <Text style={s.rangkapText}>
          Perjanjian ini dibuat dalam rangkap 2 (dua), masing-masing mempunyai kekuatan{"\n"}
          hukum yang sama dan dibubuhi materai cukup sesuai ketentuan yang berlaku.
        </Text>
      )}
      {/* Intro text */}
      {seg.intro ? (
        <Text style={{ ...s.rangkapText, marginBottom: isID ? 16 : 12 }}>
          {seg.intro}
        </Text>
      ) : null}

      {/* Two-column signature block */}
      <View style={s.sigColumns}>
        {(["left", "right"] as const).map((side, idx) => {
          const col = side === "left" ? seg.left : seg.right;
          const sideLabel = idx === 0 ? "A" : "B";
          const defaultRole = isID ? `PIHAK ${sideLabel}:` : `PARTY ${sideLabel}:`;
          return (
          <View key={side} style={s.sigCol}>
            {/* Role label */}
            <Text style={s.sigRole}>{col.role || defaultRole}</Text>

            {/* Materai box (ID) or "For and on behalf of" gap (SG) */}
            {isID ? (
              <View style={s.materaiWrap}>
                <View style={s.materaiBox}>
                  <Text style={s.materaiLabel}>M A T E R A I</Text>
                  <Text style={s.materaiValue}>Rp 10.000</Text>
                </View>
                <Text style={s.materaiNote}>tanda tangan di atas materai</Text>
              </View>
            ) : (
              <Text style={s.sigOnBehalf}>
                For and on behalf of{"\n"}{col.name || "___________________________"}
              </Text>
            )}

            {/* Signature line */}
            <View style={s.sigLine} />

            {/* Name */}
            {col.name && isID && <Text style={s.sigName}>{col.name}</Text>}
            {/* Job title */}
            {col.jobTitle ? <Text style={s.sigJobTitle}>{col.jobTitle}</Text> : null}
            {/* Date */}
            <Text style={s.sigDateLabel}>{col.date}</Text>
          </View>
          );
        })}
      </View>
    </View>
  );
}

// ── Branding helpers (keeps LegalDocument complexity low) ────────────────────

function headerBrandText(branding: UserBranding | null | undefined): string {
  if (!branding || branding.showLexseaBrand) return "LEXSEA";
  if (branding.letterheadStyle === "none" || !branding.companyName) return "";
  return branding.companyName.toUpperCase();
}

function footerLeftText(branding: UserBranding | null | undefined, isID: boolean): string {
  if (!branding || branding.showLexseaBrand) {
    return isID
      ? "LexSEA · Bukan nasihat hukum · Tinjau dengan pengacara sebelum menandatangani"
      : "LexSEA · Not legal advice · Review with a qualified lawyer before signing";
  }
  if (branding.footerText) return branding.footerText;
  if (branding.companyName) return `${branding.companyName} · Confidential`;
  return isID ? "Dokumen Rahasia" : "Confidential";
}

function makePageLabel(isID: boolean) {
  return ({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) =>
    isID
      ? `Halaman ${pageNumber} dari ${totalPages}`
      : `Page ${pageNumber} of ${totalPages}`;
}

function renderTitle(
  seg: { k: "title"; t: string },
  jurisdiction: string,
  branding: UserBranding | null | undefined,
  i: number,
) {
  const isIDjuris = jurisdiction === "ID";
  const now       = new Date();
  const docDate   = now.toLocaleDateString(isIDjuris ? "id-ID" : "en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
  const prefix  = (branding && !branding.showLexseaBrand && branding.docIdPrefix) ? branding.docIdPrefix : "LS";
  const refNum  = `${prefix}/${jurisdiction}/${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const platform = (!branding || branding.showLexseaBrand) ? "LEXSEA DOCUMENT ASSEMBLY" : branding.companyName.toUpperCase();

  return (
    <View key={i} style={s.titleBlock}>
      <View style={s.titleRuleThick} />
      {platform ? <Text style={s.titlePlatform}>{platform}</Text> : null}
      <Text style={s.titleText}>{seg.t}</Text>
      <View style={s.titleRuleThin} />
      <Text style={s.titleRef}>
        {`Ref: ${refNum}  ·  ${isIDjuris ? "Indonesia" : "Singapore"}  ·  ${docDate}`}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function renderSeg(seg: Seg, i: number, jurisdiction: string, branding?: UserBranding | null) {
  switch (seg.k) {
    case "title":
      return renderTitle(seg, jurisdiction, branding, i);

    case "pasal_id":
      return (
        <View key={i} style={s.pasalBlock} wrap={false}>
          <Text style={s.pasalNumber}>{seg.num}</Text>
          <Text style={s.pasalTitle}>{seg.title}</Text>
        </View>
      );

    case "sg_clause":
      return (
        <View key={i} style={s.sgClauseBlock} wrap={false}>
          <Text style={s.sgClauseText}>{seg.num}.{"  "}{seg.title}</Text>
        </View>
      );

    case "section":
      return (
        <View key={i} style={s.sectionBlock} wrap={false}>
          <Text style={s.sectionText}>{seg.t}</Text>
        </View>
      );

    case "para":
      return <Text key={i} style={s.para}>{seg.t}</Text>;

    case "num":
      return (
        <View key={i} style={s.numRow}>
          {/* compound "1.1" keeps its dots; simple "1" gets a trailing period */}
          <Text style={s.numLabel}>{seg.n.includes(".") ? seg.n : `${seg.n}.`}</Text>
          <Text style={s.numText}>{seg.t}</Text>
        </View>
      );

    case "let":
      return (
        <View key={i} style={s.letRow}>
          <Text style={s.letLabel}>({seg.n})</Text>
          <Text style={s.letText}>{seg.t}</Text>
        </View>
      );

    case "sig":
      return renderSig(seg, jurisdiction, i);

    default:
      return null;
  }
}

// ── Legal document component ──────────────────────────────────────────────────

function LegalDocument({ text, title, jurisdiction, branding }: Readonly<{
  text:         string;
  title:        string;
  jurisdiction: string;
  branding?:    UserBranding | null;
}>) {
  const segs          = parseDoc(text);
  const isID          = jurisdiction === "ID";
  const today         = new Date().toLocaleDateString(isID ? "id-ID" : "en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
  const disclaimerText = isID
    ? "DISCLAIMER — Dokumen ini dihasilkan dari template yang divalidasi, untuk tujuan informasi saja.\nINI BUKAN NASIHAT HUKUM. Selalu tinjau dengan pengacara yang berkualifikasi sebelum menandatangani. LexSEA bukan firma hukum."
    : "DISCLAIMER — This document is generated from a validated template library for informational purposes only.\nThis is NOT legal advice. Always review with a qualified lawyer before signing. LexSEA is not a law firm.";

  return (
    <Document
      title={title}
      author="LexSEA"
      subject={`Legal Document — ${title}`}
      creator="LexSEA Document Assembly Platform"
      keywords={`legal document, ${isID ? "Indonesia, Bahasa Indonesia" : "Singapore, English"}`}
    >
      <Page size="A4" style={s.page}>

        <View style={s.header} fixed>
          <Text style={s.headerBrand}>{headerBrandText(branding)}</Text>
          <Text style={s.headerMeta}>
            {title}{"\n"}{isID ? "Indonesia" : "Singapore"} · {today}
          </Text>
        </View>

        <View style={s.footer} fixed>
          <Text style={s.footerLeft}>{footerLeftText(branding, isID)}</Text>
          <Text style={s.footerRight} render={makePageLabel(isID)} />
        </View>

        {/* Document opens directly with its formal title (like an executed contract) */}
        {segs.map((seg, i) => renderSeg(seg, i, jurisdiction, branding))}

        {/* Closing disclaimer note — keeps the body clean while the per-page footer
            still carries the "not legal advice" warning on every page */}
        <View style={s.disclaimer} wrap={false}>
          <Text style={s.disclaimerText}>{disclaimerText}</Text>
        </View>

      </Page>
    </Document>
  );
}

// ── Props & export ────────────────────────────────────────────────────────────

interface Props {
  text:         string;
  title:        string;
  filename:     string;
  jurisdiction: string;
  primary?:     boolean;
  branding?:    UserBranding | null;
}

export default function PDFDownloadButton({
  text, title, filename, jurisdiction, primary = false, branding,
}: Readonly<Props>) {
  return (
    <PDFDownloadLink
      document={<LegalDocument text={text} title={title} jurisdiction={jurisdiction} branding={branding} />}
      fileName={`${filename}.pdf`}
    >
      {({ loading }) =>
        primary ? (
          <button
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-900 text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {loading ? "Menyiapkan PDF…" : "Download PDF"}
          </button>
        ) : (
          <button
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 text-sm bg-navy-900 hover:bg-navy-800 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {loading ? "Menyiapkan…" : "Download PDF"}
          </button>
        )
      }
    </PDFDownloadLink>
  );
}
