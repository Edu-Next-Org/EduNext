export type AdminComment = {
  id: number;
  courseTitle: string;
  userName: string;
  userImage: string;
  content: string;
  isConfirmed: boolean;
  date: string;
};

export type AdminSignup = {
  name: string;
  sub: string;
  time: string;
};

export type AdminTransaction = {
  title: string;
  amount: string;
  time: string;
  meta: string;
};

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  roles: ("Student" | "Instructor" | "Admin")[];
  status: "Active" | "Pending" | "Blocked";
  lastActive: string;
};

export const recentSignups: AdminSignup[] = [
  { name: "Sarah Kiwon", sub: "Sarah Wrion", time: "2 hours ago" },
  { name: "David Martinez", sub: "David Martinez", time: "1 day ago" },
  { name: "Jessica Wong", sub: "Jessica Wong", time: "1 day ago" },
  { name: "James Carter", sub: "Jessica Fundamentals", time: "2 days ago" },
];

export const latestTransactions: AdminTransaction[] = [
  {
    title: "Website Design Essentials",
    amount: "$99.00",
    time: "2 hours ago",
    meta: "Draft Kwon",
  },
  {
    title: "Digital Marketing Mastery",
    amount: "$99.00",
    time: "1 day ago",
    meta: "Sarah Lons",
  },
  {
    title: "React Fundamentals",
    amount: "$89.00",
    time: "1 day ago",
    meta: "Graphic Cons",
  },
  {
    title: "Node Backend Pro",
    amount: "$119.00",
    time: "2 days ago",
    meta: "Admin",
  },
];

export const adminUsers: AdminUser[] = [
  {
    id: 1,
    name: "Michael Robertson",
    email: "michael@edunext.com",
    roles: ["Admin"],
    status: "Active",
    lastActive: "just now",
  },
  {
    id: 2,
    name: "Sarah Kiwon",
    email: "sarah@example.com",
    roles: ["Student"],
    status: "Active",
    lastActive: "2 hours ago",
  },
  {
    id: 3,
    name: "Jack Martin",
    email: "jack@example.com",
    roles: ["Instructor"],
    status: "Pending",
    lastActive: "1 day ago",
  },
  {
    id: 4,
    name: "Emily Carter",
    email: "emily@example.com",
    roles: ["Instructor"],
    status: "Blocked",
    lastActive: "5 days ago",
  },
  {
    id: 5,
    name: "David Martinez",
    email: "david@example.com",
    roles: ["Student"],
    status: "Active",
    lastActive: "2 days ago",
  },
];

export const commentsData: AdminComment[] = [
  {
    id: 1,
    courseTitle: "React Masterclass",
    userName: "Sarah Kiwon",
    userImage: "/images/HTML5Course.png",
    content: "This course was amazing and helped me understand React deeply ",
    isConfirmed: true,
    date: "2026-06-01",
  },
  {
    id: 2,
    courseTitle: "Node Backend Pro",
    userName: "David Martinez",
    userImage: "/images/HTML5Course.png",
    content: "Please add more examples about authentication and JWT.",
    isConfirmed: false,
    date: "2026-05-30",
  },
  {
    id: 3,
    courseTitle: "UI Design Essentials",
    userName: "Emily Carter",
    userImage: "/images/HTML5Course.png",
    content: "The design section was very practical and easy to follow.",
    isConfirmed: true,
    date: "2026-05-28",
  },
  {
    id: 4,
    courseTitle: "Digital Growth Bootcamp",
    userName: "James Carter",
    userImage: "/images/HTML5Course.png",
    content: "Great explanations. Looking forward to advanced lessons.",
    isConfirmed: false,
    date: "2026-05-26",
  },
];

export const salesSummary = [
  { label: "Revenue", value: "$25,300", delta: "+15.7%" },
  { label: "Transactions", value: "1,248", delta: "+10.2%" },
  { label: "Refunds", value: "12", delta: "-2.1%" },
  { label: "Avg. Order", value: "$89.00", delta: "+4.3%" },
];

export const salesSeries = [
  34, 35, 36, 37, 39, 38, 40, 42, 43, 45, 46, 47, 49, 50, 51, 52,
];

export async function getAdminDashboardData() {
  return {
    signups: recentSignups,
    transactions: latestTransactions,
  };
}

export async function getUsersData() {
  return { users: adminUsers };
}

export async function getSalesData() {
  return {
    summary: salesSummary,
    series: salesSeries,
    transactions: latestTransactions,
  };
}
export async function getCommentsManagementData() {
  return {
    comments: commentsData,
  };
}
