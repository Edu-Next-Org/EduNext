import {
  LayoutDashboard,
  BookOpen,
  Users,
  ChartColumn,
  Settings,
  LogOut,
  MessageCircle,
  BookCheck,
} from "lucide-react";

export const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/manage-courses", label: "Course Management", icon: BookOpen },
  { href: "/admin/exam-management", label: "Exam Management", icon: BookCheck },
  { href: "/admin/user-management", label: "User Management", icon: Users },
  { href: "/admin/comments-management", label: "Commnet Management", icon: MessageCircle },
  { href: "/admin/sales-reports", label: "Sales & Reports", icon: ChartColumn },
  { href: "/admin/settings", label: "Settings", icon: Settings },
] as const;

export const adminTitleMap: Record<string, string> = {
  "/admin": "Admin Dashboard",
  "/admin/manage-courses": "Course Management",
  "/admin/exam-management": "Exam Management",
  "/admin/user-management": "User Management",
  "/admin/comments-management": "Comment Management",
  "/admin/sales-reports": "Sales & Reports",
  "/admin/settings": "Settings",
};

export const adminBadgeMap: Record<string, string> = {
  "/admin": "Overview",
  "/admin/Course Management": "Courses",
  "/admin/exam-management": "Exam",
  "/admin/user-management": "Users",
  "/admin/comments-management": "Comments",
  "/admin/sales-reports": "Revenue",
  "/admin/settings": "Control",
};

export const logoutNavItem = {
  href: "/login",
  label: "Logout",
  icon: LogOut,
};