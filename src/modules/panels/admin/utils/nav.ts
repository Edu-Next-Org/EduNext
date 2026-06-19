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
  { href: "/panels/admin", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/panels/admin/manage-courses",
    label: "Course Management",
    icon: BookOpen,
  },
  {
    href: "/panels/admin/exam-management",
    label: "Exam Management",
    icon: BookCheck,
  },
  {
    href: "/panels/admin/user-management",
    label: "User Management",
    icon: Users,
  },
  {
    href: "/panels/admin/comments-management",
    label: "Commnet Management",
    icon: MessageCircle,
  },
  {
    href: "/panels/admin/sales-reports",
    label: "Sales & Reports",
    icon: ChartColumn,
  },
  { href: "/panels/admin/settings", label: "Settings", icon: Settings },
] as const;

export const adminTitleMap: Record<string, string> = {
  "/panels/admin": "Admin Dashboard",
  "/panels/admin/manage-courses": "Course Management",
  "/panels/admin/exam-management": "Exam Management",
  "/panels/admin/user-management": "User Management",
  "/panels/admin/comments-management": "Comment Management",
  "/panels/admin/sales-reports": "Sales & Reports",
  "/panels/admin/settings": "Settings",
};

export const adminBadgeMap: Record<string, string> = {
  "/panels/admin": "Overview",
  "/panels/admin/Course Management": "Courses",
  "/panels/admin/exam-management": "Exam",
  "/panels/admin/user-management": "Users",
  "/panels/admin/comments-management": "Comments",
  "/panels/admin/sales-reports": "Revenue",
  "/panels/admin/settings": "Control",
};

export const logoutNavItem = {
  href: "/login",
  label: "Logout",
  icon: LogOut,
};
