"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  addProfileImage,
  IUploadImgRes,
} from "@/core/services/api/post/AddImageProfile";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React, { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";

interface IUploadImageModalProps {
  open: boolean;
  onClose: () => void;
}

const UploadImageModal = ({ open, onClose }: IUploadImageModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const { mutate: upload, isPending } = useMutation<
    IUploadImgRes | null,
    Error,
    File
  >({
    mutationKey: ["UPLOADIMAGE"],
    mutationFn: async (file: File) => await addProfileImage(file),
    onSuccess: (data) => {
      toast.success(data?.message || "upload successfully");
      onClose();
    },
    onError: (err) => {
      toast.error(err?.message || "something went wrong");
    },
  });
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="translate-y-[-200px] data-[state=open]:translate-y-0 transition-all duration-300">
        <DialogHeader>
          <DialogTitle className="text-center">Upload Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <input
            type="file"
            accept="image/*"
            className="w-full border rounded-md p-2 text-sm"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0]);
              }
            }}
          />

          <Button
            onClick={() => {
              if (!file) {
                toast.error("upload image first");
                return null;
              }
              upload(file);
            }}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Uploading
              </div>
            ) : (
              "Upload"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadImageModal;
