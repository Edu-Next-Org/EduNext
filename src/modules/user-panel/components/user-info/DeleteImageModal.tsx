"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import {
  DeleteProfileImage,
  IDeleteImgRes,
} from "@/core/services/api/delete/DeleteProfileImage";
import { toast } from "react-toastify";

interface IDeleteImageModalProps {
  open: boolean;
  onClose: () => void;
}

const DeleteImageModal = ({ open, onClose }: IDeleteImageModalProps) => {
  const { mutate: deleteImg, isPending } = useMutation<
    IDeleteImgRes | null,
    Error
  >({
    mutationKey: ["DELETEIMG"],
    mutationFn: async () => await DeleteProfileImage(),
    onSuccess: (data) => {
      toast.success(data?.message || "deleted successfully");
      onClose();
    },
    onError: (err) => {
      toast.error(err?.message || "something went wrong !");
    },
  });
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-red-600">
            Delete Image
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 text-center space-y-6">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this image?
          </p>

          <div className="flex justify-center gap-4">
            <Button
              variant="destructive"
              onClick={() => deleteImg()}
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  deleting...
                </div>
              ) : (
                "delete"
              )}
            </Button>

            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteImageModal;
