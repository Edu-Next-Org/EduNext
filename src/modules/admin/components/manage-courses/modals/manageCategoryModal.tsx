"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCategory } from "@/core/services/api/post/createCategory";
import { deleteCategory } from "@/core/services/api/delete/DeleteCategory";
import type { AdminCategory } from "@/core/services/api/Get/GetAllCategoryAdmin";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { FolderOpen, Plus, X, Layers, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ManageCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: AdminCategory[];
}

export function ManageCategoryModal({
  isOpen,
  onClose,
  categories,
}: ManageCategoryModalProps) {
  const router = useRouter();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [openDeleteConfirmId, setOpenDeleteConfirmId] = useState<string | null>(
    null,
  );

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: (data) => {
      router.refresh();
      toast.success(data.message || "Category added successfully");
      setNewCategoryName("");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create category");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: (data) => {
      router.refresh();
      toast.success(data.message || "Category deleted successfully");
      setOpenDeleteConfirmId(null);
    },
    onSettled: () => {
      setDeletingId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete category");
    },
  });

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim() || createMutation.isPending) return;
    createMutation.mutate(newCategoryName.trim());
  };

  const handleDeleteCategory = (id: string) => {
    if (deleteMutation.isPending) return;

    setDeletingId(id);

    deleteMutation.mutate(id, {
      onSettled: () => {
        setDeletingId(null);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[95vw] h-auto max-h-[85vh] overflow-y-auto border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-md dark:bg-[#333]/95 dark:border-[#444] rounded-3xl
                   mobile:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl"
      >
        <DialogHeader className=" space-y-2 text-left ">
          <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <FolderOpen className="h-6 w-6 text-violet-600 shrink-0" />
            Manage Categories
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 dark:text-[#ccc]">
            View existing categories, delete them, or add a new one to the
            system.
          </DialogDescription>
          <hr className="border-slate-200/60 dark:border-[#444] mt-2" />
        </DialogHeader>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#898989] flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5" />
            All Available Categories ({categories.length})
          </h4>

          {categories.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-[#898989] italic py-2">
              No categories found. Add one below.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2.5 p-4 rounded-2xl border border-slate-100 dark:border-[#444]/30 bg-slate-50/50 dark:bg-[#454545]/30">
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  className="group relative rounded-full pl-4 pr-3 py-1.5 text-sm font-medium transition-all bg-violet-600/10 text-violet-600 hover:bg-violet-600/20 dark:bg-violet-500/20 dark:text-violet-400 border border-violet-500/10"
                >
                  {category.name}

                  <AlertDialog
                    open={openDeleteConfirmId === category.id}
                    onOpenChange={(isOpen) =>
                      setOpenDeleteConfirmId(isOpen ? category.id : null)
                    }
                  >
                    <AlertDialogTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setOpenDeleteConfirmId(category.id)}
                        className=" cursor-pointer ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full text-violet-500/60 hover:bg-violet-600 hover:text-white dark:text-violet-400/60 dark:hover:bg-violet-500 transition-colors focus:outline-none"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </AlertDialogTrigger>

                    <AlertDialogContent className="w-[90vw] max-w-md rounded-3xl border-white/25 bg-white/95 p-6 shadow-2xl backdrop-blur-md dark:bg-[#333]/95 dark:border-[#444]">
                      <AlertDialogHeader className="text-left">
                        <AlertDialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-slate-500 dark:text-[#ccc] mt-2 leading-relaxed">
                          Are you sure you want to delete the{" "}
                          <span className="font-semibold text-violet-600 dark:text-violet-400">
                            &quot;{category.name}&quot;
                          </span>{" "}
                          category?
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter className="mt-4 gap-2 sm:gap-3">
                        <AlertDialogCancel className=" cursor-pointer rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-[#454545] dark:text-white dark:hover:bg-[#555] border-none">
                          Cancel
                        </AlertDialogCancel>

                        <Button
                          type="button"
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={deleteMutation.isPending}
                          className="cursor-pointer rounded-xl bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-700"
                        >
                          {deleteMutation.isPending &&
                          deletingId === category.id ? (
                            <>
                              <Loader2 className=" h-4 w-4 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            "Yes, Delete"
                          )}
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <hr className="border-slate-200/60 dark:border-[#444]/50" />

        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="category-name"
              className="text-sm font-semibold text-slate-700 dark:text-[#ccc]"
            >
              Create New Category
            </Label>
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <Input
                id="category-name"
                type="text"
                placeholder="Data Science, UX/UI Design..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="rounded-2xl py-5 focus-visible:ring-1 focus-visible:ring-violet-600 dark:bg-[#252525] dark:border-[#444]"
              />
              <Button
                type="submit"
                disabled={!newCategoryName.trim() || createMutation.isPending}
                className=" cursor-pointer rounded-2xl bg-violet-600 hover:bg-violet-700 font-medium px-5 py-5 shrink-0"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className=" h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className=" h-4 w-4" />
                    Add Category
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>

        <div className=" mt-2 pt-4 border-t border-slate-200/60 dark:border-[#444] flex justify-end">
          <Button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-[#454545] dark:text-white dark:hover:bg-[#555]"
          >
            Close Management
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
