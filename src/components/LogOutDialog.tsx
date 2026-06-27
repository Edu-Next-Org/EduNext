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
import { LogOut } from "lucide-react";
import { Button } from "./ui/button";

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
}

export function LogoutDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: LogoutDialogProps) {
  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="max-w-md bg-background border-[#E2D9C8]
       shadow-xl rounded-2xl p-0 overflow-hidden"
      >
        <div className="h-1.5 w-full bg-red-700/50" />

        <div className="p-6">
          <AlertDialogHeader className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-red-700/30 flex items-center justify-center shadow-sm">
                <LogOut className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
            </div>

            <div className="text-center space-y-2">
              <AlertDialogTitle className="text-xl font-bold text-[#1F2421]">
                Logging out
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[#8A8A80] text-sm leading-relaxed">
                Are you sure you want to log out of your account? You'll need to
                sign in again to access your courses and progress.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex gap-3 mt-6 flex-row">
            <AlertDialogCancel
              disabled={isLoading}
              className="flex-1 border-[#E2D9C8] text-foreground hover:bg-[#F6F1E8] font-semibold rounded-xl h-11 transition-all"
            >
              Cancel
            </AlertDialogCancel>
            <Button
              variant={"destructive"}
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 text-white font-semibold
               rounded-xl h-11 shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging out...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Yes, log out
                </span>
              )}
            </Button>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
