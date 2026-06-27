"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  CheckCircle2,
  XCircle,
  Calendar,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PaginationComp } from "@/components/PaginationComp";
import type { AllPaymentsPageData } from "@/core/services/api/get/getAllPayment";
import { useState, useEffect, useTransition } from "react";
import { getAllPayments } from "@/core/services/api/get/getAllPayment";
import Lottie from "lottie-react";
import loading from "@/assets/Lottie/Loader.json";

interface AllPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  allPaymentsData: AllPaymentsPageData;
}

export function AllPaymentModal({
  isOpen,
  onClose,
  allPaymentsData,
}: AllPaymentModalProps) {
  const [data, setData] = useState(allPaymentsData);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setData(allPaymentsData);
  }, [allPaymentsData]);

  const handlePageChange = (newPage: number) => {
    startTransition(async () => {
      try {
        const newData = await getAllPayments({ page: newPage, limit: 10 });
        setData(newData);
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      }
    });
  };

  const { payments, meta } = data;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[95vw] h-auto max-h-[90vh] flex flex-col border-white/20 bg-white/90 p-0 shadow-2xl backdrop-blur-xl dark:bg-[#333]/95 dark:border-[#444] rounded-3xl
                   sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl overflow-hidden"
      >
        <DialogHeader className="shrink-0 p-6 pb-4 border-b border-slate-200/60 dark:border-[#444]/60 text-left">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                <div className="p-2 bg-violet-100 dark:bg-violet-500/20 rounded-xl">
                  <DollarSign className="h-6 w-6 text-violet-600 dark:text-violet-400 shrink-0" />
                </div>
                All Payments History
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 dark:text-[#ccc] mt-1.5 ml-1">
                View all user transactions, payment statuses, and course
                enrollments.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="relative flex flex-1 flex-col overflow-hidden">
          {isPending && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-md transition-all duration-300 dark:bg-[#2a2a2a]/60">
              <div className=" drop-shadow-xl">
                <Lottie
                  style={{ width: 200, height: 200 }}
                  animationData={loading}
                  loop={true}
                />
              </div>
              <p className="ml-2 animate-pulse text-sm font-semibold tracking-widest text-violet-600 dark:text-violet-400">
                LOADING...
              </p>
            </div>
          )}

          <div className="flex-1 overflow-y-auto bg-slate-50/30 p-4 scrollbar-thin dark:bg-transparent sm:p-6">
            <div className="flex flex-col gap-4 md:hidden">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="rounded-3xl border border-slate-200/80 bg-white shadow-sm p-4 dark:border-[#444] dark:bg-[#3a3a3a] transition-all"
                >
                  <div className="flex items-center gap-3 border-b border-slate-100 dark:border-[#444]/50 pb-3 mb-3">
                    <Image
                      src={payment.userImage}
                      alt={payment.userName}
                      width={40}
                      height={40}
                      className="w-10 h-10 dark:bg-[#ccc] rounded-full shrink-0 object-cover border border-slate-100 dark:border-[#555]"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 dark:text-white truncate text-sm">
                        {payment.courseName}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-[#ccc] truncate mt-0.5">
                        {payment.userName}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                    <div>
                      <span className="block text-[11px] uppercase tracking-wider text-slate-400 dark:text-[#898989] mb-1.5">
                        Amount
                      </span>
                      <div className="font-semibold text-slate-800 dark:text-white flex items-center gap-1.5">
                        <CreditCard className="h-3.5 w-3.5 text-violet-500" />
                        {payment.price}
                      </div>
                    </div>

                    <div>
                      <span className="block text-[11px] uppercase tracking-wider text-slate-400 dark:text-[#898989] mb-1.5">
                        Status
                      </span>
                      <Badge
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[11px] font-medium border-none",
                          payment.status === "Success"
                            ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-500/20 dark:text-green-400 dark:hover:bg-green-500/30"
                            : "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30",
                        )}
                      >
                        {payment.status === "Success" ? (
                          <CheckCircle2 className="mr-1 h-3 w-3 inline" />
                        ) : (
                          <XCircle className="mr-1 h-3 w-3 inline" />
                        )}
                        {payment.status}
                      </Badge>
                    </div>

                    <div className="col-span-2">
                      <span className="block text-[11px] uppercase tracking-wider text-slate-400 dark:text-[#898989] mb-1.5">
                        Date
                      </span>
                      <div className="text-slate-600 dark:text-[#ccc] text-xs flex items-center gap-1.5 bg-slate-100 dark:bg-[#2a2a2a] w-fit px-2.5 py-1 rounded-lg">
                        <Calendar className="h-3.5 w-3.5" />
                        {payment.date}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block w-full">
              <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#898989] border-b border-slate-200/80 dark:border-[#444]/80 mb-2">
                <div className="col-span-4">User Image</div>
                <div className="col-span-2">User Name</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2 text-right">Status</div>
              </div>

              <div className="space-y-2.5">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="grid grid-cols-12 gap-4 items-center px-6 py-3.5 2xl:py-5 rounded-2xl bg-white/60 dark:bg-[#454545]/20 hover:bg-white dark:hover:bg-[#454545]/60 border border-transparent hover:border-slate-200 dark:hover:border-[#555] transition-all shadow-sm hover:shadow-md cursor-default"
                  >
                    <div className="col-span-4 flex items-center gap-3 pr-2">
                      <Image
                        src={payment.userImage}
                        alt={payment.courseName}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full shrink-0 object-cover shadow-sm border border-slate-100 dark:border-[#555] dark:bg-[#ccc]"
                      />
                      <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {payment.courseName}
                      </span>
                    </div>

                    <div className="col-span-2 text-sm text-slate-600 dark:text-[#ccc] truncate pr-2">
                      {payment.userName}
                    </div>

                    <div className="col-span-2 font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <CreditCard className="h-4 w-4 text-violet-500" />
                      {payment.price}
                    </div>

                    <div className="col-span-2 text-sm text-slate-500 dark:text-[#bbb] flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 opacity-70" />
                      {payment.date}
                    </div>

                    <div className="col-span-2 flex justify-end">
                      <Badge
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-medium border-none shadow-sm",
                          payment.status === "Success"
                            ? "!bg-green-400 hover:!bg-green-500  hover:bg-green-200 dark:!bg-green-500/20 dark:text-green-400 dark:hover:!bg-green-500/30"
                            : "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30",
                        )}
                      >
                        {payment.status === "Success" ? (
                          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 inline" />
                        ) : (
                          <XCircle className="mr-1.5 h-3.5 w-3.5 inline" />
                        )}
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {meta && meta.pages > 1 && (
          <PaginationComp
            currentPage={meta.page}
            totalPages={meta.pages}
            onPageChange={handlePageChange}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
