"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { format, isValid, parseISO } from "date-fns";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  updateUser,
  type UpdateUserPayload,
} from "@/core/services/api/put/UpdateUser";
import { UpdateUserForm, type UpdateUserFormValues } from "./updateUserForm";

interface UpdateUserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  initialData?: {
    name?: string;
    email?: string;
    phoneNumber?: string | null;
    phonenumber?: string | null;
    gender?: string | null;
    birthday?: string | null;
    about?: string | null;
    profileImage?: string | null;
  } | null;
}

const updateUserSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value)),
  email: Yup.string()
    .trim()
    .email("Email must be a valid email")
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value)),
  phoneNumber: Yup.string()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value)),
  gender: Yup.string()
    .oneOf(["male", "female", "other"], "Gender must be male, female, or other")
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value)),
  birthday: Yup.date()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .typeError("Birthday must be a valid date"),
  about: Yup.string()
    .max(500, "About must be at most 500 characters")
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value)),
  profileImage: Yup.mixed<File>().nullable().notRequired(),
});

export function UpdateUserInfoModal({
  isOpen,
  onClose,
  initialData,
  userId,
}: UpdateUserInfoModalProps) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(
    typeof initialData?.profileImage === "string"
      ? initialData.profileImage
      : null,
  );

  useEffect(() => {
    if (!isOpen) return;

    setImagePreview(
      typeof initialData?.profileImage === "string"
        ? initialData.profileImage
        : null,
    );
  }, [isOpen, initialData]);

  const updateUserMutation = useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string;
      payload: UpdateUserPayload;
    }) => updateUser(userId, payload),
    onSuccess: (response) => {
      toast.success(response.message ?? "User updated successfully");
      handleClose();
      router.refresh();
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    },
  });

  const formatBirthdayValue = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const parseBirthdayValue = (value: string) => {
    const date = parseISO(value);
    return isValid(date) ? date : null;
  };

  const toDateInputValue = (value?: string | null) => {
    if (!value) return "";
    const parsed = parseBirthdayValue(value);
    return parsed ? format(parsed, "yyyy-MM-dd") : "";
  };

  const formik = useFormik<UpdateUserFormValues>({
    enableReinitialize: true,
    initialValues: {
      name: initialData?.name ?? "",
      email: initialData?.email ?? "",
      phoneNumber: initialData?.phoneNumber ?? initialData?.phonenumber ?? "",
      gender: initialData?.gender ?? "",
      birthday: toDateInputValue(initialData?.birthday),
      about: initialData?.about ?? "",
      profileImage: null,
    },
    validationSchema: updateUserSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, helpers) => {
      const payload: UpdateUserPayload = {
        name: values.name.trim(),
        email: values.email.trim(),
        phoneNumber: values.phoneNumber.trim() || null,
        gender: values.gender || null,
        birthday: values.birthday || null,
        about: values.about.trim() || null,
        profileImage: values.profileImage ?? null,
      };

      try {
        if (!userId) {
          toast.error("User ID is missing");
          return;
        }

        await updateUserMutation.mutateAsync({ userId, payload });
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setImagePreview(null);
    onClose();
  };

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleFileChange = (file: File | null) => {
    formik.setFieldValue("profileImage", file);
    formik.setFieldTouched("profileImage", true, false);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="flex max-h-[90vh] w-[95vw] max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white p-0 shadow-2xl dark:border-[#444] dark:bg-[#333]"
      >
        <div className="relative z-10 shrink-0 border-b border-slate-100 bg-white/95 px-8 py-7 backdrop-blur dark:border-[#444] dark:bg-[#333]/95">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Edit Profile
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-sm text-slate-500 dark:text-[#ccc]">
              Update your personal information and profile settings.
            </DialogDescription>
          </DialogHeader>
        </div>

        <UpdateUserForm
          isOpen={isOpen}
          formik={formik}
          imagePreview={imagePreview}
          isSaving={formik.isSubmitting || updateUserMutation.isPending}
          onClose={onClose}
          onFileChange={handleFileChange}
          parseBirthdayValue={parseBirthdayValue}
          formatBirthdayValue={formatBirthdayValue}
        />
      </DialogContent>
    </Dialog>
  );
}
