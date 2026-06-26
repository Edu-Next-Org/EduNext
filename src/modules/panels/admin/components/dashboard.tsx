"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  DollarSign,
  GraduationCap,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AdminReportData } from "@/core/services/api/Get/GetAdminReports";
import type { CoursesPageData } from "@/core/services/api/Get/GetAllCoursesAdmin";
import type { AdminCategory } from "@/core/services/api/Get/GetAllCategoryAdmin";
import type { AdminLevel } from "@/core/services/api/Get/GetAllLevelsAdmin";
import type { AdminTransaction } from "@/core/services/api/Get/GetLatestTransaction";
import type { AllPaymentsPageData } from "@/core/services/api/Get/GetAllPayment";
import { UsersPageData } from "@/core/services/api/Get/GetAllUser";
import { SalesOverviewData } from "@/core/services/api/Get/GetSalesOverview";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PaginationComp } from "@/components/PaginationComp";
import { AllPaymentModal } from "./sales-reports/modals/allPaymentModal";
import { useState, useCallback, useRef, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Lottie from "lottie-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import loading from "@/assets/Lottie/Loader.json";

import { DashboardDesktop } from "./dashboard-desktop";
import { DashboardMobile } from "./dashboard-mobile";

type Props = {
  reports: AdminReportData;
  coursesData: CoursesPageData;
  categories: AdminCategory[];
  levels: AdminLevel[];
  latestTransactions: AdminTransaction[];
  allPaymentsData: AllPaymentsPageData;
  recentUsersData: UsersPageData;
  salesOverviewData: SalesOverviewData;
};

const formatDelta = (diff: number, prefix: string = "") => {
  const sign = diff >= 0 ? "+" : "";
  return `${sign}${prefix}${diff.toLocaleString()} this month`;
};

function StatIcon({ type }: { type: "students" | "courses" | "sales" }) {
  const base = "h-5 w-5";
  if (type === "students") return <GraduationCap className={base} />;
  if (type === "courses") return <BookOpen className={base} />;
  return <ShieldCheck className={base} />;
}

export function AdminDashboard({
  reports,
  coursesData,
  categories,
  levels,
  latestTransactions,
  allPaymentsData,
  recentUsersData,
  salesOverviewData,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const recentSignups = recentUsersData?.users
    ? recentUsersData.users.slice(0, 4)
    : [];

  const tableTopRef = useRef<HTMLDivElement>(null);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value && value !== "all" && value !== "all-levels") {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      if (name !== "page") {
        params.set("page", "1");
      }

      return params.toString();
    },
    [searchParams],
  );

  const handleSearch = (term: string) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      startTransition(() => {
        router.push(`${pathname}?${createQueryString("search", term)}`, {
          scroll: false,
        });
      });
    }, 500);
  };

  const handleFilterChange = (key: string, value: string) => {
    startTransition(() => {
      router.push(`${pathname}?${createQueryString(key, value)}`, {
        scroll: false,
      });
    });
  };

  const handlePageChange = (page: number) => {
    tableTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    startTransition(() => {
      router.push(`${pathname}?${createQueryString("page", page.toString())}`, {
        scroll: false,
      });
    });
  };

  const statsList = [
    {
      title: "Total Students",
      value: reports.totalStudents.total.toLocaleString(),
      deltaText: formatDelta(reports.totalStudents.growth.difference),
      percentage: reports.totalStudents.growth.percentage,
      icon: "students" as const,
      accent: "violet" as const,
    },
    {
      title: "Total Courses",
      value: reports.totalCourses.total.toLocaleString(),
      deltaText: formatDelta(reports.totalCourses.growth.difference),
      percentage: reports.totalCourses.growth.percentage,
      icon: "courses" as const,
      accent: "indigo" as const,
    },
    {
      title: "Total Sales",
      value: `$${reports.totalSales.total.toLocaleString()}`,
      deltaText: formatDelta(reports.totalSales.growth.difference, "$"),
      percentage: reports.totalSales.growth.percentage,
      icon: "sales" as const,
      accent: "emerald" as const,
    },
  ];

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  const handleOpenPaymentModal = () => {
    setIsPaymentModalOpen(true);
  };

  const chartRevenue = salesOverviewData?.chart?.revenue || [];
  const chartLabels = salesOverviewData?.chart?.labels || [];

  const rechartsData = chartRevenue.map((val, idx) => ({
    name: chartLabels[idx] || `Day ${idx + 1}`,
    revenue: val,
  }));

  const revMetric = salesOverviewData?.cards?.revenue;
  const transMetric = salesOverviewData?.cards?.transactions;

  return (
    <>
      <div className="space-y-6">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {statsList.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.12 }}
            >
              <Card className="rounded-3xl border-white/70 bg-white/80 shadow-sm backdrop-blur dark:bg-[#333]">
                <CardContent className="flex items-start justify-between p-6">
                  <div>
                    <div className="text-sm text-slate-500 dark:text-[#ccc]">
                      {item.title}
                    </div>
                    <div className="mt-2 text-3xl font-semibold tracking-tight">
                      {item.value}
                    </div>

                    <div className="mt-2 flex flex-col gap-2 text-sm font-medium">
                      <span
                        className={cn(
                          "flex items-center",
                          item.percentage >= 0
                            ? "text-emerald-600"
                            : "text-red-500",
                        )}
                      >
                        {item.percentage >= 0 ? "+" : "-"}
                        {Math.abs(item.percentage)}%
                      </span>
                      <span className="text-slate-500 font-normal dark:text-[#ccc]">
                        {item.deltaText}
                      </span>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-2xl",
                      item.accent === "violet" &&
                        "bg-violet-100 text-violet-700",
                      item.accent === "indigo" &&
                        "bg-indigo-100 text-indigo-700",
                      item.accent === "emerald" &&
                        "bg-emerald-100 text-emerald-700",
                    )}
                  >
                    <StatIcon type={item.icon} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        <section className="2xl:grid gap-6 2xl:grid-cols-12">
          <Card
            ref={tableTopRef}
            className="xl:col-span-8 mb-5 2xl:mb-0 rounded-3xl border-white/70 bg-white/80 shadow-sm backdrop-blur dark:bg-[#333]"
          >
            <CardHeader className="flex flex-col gap-4 py-7 lg:flex-row lg:items-center lg:justify-between">
              <CardTitle className="text-xl text-center md:text-start w-full">
                Course View
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <div className="px-6 pb-4">
                <div className="mt-5 flex flex-col gap-4 md:gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="relative w-full lg:w-[40%] mb-2 lg:mb-0">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      className="rounded-2xl py-5 pl-10"
                      placeholder="Search courses..."
                      defaultValue={
                        searchParams.get("search")?.toString() || ""
                      }
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-row items-center justify-between lg:justify-start gap-1 sm:gap-9 lg:gap-4 mb-2 sm:mb-5 lg:mb-0">
                    <div className="w-full lg:w-full">
                      <Select
                        defaultValue={
                          searchParams.get("categories")?.toString() || "all"
                        }
                        onValueChange={(val) =>
                          handleFilterChange("categories", val)
                        }
                      >
                        <SelectTrigger className="w-full rounded-2xl py-5">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-full lg:w-full">
                      <Select
                        defaultValue={
                          searchParams.get("courseLevel")?.toString() ||
                          "all-levels"
                        }
                        onValueChange={(val) =>
                          handleFilterChange("courseLevel", val)
                        }
                      >
                        <SelectTrigger className="w-full rounded-2xl py-5">
                          <SelectValue placeholder="Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all-levels">All Levels</SelectItem>
                          {levels.map((lvl) => (
                            <SelectItem key={lvl.id} value={lvl.id}>
                              {lvl.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <DashboardDesktop coursesData={coursesData} />
              <DashboardMobile coursesData={coursesData} />

              {coursesData.meta.pages > 1 && (
                <PaginationComp
                  currentPage={coursesData.meta.page}
                  totalPages={coursesData.meta.pages}
                  onPageChange={handlePageChange}
                />
              )}
            </CardContent>
          </Card>

          <div className="xl:col-span-4 space-y-6">
            <Card className="rounded-3xl border-white/70 bg-white/80 shadow-sm backdrop-blur dark:bg-[#333] py-5">
              <CardHeader className="flex-row items-center justify-center">
                <CardTitle className="text-xl text-center mb-3">
                  Recent Signups
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentSignups.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between border-b border-[#eee] dark:border-[#444] pb-3 last:border-none last:pb-0"
                  >
                    <div className="space-y-0.5">
                      <div className="font-medium dark:text-[white]">
                        {user.name || "Unknown User"}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-[#898989]">
                        {user.email}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <div className="text-xs text-slate-500 dark:text-[#898989]">
                        {user.createdAt}
                      </div>
                      <Badge
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition-all",
                          user.gender?.toLowerCase() === "male" &&
                            "!border-violet-600 !bg-violet-50 !text-violet-600 dark:!border-violet-500 dark:!bg-violet-500/10 dark:!text-violet-400",
                          user.gender?.toLowerCase() === "female" &&
                            "!border-pink-600 !bg-pink-50 !text-pink-600 dark:!border-pink-500 dark:!bg-pink-500/10 dark:!text-pink-400",
                          (!user.gender ||
                            !["male", "female"].includes(
                              user.gender.toLowerCase(),
                            )) &&
                            "!border-indigo-700 !bg-indigo-50 !text-indigo-700 dark:!border-indigo-300 dark:!bg-indigo-500/20 dark:!text-indigo-300",
                        )}
                      >
                        {user.gender?.toLowerCase() === "male"
                          ? "Male"
                          : user.gender?.toLowerCase() === "female"
                            ? "Female"
                            : "Other"}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Link href="/panels/admin/user-management">
                  <Button
                    variant="outline"
                    className="w-[97%] flex items-center py-1 justify-center mt-4 mx-auto cursor-pointer rounded-2xl border-violet-600 text-violet-600 hover:text-violet-600 hover:bg-violet-50 dark:border-violet-500 dark:text-violet-400 dark:hover:bg-violet-500/10"
                  >
                    <Users className="mr-1 h-4 w-4" />
                    View All User
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="xl:col-span-8 rounded-3xl border-white/70 bg-white/80 shadow-sm backdrop-blur py-5 dark:bg-[#333]">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 mt-2 flex flex-col items-start justify-between">
                  <div>
                    <div className="text-3xl font-semibold tracking-tight dark:text-white">
                      ${revMetric?.value?.toLocaleString() || "0"}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-[#ccc] mt-2">
                      Last {salesOverviewData?.period || 7} days revenue
                    </div>
                  </div>
                  <div className="flex gap-2 mt-5">
                    {revMetric && (
                      <Badge
                        className={cn(
                          "rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors",
                          revMetric.changePercent >= 0
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 hover:bg-emerald-100"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 hover:bg-rose-100",
                        )}
                      >
                        {revMetric.changePercent >= 0 ? "+" : ""}
                        {revMetric.changePercent}% Revenue
                      </Badge>
                    )}

                    {transMetric && (
                      <Badge
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
                          transMetric.changePercent >= 0
                            ? "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400 hover:bg-violet-100"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 hover:bg-rose-100",
                        )}
                      >
                        {transMetric.changePercent >= 0 ? "+" : ""}
                        {transMetric.changePercent}% Transactions
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
                          id="colorDashboardRevenue"
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
                        fill="url(#colorDashboardRevenue)"
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

            <Card className="rounded-3xl border-white/70 bg-white/80 shadow-sm backdrop-blur dark:bg-[#333] py-5">
              <CardHeader className="flex items-center justify-center">
                <CardTitle className="text-xl dark:text-[white] pb-5">
                  Latest Transactions
                </CardTitle>
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
              <div className="flex items-center justify-center">
                <Button
                  onClick={handleOpenPaymentModal}
                  variant="outline"
                  className="w-[90%] flex items-center justify-center mt-4 mx-auto cursor-pointer rounded-2xl border-violet-600 text-violet-600 hover:text-violet-600 hover:bg-violet-50 dark:border-violet-500 dark:text-violet-400 dark:hover:bg-violet-500/10"
                >
                  <DollarSign className="mr-1 h-4 w-4" />
                  View All Payments
                </Button>
              </div>
            </Card>
          </div>
        </section>
        <AllPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={handleClosePaymentModal}
          allPaymentsData={allPaymentsData}
        />
      </div>
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
