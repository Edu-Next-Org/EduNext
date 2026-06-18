"use client";

import React from "react";
import Image from "next/image";
import {
  Award,
  CalendarDays,
  Download,
  User2,
  Hash,
  Shield,
  Star,
} from "lucide-react";
import type { CertificateData } from "@/core/services/api/Get/GetCertificateByCode";

interface Props {
  certificate: CertificateData;
}

export default function CertificateDocument({ certificate }: Props) {
  const issuedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(new Date(certificate.issuedAt));

  const handlePrint = () => window.print();

  return (
    <main className="min-h-screen dark:bg-none dark:bg-[#0E0B24] bg-[radial-gradient(circle_at_top,_rgba(100,77,179,0.18),_transparent_32%),linear-gradient(180deg,_#f6f1fb_0%,_#ece6f5_100%)] flex items-start justify-center px-3 py-8 sm:px-4 sm:py-10 md:py-12 lg:px-4 lg:py-16 print:bg-white print:block print:p-0">
      <button
        onClick={handlePrint}
        className="print:hidden cursor-pointer fixed top-4 right-4 sm:top-6 sm:right-6 lg:top-25 lg:right-20 z-50 inline-flex items-center gap-2 rounded-full bg-[#ddd] dark:bg-white/10 border border-white/20 backdrop-blur-md px-4 py-2.5 text-sm font-semibold text-[black] dark:text-white transition-all duration-200"
      >
        <Download size={15} />
        Print Certificate
      </button>

      <div className="w-full max-w-[860px] print:max-w-full">
        <div className="relative bg-[#FDFAF0] overflow-hidden shadow-[0_50px_140px_rgba(0,0,0,0.65)] print:shadow-none">
          <div className="h-[7px] bg-[linear-gradient(90deg,_#5C3D0A_0%,_#C49A3C_28%,_#E8C566_50%,_#C49A3C_72%,_#5C3D0A_100%)]" />

          <div className="absolute inset-[7px] border border-[#C49A3C]/25 pointer-events-none z-20" />
          <div className="absolute inset-[13px] border border-[#C49A3C]/12 pointer-events-none z-20" />

          <div
            className="absolute inset-0 pointer-events-none opacity-[0.022]"
            style={{
              backgroundImage:
                "radial-gradient(#5038A8 0.75px, transparent 0.75px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.025]">
            <Award size={440} strokeWidth={0.5} className="text-[#5038A8]" />
          </div>

          <svg
            className="absolute top-3.5 left-3.5 pointer-events-none text-[#C49A3C]/60"
            width="76"
            height="76"
            viewBox="0 0 76 76"
            fill="none"
          >
            <path
              d="M2 74 L2 2 L74 2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M10 66 L10 10 L66 10"
              stroke="currentColor"
              strokeWidth="0.75"
              opacity="0.5"
            />
            <circle cx="2" cy="2" r="3.5" fill="currentColor" />
            <circle cx="38" cy="2" r="1.8" fill="currentColor" opacity="0.5" />
            <circle cx="2" cy="38" r="1.8" fill="currentColor" opacity="0.5" />
          </svg>
          <svg
            className="absolute top-3.5 right-3.5 pointer-events-none text-[#C49A3C]/60"
            width="76"
            height="76"
            viewBox="0 0 76 76"
            fill="none"
          >
            <path
              d="M74 74 L74 2 L2 2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M66 66 L66 10 L10 10"
              stroke="currentColor"
              strokeWidth="0.75"
              opacity="0.5"
            />
            <circle cx="74" cy="2" r="3.5" fill="currentColor" />
            <circle cx="38" cy="2" r="1.8" fill="currentColor" opacity="0.5" />
            <circle cx="74" cy="38" r="1.8" fill="currentColor" opacity="0.5" />
          </svg>
          <svg
            className="absolute bottom-3.5 left-3.5 pointer-events-none text-[#C49A3C]/60"
            width="76"
            height="76"
            viewBox="0 0 76 76"
            fill="none"
          >
            <path
              d="M2 2 L2 74 L74 74"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M10 10 L10 66 L66 66"
              stroke="currentColor"
              strokeWidth="0.75"
              opacity="0.5"
            />
            <circle cx="2" cy="74" r="3.5" fill="currentColor" />
            <circle cx="38" cy="74" r="1.8" fill="currentColor" opacity="0.5" />
            <circle cx="2" cy="38" r="1.8" fill="currentColor" opacity="0.5" />
          </svg>
          <svg
            className="absolute bottom-3.5 right-3.5 pointer-events-none text-[#C49A3C]/60"
            width="76"
            height="76"
            viewBox="0 0 76 76"
            fill="none"
          >
            <path
              d="M74 2 L74 74 L2 74"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M66 10 L66 66 L10 66"
              stroke="currentColor"
              strokeWidth="0.75"
              opacity="0.5"
            />
            <circle cx="74" cy="74" r="3.5" fill="currentColor" />
            <circle cx="38" cy="74" r="1.8" fill="currentColor" opacity="0.5" />
            <circle cx="74" cy="38" r="1.8" fill="currentColor" opacity="0.5" />
          </svg>

          <div className="relative z-10 px-5 pt-8 pb-8 sm:px-8 sm:pt-10 sm:pb-10 md:px-12 md:pt-12 md:pb-12 lg:px-20 lg:pt-14 lg:pb-12 print:px-16 print:py-12">
            <header className="text-center mb-8 sm:mb-9 md:mb-10">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="h-px w-10 sm:w-14 bg-gradient-to-r from-transparent to-[#C49A3C]" />
                <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.5em] sm:tracking-[0.65em] text-[#8B6914]">
                  Official Certification
                </p>
                <div className="h-px w-10 sm:w-14 bg-gradient-to-l from-transparent to-[#C49A3C]" />
              </div>

              <h1
                className="text-[28px] leading-[1.05] sm:text-[38px] md:text-[46px] lg:text-[52px] font-black tracking-tight text-[#0E0B24]"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Certificate{" "}
                <em
                  className="font-normal not-italic text-[#5038A8]"
                  style={{ fontStyle: "italic", fontFamily: "Georgia, serif" }}
                >
                  of
                </em>{" "}
                Completion
              </h1>

              <div className="mt-4 sm:mt-5 flex justify-center items-center gap-2">
                <div className="h-px w-14 sm:w-20 bg-gradient-to-r from-transparent to-[#C49A3C]/70" />
                <Star size={7} className="text-[#C49A3C] fill-current" />
                <div className="w-1.5 h-1.5 rotate-45 bg-[#C49A3C]/80" />
                <div className="w-1 h-1 rotate-45 bg-[#C49A3C]/50" />
                <div className="w-1.5 h-1.5 rotate-45 bg-[#C49A3C]/80" />
                <Star size={7} className="text-[#C49A3C] fill-current" />
                <div className="h-px w-14 sm:w-20 bg-gradient-to-l from-transparent to-[#C49A3C]/70" />
              </div>
            </header>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start">
              <div className="flex-1 min-w-0 text-center lg:text-left">
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.45em] sm:tracking-[0.5em] text-[#8B6914] mb-2">
                  This certifies that
                </p>

                <h2
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tight text-[#0E0B24] break-words"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  {certificate.user.name}
                </h2>
                <div className="flex items-center justify-center lg:justify-start gap-1.5 mt-3 mb-5">
                  <div className="h-[3px] w-16 rounded-full bg-[#5038A8]" />
                  <div className="h-[3px] w-8 rounded-full bg-[#C49A3C]" />
                  <div className="h-[3px] w-4 rounded-full bg-[#C49A3C]/40" />
                </div>

                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-[#4A3F6B] max-w-md mx-auto lg:mx-0 mb-7">
                  has successfully completed the course requirements and passed
                  the final assessment for
                  <strong className="font-bold text-[#0E0B24]">
                    &ldquo;{certificate.course.title}&rdquo;
                  </strong>
                </p>

                <div className="grid gap-2.5 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-xl border border-[#E2D4B0]/80 bg-white/55 px-4 py-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#5038A8]/10">
                      <User2 size={13} className="text-[#5038A8]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#8B6914]">
                        Student
                      </p>
                      <p className="text-[13px] font-semibold text-[#0E0B24] truncate">
                        {certificate.user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-[#E2D4B0]/80 bg-white/55 px-4 py-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#5038A8]/10">
                      <CalendarDays size={13} className="text-[#5038A8]" />
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#8B6914]">
                        Issued On
                      </p>
                      <p className="text-[13px] font-semibold text-[#0E0B24]">
                        {issuedDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-[#E2D4B0]/80 bg-white/55 px-4 py-3 sm:col-span-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#5038A8]/10">
                      <Hash size={13} className="text-[#5038A8]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#8B6914]">
                        Certificate Code
                      </p>
                      <p className="text-[13px] md:text-sm font-mono font-bold tracking-[0.2em] text-[#0E0B24]">
                        {certificate.code}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-9 flex flex-wrap items-end justify-center lg:justify-between gap-4">
                  <div className="text-center lg:text-left">
                    <p
                      className="mb-1.5 text-2xl text-[#1a1040]/45 leading-none"
                      style={{
                        fontFamily: "Georgia, serif",
                        fontStyle: "italic",
                      }}
                    >
                      EduNext Academy
                    </p>
                    <div className="h-px w-40 sm:w-52 bg-gradient-to-r from-[#B8860B] to-transparent mx-auto lg:mx-0" />
                    <p className="mt-1.5 text-[11px] font-semibold text-[#2d2244]">
                      Authorized Signature
                    </p>
                    <p className="text-[8px] font-black uppercase tracking-[0.45em] text-[#8B6914] mt-0.5">
                      EduNext Academy
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-[#C49A3C]/70 bg-[#C49A3C]/8 px-4 py-2">
                    <Shield size={11} className="text-[#C49A3C]" />
                    <span className="text-[8px] font-black uppercase tracking-[0.35em] text-[#7B5F2D]">
                      Verified Certificate
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-5 shrink-0 w-full max-w-[280px] sm:max-w-[320px] lg:w-56">
                <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 mt-2">
                  <svg
                    className="absolute inset-0 w-full h-full"
                    style={{ animation: "certSpin 40s linear infinite" }}
                    viewBox="0 0 112 112"
                  >
                    <circle
                      cx="56"
                      cy="56"
                      r="52"
                      stroke="#C49A3C"
                      strokeWidth="1.5"
                      fill="none"
                      strokeDasharray="5 4.5"
                      opacity="0.65"
                    />
                  </svg>
                  <svg
                    className="absolute inset-4 w-[calc(100%-32px)] h-[calc(100%-32px)]"
                    viewBox="0 0 80 80"
                  >
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="#C49A3C"
                      strokeWidth="0.75"
                      fill="none"
                      opacity="0.35"
                    />
                  </svg>
                  <div className="relative flex h-18 w-18 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#5038A8] via-[#3D2886] to-[#0E0B24] shadow-[0_8px_32px_rgba(80,56,168,0.5)]">
                    <Award className="h-8 w-8 sm:h-9 sm:w-9 text-[#E8C566]" />
                  </div>
                </div>

                <div className="relative w-full overflow-hidden rounded-2xl border-[5px] border-white shadow-[0_16px_48px_rgba(14,11,36,0.22)] aspect-[3/4]">
                  <Image
                    src={certificate.course.courseImage}
                    alt={certificate.course.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 224px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E0B24]/70 via-[#0E0B24]/10 to-transparent" />
                  <div className="absolute top-2.5 left-2.5 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.25em] text-[#0E0B24]">
                    Certified
                  </div>
                  <p className="absolute bottom-3 left-3 right-3 text-white/90 text-[11px] font-semibold leading-snug line-clamp-2">
                    {certificate.course.title}
                  </p>
                </div>

                <div className="w-full flex items-center gap-2.5 rounded-xl border border-[#C49A3C]/40 bg-gradient-to-r from-[#FFFAF0] to-[#FFF7E0] px-3.5 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#5038A8]/10">
                    <Award size={17} className="text-[#5038A8]" />
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#8B6914]">
                      Credential
                    </p>
                    <p className="text-sm font-bold text-[#2d2244]">
                      Certified
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <footer className="mt-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-transparent via-[#C49A3C]/35 to-[#C49A3C]/20" />

              <p className="text-center text-[10px] sm:text-[8px] font-black uppercase tracking-[0.15em] sm:tracking-[0.55em] text-[#8B6914]">
                Keep this certificate for your records
              </p>

              <div className="hidden sm:block flex-1 h-px bg-gradient-to-l from-transparent via-[#C49A3C]/35 to-[#C49A3C]/20" />
            </footer>
          </div>

          <div className="h-[7px] bg-[linear-gradient(90deg,_#5C3D0A_0%,_#C49A3C_28%,_#E8C566_50%,_#C49A3C_72%,_#5C3D0A_100%)]" />
        </div>
      </div>

      <style>{`
        @keyframes certSpin { to { transform: rotate(360deg); } }
        @media print {
          @page { margin: 0.5in; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </main>
  );
}
