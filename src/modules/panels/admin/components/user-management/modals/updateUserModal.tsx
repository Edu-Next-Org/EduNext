"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { format, isValid, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import { motion, type Variants } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  CalendarDays,
  FileText,
  Camera,
  UserCircle,
  Loader2,
} from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  updateUser,
  type UpdateUserPayload,
} from "@/core/services/api/put/UpdateUser";
import Image from "next/image";

type UpdateUserFormValues = {
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  birthday: string;
  about: string;
  profileImage: File | null;
};

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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

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

        <form
          onSubmit={formik.handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 overflow-y-auto px-8 py-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isOpen ? "show" : "hidden"}
              className="space-y-12"
            >
              <motion.div
                variants={sectionVariants}
                className="flex flex-col items-center gap-4"
              >
                <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-slate-100 dark:border-[#444] shadow-sm">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <UserCircle className="h-full w-full text-slate-300 dark:text-[#555]" />
                  )}
                  <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100">
                    <Camera className="h-8 w-8 text-white" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.currentTarget.files?.[0] ?? null;
                        handleFileChange(file);
                      }}
                    />
                  </label>
                </div>
                <span className="text-sm text-slate-500 dark:text-[#898989]">
                  Change Profile Picture
                </span>
              </motion.div>

              <motion.div variants={sectionVariants} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label className="text-slate-700 dark:text-[#eee]">
                      <User className="mr-2 h-4 w-4" />
                      Full Name
                    </Label>
                    <Input
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="rounded-2xl py-6 dark:bg-[#3a3a3a]"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-slate-700 dark:text-[#eee]">
                      <Mail className="mr-2 h-4 w-4" />
                      Email Address
                    </Label>
                    <Input
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="rounded-2xl py-6 dark:bg-[#3a3a3a]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label className="text-slate-700 dark:text-[#eee]">
                      <Phone className="mr-2 h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      name="phoneNumber"
                      value={formik.values.phoneNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="rounded-2xl py-6 dark:bg-[#3a3a3a]"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="flex items-center gap-2 text-slate-700 dark:text-[#eee]">
                      <CalendarDays className="h-4 w-4" />
                      Birthday
                    </Label>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start rounded-2xl py-6 text-left font-normal dark:bg-[#3a3a3a]"
                          onBlur={() =>
                            formik.setFieldTouched("birthday", true, false)
                          }
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {formik.values.birthday &&
                          parseBirthdayValue(formik.values.birthday) ? (
                            format(
                              parseBirthdayValue(formik.values.birthday)!,
                              "PPP",
                              {
                                locale: enUS,
                              },
                            )
                          ) : (
                            <span className="text-slate-400 dark:text-[#888]">
                              Select birthday
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent
                        align="start"
                        className="w-auto rounded-2xl border border-slate-200 p-0 shadow-xl dark:border-[#444] dark:bg-[#333]"
                      >
                        <Calendar
                          mode="single"
                          locale={enUS}
                          selected={
                            parseBirthdayValue(formik.values.birthday) ??
                            undefined
                          }
                          onSelect={(date) => {
                            formik.setFieldValue(
                              "birthday",
                              date ? formatBirthdayValue(date) : "",
                            );
                            formik.setFieldTouched("birthday", true, false);
                          }}
                          disabled={(date) => date > new Date()}
                        />
                      </PopoverContent>
                    </Popover>

                    {formik.touched.birthday && formik.errors.birthday ? (
                      <p className="text-sm text-rose-500">
                        {formik.errors.birthday as string}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label className="text-slate-700 dark:text-[#eee]">
                    Gender
                  </Label>
                  <Select
                    value={formik.values.gender}
                    onValueChange={(val) => {
                      formik.setFieldValue("gender", val);
                      formik.setFieldTouched("gender", true, false);
                    }}
                  >
                    <SelectTrigger className="rounded-2xl py-6 dark:bg-[#3a3a3a]">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl dark:bg-[#3a3a3a]">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2.5">
                  <Label className="text-slate-700 dark:text-[#eee]">
                    <FileText className="mr-2 h-4 w-4" />
                    About Me
                  </Label>
                  <Textarea
                    name="about"
                    value={formik.values.about}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="min-h-[120px] rounded-2xl py-4 dark:bg-[#3a3a3a]"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>

          <div className="relative z-10 shrink-0 border-t border-slate-100 bg-slate-50/80 px-8 py-5 backdrop-blur dark:border-[#444] dark:bg-[#3a3a3a]/80">
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="rounded-2xl px-6 py-6 dark:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={formik.isSubmitting || updateUserMutation.isPending}
                className=" cursor-pointer rounded-2xl bg-violet-600 px-8 py-6 text-white hover:bg-violet-700"
              >
                {formik.isSubmitting || updateUserMutation.isPending ? (
                  <>
                    <Loader2 className=" h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
