"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  CreditCard,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { GetVerifyPayment } from "@/core/services/api/Get/GetVerifyPayment";

export default function PaypalCheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const amount = searchParams.get("amount");
  const courseName = searchParams.get("courseName");

  const [isPending, startTransition] = useTransition();

  const handlePay = () => {
    if (!token) return;
    startTransition(async () => {
      const targetUrl = await GetVerifyPayment(token, "test");
      if (targetUrl) {
        router.push(targetUrl);
      }
    });
  };

  const handleCancel = () => {
    if (!token) return;
    startTransition(async () => {
      const targetUrl = await GetVerifyPayment(token);
      if (targetUrl) {
        router.push(targetUrl);
      }
    });
  };

  const formattedAmount = amount
    ? Number(amount).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "0.00";

  if (!token) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#e8f1ff_0%,_#f6f8fc_45%,_#edf2f7_100%)] px-4 flex items-center justify-center">
        <div className="w-full max-w-md rounded-[32px] border border-white/70 bg-white/85 p-8 shadow-[0_24px_90px_rgba(15,23,42,0.10)] backdrop-blur-xl">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-center text-2xl font-semibold tracking-tight text-slate-950">
            Invalid Payment Token
          </h1>
          <p className="mt-3 text-center text-sm leading-6 text-slate-500">
            Please return to the previous step and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#e7f0ff_0%,_#f7f9fd_42%,_#edf2f7_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-4 rounded-[28px] border border-white/70 bg-white/75 px-5 py-4 shadow-[0_16px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#003087] text-white shadow-lg shadow-[#003087]/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-tight text-slate-950">
                  EduNext Checkout
                </p>
                <p className="text-xs text-slate-500">
                  Secure payment experience
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:flex">
              <LockKeyhole className="h-4 w-4" />
              Protected connection
            </div>
          </div>
        </header>

        <main className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <aside className="order-2 lg:order-1 lg:sticky lg:top-6">
            <div className="rounded-[32px] border border-white/70 bg-white/82 px-6 py-3.5 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl">
              <div className="rounded-3xl bg-gradient-to-br from-[#003087] to-[#005ea6] p-5 text-white shadow-[0_18px_50px_rgba(0,48,135,0.28)]">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/15">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <div className="rounded-full bg-white/12 px-3 py-1 text-xs font-medium text-white/90 ring-1 ring-white/15">
                    Secure checkout
                  </div>
                </div>

                <p className="mt-4 text-xs font-medium uppercase tracking-[0.22em] text-white/70">
                  You are buying
                </p>
                <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-tight">
                  {courseName || "Online Course"}
                </h2>

                <div className="mt-4 flex items-end gap-2">
                  <span className="text-5xl font-semibold tracking-tight">
                    ${formattedAmount}
                  </span>
                  <span className="pb-2 text-sm font-medium text-white/75">
                    USD
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50/80 p-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#003087]/10 text-[#003087]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-950">
                      Protected payment flow
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Your order and payment details are handled through a
                      secure checkout experience.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                      Summary
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-950">
                      Final amount due
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-950 ring-1 ring-slate-200">
                    ${formattedAmount} USD
                  </div>
                </div>

                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Course access</span>
                    <span className="font-medium text-slate-950">
                      ${formattedAmount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Checkout</span>
                    <span className="font-medium text-emerald-600">Ready</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCancel}
                disabled={isPending}
                className={` cursor-pointer mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900 ${
                  isPending ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                Cancel and return to EduNext
              </button>
            </div>
          </aside>

          <section className="order-1 lg:order-2 border-1 ">
            <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/85 shadow-[0_24px_90px_rgba(15,23,42,0.10)] backdrop-blur-xl">
              <div className="border-b border-slate-200/70 p-6 sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#003087]">
                      Pay with PayPal
                    </p>
                    <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                      Confirm your purchase
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                      Review your order details, choose the payment method, and
                      continue to complete your payment securely.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-start rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#003087]/10 text-[#003087]">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        Signed in as
                      </p>
                      <p className="text-sm font-semibold text-slate-950">
                        testuser@example.com
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="rounded-[24px] border border-[#003087]/20 bg-[#003087]/5 p-4 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#003087] shadow-sm">
                        <input
                          type="radio"
                          defaultChecked
                          className="h-4 w-4 accent-[#003087]"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-base font-semibold text-slate-950">
                              PayPal Balance
                            </p>
                            <p className="text-sm text-slate-500">
                              Fast, secure and preferred
                            </p>
                          </div>

                          <div className="inline-flex items-center gap-2 self-start rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-slate-950 shadow-sm ring-1 ring-slate-200">
                            <CreditCard className="h-4 w-4 text-slate-500" />$
                            {formattedAmount}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-slate-200 bg-white p-4 opacity-70">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                        <input
                          type="radio"
                          disabled
                          className="h-4 w-4 accent-slate-300"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-base font-semibold text-slate-600">
                              Visa •••• 1234
                            </p>
                            <p className="text-sm text-slate-400">Debit card</p>
                          </div>

                          <div className="inline-flex items-center gap-2 self-start rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-500">
                            Unavailable
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 sm:px-8">
                <button
                  onClick={handlePay}
                  disabled={isPending}
                  className={` cursor-pointer group flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 text-base font-semibold text-white shadow-[0_16px_40px_rgba(0,112,186,0.22)] transition-all duration-200 ${
                    isPending
                      ? "cursor-not-allowed bg-[#0070BA]/70"
                      : "bg-[#0070BA] hover:-translate-y-0.5 hover:bg-[#005ea6]"
                  }`}
                >
                  {isPending ? (
                    <svg
                      className="h-6 w-6 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    <>
                      <span>Complete Purchase</span>
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <LockKeyhole className="h-4 w-4" />
                  <span>Secure checkout powered by EduNext</span>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
