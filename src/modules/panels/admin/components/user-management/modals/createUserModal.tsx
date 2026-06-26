"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {
  createUser,
  type CreateUserPayload,
} from "@/core/services/api/post/CreateUser";
import { CreateUserForm } from "./createUserForm";

type CreateUserData = CreateUserPayload;

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialValues: CreateUserData = {
  name: "",
  email: "",
  phoneNumber: "",
  password: "",
  gender: "",
  birthday: "",
  about: "",
  profileImage: null,
};

const createUserSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),
  email: Yup.string()
    .trim()
    .email("Email must be a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  phoneNumber: Yup.string().nullable(),
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
  profileImage: Yup.mixed<File>()
    .nullable()
    .notRequired()
    .test("fileSize", "Image must be smaller than 5MB", (file) => {
      if (!file) return true;
      return file.size <= 5 * 1024 * 1024;
    })
    .test("fileType", "Only image files are allowed", (file) => {
      if (!file) return true;
      return file.type.startsWith("image/");
    }),
});

export function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: async (response) => {
      toast.success(response.message ?? "User created successfully");
      router.refresh();
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    },
  });

  const formik = useFormik<CreateUserData>({
    initialValues,
    validationSchema: createUserSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, helpers) => {
      const payload: CreateUserData = {
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password.trim(),
        phoneNumber: values.phoneNumber?.trim() ?? null,
        gender: values.gender ?? null,
        birthday: values.birthday ?? null,
        about: values.about?.trim() ?? null,
        profileImage: values.profileImage ?? null,
      };

      try {
        await createUserMutation.mutateAsync(payload);
        helpers.resetForm();
        setImagePreview(null);
        onClose();
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
      setImagePreview(null);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleClose = () => {
    formik.resetForm();
    setImagePreview(null);
    onClose();
  };

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

  const getFieldClassName = (
    fieldName: keyof CreateUserData,
    baseClassName = "",
  ) => {
    const error = formik.errors[fieldName];
    const touched = formik.touched[fieldName];
    const value = formik.values[fieldName];

    const hasError = !!touched && !!error;

    const isValid =
      !!touched &&
      !error &&
      value !== undefined &&
      value !== null &&
      value !== "";

    return [
      "rounded-2xl py-6 transition-all",
      "focus-visible:ring-1",
      hasError
        ? "border-rose-500 focus-visible:ring-rose-500 dark:border-rose-500"
        : isValid
          ? "border-emerald-500 focus-visible:ring-emerald-500 dark:border-emerald-500"
          : "border-slate-200 focus-visible:ring-violet-600 dark:border-[#444]",
      "dark:bg-[#3a3a3a]",
      baseClassName,
    ]
      .filter(Boolean)
      .join(" ");
  };

  const getTriggerClassName = () => {
    const hasError = !!formik.touched.gender && !!formik.errors.gender;
    const isValid =
      !!formik.touched.gender &&
      !formik.errors.gender &&
      !!formik.values.gender;

    return [
      "rounded-2xl py-6 transition-all",
      "focus:ring-1",
      hasError
        ? "border-rose-500 focus:ring-rose-500 dark:border-rose-500"
        : isValid
          ? "border-emerald-500 focus:ring-emerald-500 dark:border-emerald-500"
          : "border-slate-200 dark:border-[#444]",
      "dark:bg-[#3a3a3a]",
    ]
      .filter(Boolean)
      .join(" ");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="
          flex max-h-[90vh]
          w-[95vw] max-w-[95vw]
          sm:max-w-2xl
          flex-col overflow-hidden
          rounded-[2rem]
          border border-white/70
          bg-white p-0 shadow-2xl
          dark:border-[#444] dark:bg-[#333]
        "
      >
        <div className="relative z-10 shrink-0 border-b border-slate-100 bg-white/95 px-6 py-6 backdrop-blur dark:border-[#444] dark:bg-[#333]/95 sm:px-8 sm:py-7">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Create User
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-sm text-slate-500 dark:text-[#ccc]">
              Fill in the profile information for the new user.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <CreateUserForm
            formik={formik}
            imagePreview={imagePreview}
            handleFileChange={handleFileChange}
            getFieldClassName={getFieldClassName}
            getTriggerClassName={getTriggerClassName}
            isOpen={isOpen}
          />

          <div className="relative z-10 shrink-0 border-t border-slate-100 bg-slate-50/80 px-6 py-5 backdrop-blur dark:border-[#444] dark:bg-[#3a3a3a]/80 sm:px-8">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                className="rounded-2xl px-6 py-6 dark:text-white"
                disabled={formik.isSubmitting || createUserMutation.isPending}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={formik.isSubmitting || createUserMutation.isPending}
                className="cursor-pointer rounded-2xl bg-violet-600 px-8 py-6 text-white hover:bg-violet-700"
              >
                {formik.isSubmitting || createUserMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create User"
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
