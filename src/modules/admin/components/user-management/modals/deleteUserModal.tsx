"use client";

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
import { deleteUser } from "@/core/services/api/delete/DeleteUser";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  userName: string;
}

export function DeleteUserModal({
  isOpen,
  onClose,
  userId,
  userName,
}: DeleteUserModalProps) {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      onClose();
      router.refresh();
      toast.success("User deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete user");
    },
  });

  const handleDelete = () => {
    if (!userId) return;
    mutate(userId);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-3xl dark:bg-[#333] border-white/70">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500 dark:text-[#ccc]">
            This will delete the user{" "}
            <span className="font-semibold text-violet-600 dark:text-violet-400">
              &quot;{userName}&quot;
            </span>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="rounded-2xl cursor-pointer"
            disabled={isPending}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isPending || !userId}
            className=" cursor-pointer rounded-2xl bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
