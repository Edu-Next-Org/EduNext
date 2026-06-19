"use client";

import { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  createUser,
  type CreateUserPayload,
} from "@/core/services/api/post/CreateUser";
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
import Image from "next/image";

type CreateUserData = CreateUserPayload;

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

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

  const formatBirthdayValue = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const parseBirthdayValue = (value: string) => {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

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
          <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
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
                <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-slate-100 shadow-sm dark:border-[#444]">
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
                  Add Profile Picture
                </span>
              </motion.div>

              <motion.div variants={sectionVariants} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2.5">
                    <Label className="flex items-center gap-2 text-slate-700 dark:text-[#eee]">
                      <User className="h-4 w-4" />
                      Full Name
                    </Label>
                    <Input
                      name="name"
                      value={formik.values.name ?? ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="John Doe"
                      className={getFieldClassName("name")}
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <p className="text-sm text-rose-500">
                        {formik.errors.name}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-2.5">
                    <Label className="flex items-center gap-2 text-slate-700 dark:text-[#eee]">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </Label>
                    <Input
                      name="email"
                      type="email"
                      value={formik.values.email ?? ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="example@email.com"
                      className={getFieldClassName("email")}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <p className="text-sm text-rose-500">
                        {formik.errors.email}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2.5">
                    <Label className="flex items-center gap-2 text-slate-700 dark:text-[#eee]">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      name="phoneNumber"
                      value={formik.values.phoneNumber ?? ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="+1 555 123 4567"
                      className={getFieldClassName("phoneNumber")}
                    />
                    {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                      <p className="text-sm text-rose-500">
                        {formik.errors.phoneNumber}
                      </p>
                    ) : null}
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
                          className={getFieldClassName(
                            "birthday",
                            "w-full justify-start text-left font-normal",
                          )}
                          onBlur={() =>
                            formik.setFieldTouched("birthday", true, false)
                          }
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {formik.values.birthday ? (
                            format(
                              parseBirthdayValue(formik.values.birthday),
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
                            formik.values.birthday
                              ? parseBirthdayValue(formik.values.birthday)
                              : undefined
                          }
                          onSelect={(date) => {
                            formik.setFieldValue(
                              "birthday",
                              date ? formatBirthdayValue(date) : null,
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      name="password"
                      value={formik.values.password ?? ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={getFieldClassName("password")}
                      placeholder="••••••••"
                    />
                    {formik.touched.password && formik.errors.password ? (
                      <p className="text-sm text-rose-500">
                        {formik.errors.password}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-2.5">
                    <Label>Gender</Label>
                    <Select
                      value={formik.values.gender || ""}
                      onValueChange={(val) => {
                        formik.setFieldValue("gender", val);
                        formik.setFieldTouched("gender", true, false);
                      }}
                    >
                      <SelectTrigger className={getTriggerClassName()}>
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label className="flex items-center gap-2 text-slate-700 dark:text-[#eee]">
                    <FileText className="h-4 w-4" />
                    About Me
                  </Label>
                  <Textarea
                    name="about"
                    value={formik.values.about ?? ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Tell us a little about this user..."
                    className={[
                      "min-h-[120px] rounded-2xl py-4 transition-all focus-visible:ring-1",
                      formik.touched.about && formik.errors.about
                        ? "border-rose-500 focus-visible:ring-rose-500 dark:border-rose-500"
                        : formik.touched.about &&
                            !formik.errors.about &&
                            formik.values.about
                          ? "border-emerald-500 focus-visible:ring-emerald-500 dark:border-emerald-500"
                          : "border-slate-200 focus-visible:ring-violet-600 dark:border-[#444]",
                      "dark:bg-[#3a3a3a]",
                    ].join(" ")}
                    maxLength={500}
                  />
                  <div className="flex items-center justify-between gap-3">
                    {formik.touched.about && formik.errors.about ? (
                      <p className="text-sm text-rose-500">
                        {formik.errors.about}
                      </p>
                    ) : (
                      <span />
                    )}
                    <span className="text-xs text-slate-400 dark:text-[#888]">
                      {formik.values.about?.length || 0}/500
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

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
                className=" cursor-pointer rounded-2xl bg-violet-600 px-8 py-6 text-white hover:bg-violet-700"
              >
                {formik.isSubmitting || createUserMutation.isPending ? (
                  <>
                    <Loader2 className=" h-4 w-4 animate-spin" />
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
