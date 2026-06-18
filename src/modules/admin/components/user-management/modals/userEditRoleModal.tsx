"use client";

import { useState } from "react";
import {
  X,
  Plus,
  Shield,
  Loader2,
  AlertTriangle,
  Crown,
  GraduationCap,
  UserRound,
  Key,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addRole } from "@/core/services/api/patch/AddRole";
import { removeRole } from "@/core/services/api/patch/RemoveRole";

interface User {
  id: string;
  name: string;
  roles: string[];
}

interface UserEditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUpdate: (updatedUser: User) => void;
}

const AVAILABLE_ROLES = ["admin", "user", "teacher", "superadmin"];

const roleIconMap = {
  user: { icon: UserRound, label: "User" },
  teacher: { icon: GraduationCap, label: "Teacher" },
  admin: { icon: Shield, label: "Admin" },
  superadmin: { icon: Crown, label: "Superadmin" },
} as const;

export function UserEditRoleModal({
  isOpen,
  onClose,
  user,
  onUpdate,
}: UserEditRoleModalProps) {
  const router = useRouter();
  const [roleToAdd, setRoleToAdd] = useState("");
  const [roleToRemove, setRoleToRemove] = useState<string | null>(null);

  const addRoleMutation = useMutation({
    mutationFn: async (role: string) => {
      if (!user) throw new Error("User not found");
      return addRole(user.id, role);
    },
    onSuccess: (response) => {
      toast.success(response.message);

      if (response.data) {
        onUpdate({
          id: response.data.id,
          name: response.data.name,
          roles: response.data.role,
        });
      }

      setRoleToAdd("");
      router.refresh();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to add role";
      toast.error(message);
    },
  });

  const removeRoleMutation = useMutation({
    mutationFn: async (role: string) => {
      if (!user) throw new Error("User not found");
      return removeRole(user.id, role);
    },
    onSuccess: (response) => {
      toast.success(response.message);

      if (response.data) {
        onUpdate({
          id: response.data.id,
          name: response.data.name,
          roles: response.data.role,
        });
      }

      setRoleToRemove(null);
      router.refresh();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to remove role";
      toast.error(message);
    },
  });

  const isAddingRole = addRoleMutation.isPending;
  const isRemovingRole = removeRoleMutation.isPending;

  const handleAddRole = async () => {
    if (!roleToAdd || isAddingRole || !user) return;
    addRoleMutation.mutate(roleToAdd);
  };

  const handleCreateRemoveConfirm = async () => {
    if (!roleToRemove || isRemovingRole || !user) return;
    removeRoleMutation.mutate(roleToRemove);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setRoleToAdd("");
      setRoleToRemove(null);
      onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent
          className="
            w-[95vw] max-w-[95vw]
            sm:w-full sm:max-w-lg
            lg:max-w-xl
            rounded-3xl
            border border-white/20
            bg-white/95
            p-5 sm:p-6
            shadow-2xl
            backdrop-blur-md
            dark:bg-[#333]/95 dark:border-[#444]
          "
        >
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              <Key className="h-5 w-5 sm:h-6 sm:w-6 text-violet-600 shrink-0" />
              Manage Roles
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500 dark:text-[#ccc] leading-relaxed">
              Modify roles for{" "}
              <span className="font-semibold text-violet-600 dark:text-violet-400">
                {user?.name}
              </span>
              .
            </DialogDescription>
            <hr className="border-slate-200/60 dark:border-[#444] mt-2" />
          </DialogHeader>

          <div className="space-y-6 py-2">
            <div className="space-y-3">
              <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#898989]">
                <Key className="h-3.5 w-3.5" />
                Current Roles
              </h4>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-[#444]/40 dark:bg-[#454545]/30">
                {user?.roles?.length ? (
                  <div className="flex flex-wrap gap-2.5">
                    {user.roles.map((role) => {
                      const config =
                        roleIconMap[role as keyof typeof roleIconMap];
                      const RoleIcon = config?.icon ?? Shield;

                      return (
                        <Badge
                          key={role}
                          className="
        group relative
        rounded-full
        pl-4 pr-3 py-1.5
        text-sm font-medium
        transition-all
        bg-violet-600/10 text-violet-600
        hover:bg-violet-600/20
        dark:bg-violet-500/20 dark:text-violet-400
        border border-violet-500/10
      "
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <RoleIcon className="h-3.5 w-3.5" />
                            <span className="capitalize">{role}</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => setRoleToRemove(role)}
                            className="
          ml-2 inline-flex h-5 w-5 items-center justify-center
          rounded-full
          text-violet-500/70
          transition-colors
          hover:bg-violet-600 hover:text-white
          dark:text-violet-400/70
          dark:hover:bg-violet-500
          focus:outline-none
          cursor-pointer
        "
                            aria-label={`Remove ${role} role`}
                            disabled={isRemovingRole}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm italic text-slate-500 dark:text-[#989898]">
                    No roles assigned yet.
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#898989]">
                <Plus className="h-3.5 w-3.5" />
                Add New Role
              </h4>

              <div className="flex flex-col gap-2.5 sm:flex-row">
                <Select
                  value={roleToAdd}
                  onValueChange={setRoleToAdd}
                  disabled={isAddingRole}
                >
                  <SelectTrigger
                    className="
                      h-11 flex-1 rounded-2xl
                      border-slate-200 bg-white
                      px-4
                      text-sm
                      dark:bg-[#252525] dark:border-[#444]
                    "
                  >
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-white/20 dark:bg-[#444]">
                    {AVAILABLE_ROLES.map((role) => (
                      <SelectItem
                        key={role}
                        value={role}
                        disabled={user?.roles.includes(role)}
                      >
                        <span className="capitalize">{role}</span>
                        {user?.roles.includes(role)
                          ? " (already assigned)"
                          : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  onClick={handleAddRole}
                  disabled={!roleToAdd || isAddingRole}
                  className="
                    h-8.5 rounded-2xl
                    bg-violet-600 px-5
                    font-medium
                    hover:bg-violet-700
                    shrink-0
                    cursor-pointer
                  "
                >
                  {isAddingRole ? (
                    <>
                      <Loader2 className=" h-4 w-4 animate-spin" />
                      Adding role...
                    </>
                  ) : (
                    <>
                      <Plus className=" h-4 w-4" />
                      Add Role
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!roleToRemove}
        onOpenChange={(open) => !open && setRoleToRemove(null)}
      >
        <AlertDialogContent
          className="
            w-[92vw] max-w-md
            rounded-3xl
            border border-white/25
            bg-white/95
            p-6
            shadow-2xl
            backdrop-blur-md
            dark:bg-[#333]/95 dark:border-[#444]
          "
        >
          <AlertDialogHeader className="text-left">
            <div className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-600/10 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <AlertDialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
              Are you absolutely sure?
            </AlertDialogTitle>

            <AlertDialogDescription className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-[#ccc]">
              Are you sure you want to remove the{" "}
              <span className="font-semibold text-violet-600 dark:text-violet-400">
                &quot;{roleToRemove}&quot;
              </span>{" "}
              role from{" "}
              <span className="font-semibold text-slate-800 dark:text-white">
                {user?.name}
              </span>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-4 gap-2 sm:gap-3">
            <AlertDialogCancel
              disabled={isRemovingRole}
              className="
                rounded-xl
                bg-slate-100 text-slate-800
                hover:bg-slate-200
                dark:bg-[#454545] dark:text-white dark:hover:bg-[#555]
                border-none
                cursor-pointer
              "
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleCreateRemoveConfirm();
              }}
              disabled={isRemovingRole}
              className="
                rounded-xl
                bg-rose-600 text-white
                hover:bg-rose-700
                dark:bg-rose-600 dark:hover:bg-rose-700
                cursor-pointer
              "
            >
              {isRemovingRole ? (
                <>
                  <Loader2 className=" h-4 w-4 animate-spin" />
                  Removing role...
                </>
              ) : (
                "Yes, Remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
