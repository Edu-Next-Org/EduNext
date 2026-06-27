"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Settings,
  BookOpen,
  Heart,
  CreditCard,
  LogOut,
  Shield,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { IUser } from "./Navbar";
import { useState } from "react";
import { LogoutDialog } from "@/components/LogOutDialog";
import { useRouter } from "next/navigation";
import { logOut } from "../services";

interface UserMenuProps {
  user: IUser;
}

export function UserMenu({ user }: UserMenuProps) {
  const [openLogOutModal, setOpenLogOutModal] = useState<boolean>(false);
  const onChangeOpen = (open: boolean) => {
    setOpenLogOutModal(open);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  const router = useRouter();

  const isAdmin = user.role.includes("admin");
  const isTeacher = user.role.includes("teacher");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative flex items-center gap-3 rounded-full transition-all
         hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary
          focus:ring-offset-2"
        >
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarImage src={user.profileImage || undefined} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {user.name.charAt(0).toLocaleUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-3 p-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={user.profileImage || undefined}
                  alt={user.name}
                />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {isAdmin && (
                <Badge variant="default" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
              )}
              {isTeacher && (
                <Badge variant="secondary" className="text-xs">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  Teacher
                </Badge>
              )}
              {user.isVerified && (
                <Badge variant="outline" className="text-xs text-green-600">
                  ✓ Verified
                </Badge>
              )}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {!isAdmin && !isTeacher && (
            <>
              <DropdownMenuItem asChild>
                <Link href="panels/user/userInfo" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="panels/user/user-courses"
                  className="cursor-pointer"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>My Courses</span>
                  {user.purchasedCourses.length > 0 && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {user.purchasedCourses.length}
                    </Badge>
                  )}
                </Link>
              </DropdownMenuItem>
            </>
          )}

          {isAdmin ||
            (isTeacher && (
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
            ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href={isAdmin || isTeacher ? "/panels/admin" : "/panels/user"}
              className="cursor-pointer text-primary"
            >
              <Shield className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={() => onChangeOpen(true)}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
      <LogoutDialog
        open={openLogOutModal}
        onOpenChange={onChangeOpen}
        onConfirm={() => {
          logOut(router);
        }}
      />
    </DropdownMenu>
  );
}
