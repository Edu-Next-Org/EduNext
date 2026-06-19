"use client";

import { motion } from "framer-motion";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Plus,
  Search,
  Crown,
  GraduationCap,
  Shield,
  UserRound,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AdminUser, ApiMeta } from "@/core/services/api/Get/GetAllUser";
import { PaginationComp } from "@/components/PaginationComp";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { DeleteUserModal } from "./modals/deleteUserModal";
import { UserEditRoleModal } from "./modals/userEditRoleModal";
import { CreateUserModal } from "./modals/createUserModal";
import { useQuery } from "@tanstack/react-query";
import {
  getUserById,
  UserByIdApiData,
} from "@/core/services/api/Get/GetUserById";
import { UserViewModal } from "./modals/userViewModal";
import { UserManagementDesktopTable } from "./user-management-desktop";
import { UserManagementMobileCards } from "./user-management-mobile";
import { UpdateUserInfoModal } from "./modals/updateUserModal";

export function useUserById(userId: string | null) {
  return useQuery<UserByIdApiData>({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}

const TAB_TO_ROLE: Record<string, string> = {
  students: "user",
  teachers: "teacher",
  admins: "admin",
};

const ROLE_TO_TAB: Record<string, string> = {
  user: "students",
  teacher: "teachers",
  admin: "admins",
};

const roleIconMap = {
  user: { icon: UserRound, label: "User" },
  teacher: { icon: GraduationCap, label: "Teacher" },
  admin: { icon: Shield, label: "Admin" },
  superadmin: { icon: Crown, label: "Superadmin" },
} as const;

interface UserManagementProps {
  users: AdminUser[];
  meta: ApiMeta;
}

export function UserManagement({ users, meta }: UserManagementProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchParamsRef = useRef(searchParams);
  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  const activeTab = ROLE_TO_TAB[searchParams.get("role") ?? ""] ?? "all";

  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") ?? "",
  );
  const isFirstSearchRender = useRef(true);

  useEffect(() => {
    if (isFirstSearchRender.current) {
      isFirstSearchRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParamsRef.current.toString());
      searchValue.trim()
        ? params.set("search", searchValue.trim())
        : params.delete("search");
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, router, pathname]);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [selectedRoleUser, setSelectedRoleUser] = useState<{
    id: string;
    name: string;
    roles: string[];
  } | null>(null);

  const { data: userData, isLoading } = useUserById(selectedUserId);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParamsRef.current.toString());
    value === "all"
      ? params.delete("role")
      : params.set("role", TAB_TO_ROLE[value] ?? "");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleEditRoleClick = (user: AdminUser) => {
    setSelectedRoleUser({ id: user.id, name: user.name, roles: user.roles });
    setIsEditRoleModalOpen(true);
  };

  const handleUserEditClick = (user: AdminUser) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };
  const handleViewProfile = (user: AdminUser) => {
    setSelectedUserId(user.id);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (user: AdminUser) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight dark:text-[white]">
              User Management
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-[#ccc]">
              Track users, roles, and account status.
            </p>
          </div>

          <div>
            <Button
              onClick={() => setIsCreateUserModalOpen(true)}
              className=" cursor-pointer rounded-2xl bg-violet-600 hover:bg-violet-700 w-full  sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New User
            </Button>
          </div>
        </div>

        <Card className="rounded-3xl border-white/70 bg-white/80 shadow-sm backdrop-blur dark:bg-[#333]">
          <CardHeader className="flex flex-col gap-4 pt-6 pb-3 xl:pb-10 md:flex-row md:items-center md:justify-between">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="rounded-2xl bg-slate-100 w-full 2xl:w-auto overflow-x-auto sm:overflow-x-hidden overflow-y-hidden dark:!bg-[#454545]">
                <TabsTrigger
                  value="all"
                  className="rounded-xl !text-[12px] sm:!text-sm md:!text-xs lg:!text-xs xl:!text-sm !cursor-pointer"
                >
                  All Users
                </TabsTrigger>
                <TabsTrigger
                  value="students"
                  className="rounded-xl !text-[12px] sm:!text-sm md:!text-xs lg:!text-xs xl:!text-sm !cursor-pointer"
                >
                  Students
                </TabsTrigger>
                <TabsTrigger
                  value="teachers"
                  className="rounded-xl !text-[12px] sm:!text-sm md:!text-xs lg:!text-xs xl:!text-sm !cursor-pointer"
                >
                  Teachers
                </TabsTrigger>
                <TabsTrigger
                  value="admins"
                  className="rounded-xl !text-[12px] sm:!text-sm md:!text-xs lg:!text-xs xl:!text-sm !cursor-pointer"
                >
                  Admins
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full md:max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search users..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="h-10 2xl:h-11 rounded-2xl pl-10"
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <UserManagementDesktopTable
              users={users}
              roleIconMap={roleIconMap}
              onViewProfile={handleViewProfile}
              onEditRole={handleEditRoleClick}
              onEditUser={handleUserEditClick}
              onBlockUser={handleDeleteClick}
            />

            <UserManagementMobileCards
              users={users}
              roleIconMap={roleIconMap}
              onViewProfile={handleViewProfile}
              onEditRole={handleEditRoleClick}
              onEditUser={handleUserEditClick}
              onBlockUser={handleDeleteClick}
            />
          </CardContent>

          <PaginationComp currentPage={meta.page} totalPages={meta.pages} />
        </Card>

        <DeleteUserModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedUser(null);
          }}
          userId={selectedUser?.id ?? null}
          userName={selectedUser?.name || ""}
        />
        <UserViewModal
          isOpen={isViewModalOpen}
          isLoading={isLoading}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedUserId(null);
          }}
          userData={userData ?? null}
        />
        <UserEditRoleModal
          isOpen={isEditRoleModalOpen}
          onClose={() => {
            setIsEditRoleModalOpen(false);
            setSelectedRoleUser(null);
          }}
          user={selectedRoleUser}
          onUpdate={() => {
            setIsEditRoleModalOpen(false);
            setSelectedRoleUser(null);
          }}
        />
        <CreateUserModal
          isOpen={isCreateUserModalOpen}
          onClose={() => setIsCreateUserModalOpen(false)}
        />
        <UpdateUserInfoModal
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedUser(null);
          }}
          userId={selectedUser?.id ?? null}
          initialData={
            selectedUser
              ? {
                  name: selectedUser.name,
                  email: selectedUser.email,
                  phoneNumber:
                    (selectedUser as { phoneNumber?: string | null })
                      .phoneNumber ??
                    (selectedUser as { phonenumber?: string | null })
                      .phonenumber ??
                    "",
                  gender: selectedUser.gender ?? "",
                  birthday: selectedUser.birthday ?? "",
                  about: selectedUser.about ?? "",
                  profileImage: selectedUser.profileImage ?? null,
                }
              : null
          }
        />
      </motion.div>
    </TooltipProvider>
  );
}
