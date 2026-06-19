"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllPaymentModal } from "./modals/allPaymentModal";
import { useState, useCallback, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { AllPaymentsPageData } from "@/core/services/api/Get/GetAllPayment";
import type { AdminTransaction } from "@/core/services/api/Get/GetLatestTransaction";
import type { SalesOverviewData } from "@/core/services/api/Get/GetSalesOverview";
import Lottie from "lottie-react";
import loading from "@/assets/Lottie/Loader.json";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  salesOverviewData: SalesOverviewData;
  latestTransactions: AdminTransaction[];
  allPaymentsData: AllPaymentsPageData;
};

export function SalesReports({
  salesOverviewData,
  latestTransactions,
  allPaymentsData,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  const handleOpenPaymentModal = () => {
    setIsPaymentModalOpen(true);
  };

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const handleTabChange = (value: string) => {
    startTransition(() => {
      router.push(`${pathname}?${createQueryString("period", value)}`, {
        scroll: false,
      });
    });
  };

  const chartRevenue = salesOverviewData?.chart?.revenue || [];
  const chartLabels = salesOverviewData?.chart?.labels || [];

  const rechartsData = chartRevenue.map((val, idx) => ({
    name: chartLabels[idx] || `Day ${idx + 1}`,
    revenue: val,
  }));

  const currentPeriod = searchParams.get("period") || "7d";

  const summaryCards = [
    {
      label: "Total Revenue",
      value: `$${salesOverviewData?.cards?.revenue?.value?.toLocaleString() || "0"}`,
      changePercent: salesOverviewData?.cards?.revenue?.changePercent || 0,
    },
    {
      label: "Total Transactions",
      value:
        salesOverviewData?.cards?.transactions?.value?.toLocaleString() || "0",
      changePercent: salesOverviewData?.cards?.transactions?.changePercent || 0,
    },
    {
      label: "Failed Payments",
      value:
        salesOverviewData?.cards?.failedPayments?.value?.toLocaleString() ||
        "0",
      changePercent:
        salesOverviewData?.cards?.failedPayments?.changePercent || 0,
    },
    {
      label: "Avg Transaction Value",
      value: `$${salesOverviewData?.cards?.averageTransactionValue?.value?.toLocaleString() || "0"}`,
      changePercent:
        salesOverviewData?.cards?.averageTransactionValue?.changePercent || 0,
    },
  ];

  return (
    <>
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

          <Tabs value={currentPeriod} onValueChange={handleTabChange}>
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
          {summaryCards.map((item) => (
            <Card
              key={item.label}
              className="rounded-3xl border-white/70 bg-white/80 shadow-sm backdrop-blur dark:bg-[#333]"
            >
              <CardContent className="p-6">
                <div className="text-sm text-slate-500 dark:text-[#ccc]">
                  {item.label}
                </div>
                <div className="mt-2 text-3xl font-semibold tracking-tight dark:text-white">
                  {item.value}
                </div>
                <div
                  className={cn(
                    "mt-2 text-sm",
                    item.changePercent >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400",
                  )}
                >
                  {item.changePercent >= 0 ? "+" : ""}
                  {item.changePercent}%
                </div>
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
              <div className="mb-4 flex flex-col items-start justify-between md:flex-row md:items-end">
                <div>
                  <div className="text-3xl font-semibold tracking-tight dark:text-white">
                    $
                    {salesOverviewData?.cards?.revenue?.value?.toLocaleString() ||
                      "0"}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-[#ccc] mt-1">
                    Last {salesOverviewData?.period || 7} days revenue
                  </div>
                </div>
                <div className="flex gap-2 mt-3 md:mt-0">
                  {salesOverviewData?.cards?.revenue && (
                    <Badge
                      className={cn(
                        "rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors",
                        salesOverviewData.cards.revenue.changePercent >= 0
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 hover:bg-emerald-100"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 hover:bg-rose-100",
                      )}
                    >
                      {salesOverviewData.cards.revenue.changePercent >= 0
                        ? "+"
                        : ""}
                      {salesOverviewData.cards.revenue.changePercent}% Revenue
                    </Badge>
                  )}

                  {salesOverviewData?.cards?.transactions && (
                    <Badge
                      className={cn(
                        "rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors",
                        salesOverviewData.cards.transactions.changePercent >= 0
                          ? "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400 hover:bg-violet-100"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 hover:bg-rose-100",
                      )}
                    >
                      {salesOverviewData.cards.transactions.changePercent >= 0
                        ? "+"
                        : ""}
                      {salesOverviewData.cards.transactions.changePercent}%
                      Transactions
                    </Badge>
                  )}
                </div>
              </div>

              <div className="h-[300px] w-full mt-4 rounded-3xl border border-white/40 bg-white/50 p-4 shadow-inner dark:border-white/10 dark:bg-black/20">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={rechartsData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8b5cf6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="currentColor"
                      className="text-slate-200 dark:text-slate-700"
                    />

                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                      className="text-slate-400 dark:text-slate-500"
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                      className="text-slate-400 dark:text-slate-500"
                    />

                    <Tooltip
                      cursor={{
                        stroke: "#8b5cf6",
                        strokeWidth: 1,
                        strokeDasharray: "4 4",
                      }}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(8px)",
                        borderRadius: "16px",
                        border: "1px solid rgba(255,255,255,0.3)",
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                        color: "#333",
                      }}
                      itemStyle={{ color: "#8b5cf6", fontWeight: "bold" }}
                    />

                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      activeDot={{
                        r: 6,
                        fill: "#8b5cf6",
                        stroke: "#fff",
                        strokeWidth: 2,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="xl:col-span-4 rounded-3xl border-white/70 bg-white/80 shadow-sm backdrop-blur py-5 2xl:py-0 dark:bg-[#333]">
            <CardHeader className="flex items-center justify-center py-4 2xl:py-8">
              <CardTitle>Latest Transactions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {latestTransactions.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-[#eee] dark:border-[#444] pb-3 last:border-none"
                >
                  <div>
                    <div className="font-medium dark:text-[white]">
                      {item.amount}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-[#898989] max-w-[150px] truncate">
                      {item.title}
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    <div className="dark:text-[#898989]">{item.time}</div>
                    <div className="dark:text-[#898989] truncate max-w-[100px]">
                      {item.meta}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <Button
              onClick={handleOpenPaymentModal}
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
          onClose={handleClosePaymentModal}
          allPaymentsData={allPaymentsData}
        />
      </motion.div>
      {isPending && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/40 backdrop-blur-md dark:bg-[#111]/60 transition-all">
          <div className="w-50 h-50">
            <Lottie animationData={loading} loop={true} />
          </div>
          <p className="ml-3 animate-pulse text-sm font-semibold tracking-widest text-violet-600 dark:text-violet-400">
            LOADING ...
          </p>
        </div>
      )}
    </>
  );
}
