"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { uploadProfileImage } from "@/core/services/api/post/UploadProfileAdmin";
import { deleteProfileImage } from "@/core/services/api/delete/DeleteProfileAdmin";

type AdminProfileModalProps = {
  name: string;
  role?: string;
  initials: string;
  imageSrc?: string | null;
  onImageChange?: (nextImageSrc: string | null) => void;
  className?: string;
};

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export default function AdminProfileModal({
  name,
  role = "Admin",
  initials,
  imageSrc = null,

  onImageChange,
  className,
}: AdminProfileModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(imageSrc);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const uploadMutation = useMutation({
    mutationFn: uploadProfileImage,
    onSuccess: (response) => {
      const nextUrl = response.data.user.profileImage;
      setCurrentImage(nextUrl);
      onImageChange?.(nextUrl);
      clearSelectedFile();
      setOpen(false);
      toast.success(response.message || "Profile image updated successfully");
      router.refresh();
    },
    onError: (err: Error) => {
      setError(err.message);
      toast.error(err.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProfileImage,
    onSuccess: (response) => {
      setCurrentImage(null);
      onImageChange?.(null);
      clearSelectedFile();
      setOpen(false);
      toast.success(response.message || "Profile image deleted successfully");
      router.refresh();
    },
    onError: (err: Error) => {
      setError(err.message);
      toast.error(err.message);
    },
  });

  useEffect(() => {
    setCurrentImage(imageSrc);
  }, [imageSrc]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      setError(null);
      if (previewUrl) setPreviewUrl(null);
    }
  }, [open, previewUrl]);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setError(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const onFileChange = (file: File | null) => {
    if (!file) return;

    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Only JPG, PNG, WEBP and AVIF formats are allowed");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`Image size must be smaller than ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    const nextPreview = URL.createObjectURL(file);

    setSelectedFile(file);
    setPreviewUrl(nextPreview);
  };

  const handleUpload = () => {
    if (!selectedFile || uploadMutation.isPending || deleteMutation.isPending)
      return;
    setError(null);
    uploadMutation.mutate(selectedFile);
  };

  const handleDelete = () => {
    if (!currentImage || uploadMutation.isPending || deleteMutation.isPending)
      return;
    setError(null);
    deleteMutation.mutate();
  };

  const STATIC_AVATAR = "/images/people.png";

  const shownImage = previewUrl ?? currentImage;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Edit profile image"
        className={cn(
          "group relative inline-flex items-center justify-center rounded-full outline-none transition-transform duration-300 hover:scale-[1.03] focus-visible:scale-[1.03]",
          className,
        )}
      >
        <Avatar className="h-11 w-11 rounded-full ring-2 cursor-pointer ring-transparent transition-all duration-300 group-hover:ring-violet-300 group-focus-visible:ring-violet-400">
          <AvatarImage
            src={currentImage ?? STATIC_AVATAR}
            alt={name}
            className="object-cover dark:bg-[#ccc]"
          />
          <AvatarFallback className="bg-gradient-to-br from-violet-100 to-indigo-100 text-sm font-semibold text-violet-700 dark:from-[#4b4b4b] dark:to-[#3a3a3a] dark:text-white">
            {initials}
          </AvatarFallback>
        </Avatar>

        <span className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-violet-600 text-white opacity-0 shadow-md transition group-hover:opacity-100 group-focus-visible:opacity-100">
          <Camera className="h-3 w-3" />
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={cn(
            "w-[calc(100vw-1rem)] max-w-[560px] overflow-hidden rounded-[28px] border border-white/60 bg-white/95 p-0 shadow-[0_30px_120px_rgba(0,0,0,0.28)] backdrop-blur-xl dark:border-[#444] dark:bg-[#2f2f2f]",
            "sm:max-w-[620px] md:max-w-[680px] lg:max-w-[720px] xl:max-w-[760px] 2xl:max-w-[820px] z-[9999] ",
          )}
        >
          <div className="max-h-[92dvh] overflow-y-auto">
            <div className="px-4 pt-4 sm:px-5 sm:pt-5 md:px-6 md:pt-6">
              <DialogHeader className="space-y-2 text-left">
                <DialogTitle className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg md:text-xl">
                  Profile Image Management
                </DialogTitle>

                <DialogDescription className="text-xs text-slate-500 dark:text-[#b7b7b7] sm:text-sm">
                  You can upload or remove your profile image here.
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="grid gap-4 px-4 pb-4 pt-4 sm:px-5 sm:pb-5 md:px-6 md:pb-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-5">
              <div className="rounded-[24px] border border-white/70 bg-slate-50/80 p-4 shadow-sm dark:border-[#474747] dark:bg-[#383838] sm:p-5">
                <div className="flex flex-col items-center justify-center gap-4  h-full 2xl:gap-10 text-center  sm:text-center ">
                  <div className="flex shrink-0 items-center justify-center ">
                    <Avatar className="h-24 w-24 rounded-full  ring-4 ring-white shadow-lg sm:h-28 sm:w-28 md:h-32 md:w-32 dark:ring-[#444]">
                      <AvatarImage
                        src={shownImage ?? STATIC_AVATAR}
                        alt={name}
                        className="object-cover dark:bg-[#ccc]"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-violet-100 to-indigo-100 text-xl font-semibold text-violet-700 dark:from-[#4b4b4b] dark:to-[#3a3a3a] dark:text-white sm:text-2xl">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className=" ">
                    <div className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                      {name}
                    </div>

                    <div className="mt-1 text-sm text-slate-500 dark:text-[#cfcfcf]">
                      {role}
                    </div>

                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm dark:bg-[#454545] dark:text-[#ddd]">
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          currentImage ? "bg-emerald-500" : "bg-amber-500",
                        )}
                      />

                      {currentImage
                        ? "Profile image uploaded"
                        : "No profile image"}
                    </div>

                    <p className="mt-4 text-xs leading-6 text-slate-500 dark:text-[#bdbdbd] sm:text-sm">
                      Select a new image to preview it before uploading.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/70 bg-white/85 p-4 shadow-sm dark:border-[#474747] dark:bg-[#353535] sm:p-5">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={openFilePicker}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      openFilePicker();
                    }
                  }}
                  className="group flex cursor-pointer flex-col items-center justify-center rounded-[22px] border border-dashed border-violet-200 bg-violet-50/70 px-4 py-5 text-center transition hover:border-violet-400 hover:bg-violet-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 dark:border-[#5b4a7e] dark:bg-[#43385f] dark:hover:bg-[#4a3f67] sm:px-5 sm:py-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm transition group-hover:scale-[1.03] dark:bg-[#2f2f2f]">
                    <ImagePlus className="h-5 w-5 text-violet-600" />
                  </div>

                  <div className="mt-3 text-sm font-medium text-slate-900 dark:text-white sm:text-base">
                    Select Image
                  </div>

                  <div className="mt-1 text-xs leading-5 text-slate-500 dark:text-[#cfcfcf]">
                    JPG / PNG / WEBP / AVIF — Max {MAX_FILE_SIZE_MB}MB
                  </div>

                  {selectedFile ? (
                    <div className="mt-3 w-full rounded-2xl bg-white/90 px-3 py-2 text-left text-xs text-slate-600 shadow-sm dark:bg-[#2f2f2f] dark:text-[#ddd]">
                      <div className="truncate font-medium">
                        {selectedFile.name}
                      </div>

                      <div className="mt-1 text-[11px] text-slate-500 dark:text-[#bdbdbd]">
                        {Math.round(selectedFile.size / 1024)} KB
                      </div>
                    </div>
                  ) : null}
                </div>

                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="hidden"
                  onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
                />

                {error ? (
                  <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
                    {error}
                  </div>
                ) : null}

                <div className="mt-4 ">
                  <Button
                    type="button"
                    onClick={handleUpload}
                    disabled={
                      !selectedFile ||
                      uploadMutation.isPending ||
                      deleteMutation.isPending
                    }
                    className="h-11 rounded-2xl w-full cursor-pointer bg-violet-600 text-white  shadow-sm hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {uploadMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Upload Image
                      </>
                    )}
                  </Button>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDelete}
                    disabled={
                      !currentImage ||
                      uploadMutation.isPending ||
                      deleteMutation.isPending
                    }
                    className="h-11 rounded-2xl cursor-pointer border-red-200 bg-red-50 text-red-600 shadow-sm hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200 dark:hover:bg-red-500/15"
                  >
                    {deleteMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove Current Image
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={clearSelectedFile}
                    disabled={
                      !selectedFile ||
                      uploadMutation.isPending ||
                      deleteMutation.isPending
                    }
                    className="h-11 rounded-2xl cursor-pointer text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 dark:text-[#cfcfcf] dark:hover:bg-[#444] dark:hover:text-white"
                  >
                    Cancel Selected File
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
