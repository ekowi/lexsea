"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import type { UserBranding } from "@/lib/auth";

const PDFDownloadButton = dynamic(() => import("./PDFDownloadButton"), { ssr: false });

const DOC_LABELS: Record<string, string> = {
  nda: "Non-Disclosure Agreement",
  pkwt: "Employment Agreement",
  "service-agreement": "Service Agreement",
};

const JURISDICTION_LABELS: Record<string, string> = {
  ID: "Indonesia",
  SG: "Singapore",
};

interface Props {
  text:         string;
  docType:      string;
  jurisdiction: string;
  onBack:       () => void;
  branding?:    UserBranding | null;
}

export default function DocumentPreview({ text, docType, jurisdiction, onBack, branding }: Readonly<Props>) {
  const [copied, setCopied] = useState(false);

  const docTitle = `${DOC_LABELS[docType] ?? docType} — ${JURISDICTION_LABELS[jurisdiction] ?? jurisdiction}`;
  const filename = `lexsea_${docType}_${jurisdiction.toLowerCase()}_${new Date().toISOString().slice(0, 10)}`;

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  // Strip §-annotation lines from plain-text preview; PDF gets full text
  const previewText = text.split("\n").filter((l) => !l.trimStart().startsWith("[§]")).join("\n");

  return (
    <div className="space-y-4">
      {/* Action bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-sm font-semibold text-navy-900">{docTitle}</span>
          </div>
          <p className="text-xs text-slate-400 ml-4">
            Generated {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy text
              </>
            )}
          </button>

          <PDFDownloadButton text={text} title={docTitle} filename={filename} jurisdiction={jurisdiction} branding={branding} />
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
        </svg>
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Not legal advice.</strong> This document is generated from a validated template library.
          Please review carefully with a qualified lawyer before signing or enforcing this agreement.
          LexSEA is a document generation tool, not a law firm.
        </p>
      </div>

      {/* Document */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-parchment-dark border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            </div>
            <span className="text-xs text-slate-400 ml-2 font-mono">{filename}.pdf</span>
          </div>
          <span className="text-xs text-slate-400">
            {previewText.trim().split(/\s+/).length.toLocaleString()} words
          </span>
        </div>
        <div className="px-5 sm:px-10 py-6 sm:py-10 max-h-[60vh] overflow-y-auto preview-scroll">
          <pre className="document-text text-sm text-navy-900 wrap-break-word">{previewText}</pre>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <button
          onClick={onBack}
          className="text-sm text-slate-500 hover:text-navy-900 transition-colors text-left"
        >
          ← Generate another document
        </button>
        <PDFDownloadButton text={text} title={docTitle} filename={filename} jurisdiction={jurisdiction} branding={branding} primary />
      </div>
    </div>
  );
}
