"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AdminTransaction } from "../../data/mock";
import { AllPaymentModal } from "./modals/allPaymentModal";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  summary: { label: string; value: string; delta: string }[];
  series: number[];
  transactions: AdminTransaction[];
};

export function SalesReports({ summary, series, transactions }: Props) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const max = Math.max(...series);
  const min = Math.min(...series);
  const points = series
    .map((v, i) => {
      const x = (i / (series.length - 1)) * 100;
      const y = 100 - ((v - min) / (max - min || 1)) * 70 - 10;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight dark:text-[white]">
            Sales & Reports
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-[#ccc]">
            Revenue trends, transactions and performance.
          </p>
        </div>

        <Tabs defaultValue="7d">
          <TabsList className="rounded-2xl bg-slate-100 dark:!bg-[#454545]">
            <TabsTrigger value="7d" className="rounded-xl !cursor-pointer">
              7 Days
            </TabsTrigger>
            <TabsTrigger value="30d" className="rounded-xl !cursor-pointer">
              30 Days
            </TabsTrigger>
            <TabsTrigger value="90d" className="rounded-xl !cursor-pointer">
              90 Days
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <Card
            key={item.label}
            className="rounded-3xl border-white/70 bg-white/80 shadow-sm backdrop-blur dark:bg-[#333]"
          >
            <CardContent className="p-6">
              <div className="text-sm text-slate-500 dark:text-[#ccc]">
                {item.label}
              </div>
              <div className="mt-2 text-3xl font-semibold tracking-tight">
                {item.value}
              </div>
              <div className="mt-2 text-sm text-emerald-600">{item.delta}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <Card className="xl:col-span-8 rounded-3xl border-white/70 bg-white/80 shadow-sm backdrop-blur py-5 dark:bg-[#333]">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-end justify-between">
              <div>
                <div className="text-3xl font-semibold tracking-tight">
                  $25,300
                </div>
                <div className="text-sm text-slate-500 dark:text-[#ccc]">
                  Last 30 days revenue
                </div>
              </div>
              <div className="flex gap-2">
                <Badge className="rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  +15.7%
                </Badge>
                <Badge className="rounded-full bg-violet-100 text-violet-700 hover:bg-violet-100">
                  +10.2%
                </Badge>
              </div>
            </div>

            <div className="h-64 rounded-3xl border-2 border-[#ccc] dark:border-slate-100 bg-[white] p-4 dark:!bg-[#454545]">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <defs>
                  <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
                    <stop
                      offset="100%"
                      stopColor="#8b5cf6"
                      stopOpacity="0.02"
                    />
                  </linearGradient>
                </defs>
                <polyline
                  fill="url(#fill)"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                  points={`${points} 100,100 0,100`}
                />
                <polyline
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  points={points}
                />
              </svg>
            </div>
          </CardContent>
        </Card>
        <Card className="xl:col-span-4 rounded-3xl border-white/70 bg-white/80 shadow-sm backdrop-blur py-5 2xl:py-0 dark:bg-[#333]">
          <CardHeader className="flex items-center justify-center py-4 2xl:py-8">
            <CardTitle>Latest Transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {transactions.map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0"
              >
                <div>
                  <div className="font-medium dark:text-[white]">
                    {item.amount}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-[#ccc]">
                    {item.title}
                  </div>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <div className="dark:text-[#ccc]">{item.time}</div>
                  <div className="dark:text-[#ccc]">{item.meta}</div>
                </div>
              </div>
            ))}
          </CardContent>
          <Button
            onClick={() => setIsPaymentModalOpen(true)}
            variant="outline"
            className="w-[90%] flex items-center justify-center mt-4 mb-3 mx-auto cursor-pointer rounded-2xl border-violet-600 text-violet-600 hover:text-violet-600 hover:bg-violet-50 dark:border-violet-500 dark:text-violet-400 dark:hover:bg-violet-500/10"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            View All Payments
          </Button>
        </Card>
      </section>
      <AllPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </motion.div>
  );
}
