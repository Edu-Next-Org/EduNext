"use client";

import {
  Mail,
  House,
  Lock,
  Eye,
  EyeOff,
  Facebook,
  Github,
  Linkedin,
  User,
  Moon,
  Sun,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { useTheme } from "@/components/useThemes/useThemes";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  registerUser,
  RegisterPayload,
  RegisterResponse,
} from "@/core/services/api/post/Register";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
};

const RegisterSchema = Yup.object({
  fullName: Yup.string()
    .min(3, "Full name must be at least 3 characters")
    .required("Full name is required"),

  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
});

interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterForm() {
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  // const mutation = useMutation<RegisterResponse, Error, RegisterPayload>({
  //   mutationFn: registerUser,
  //   onSuccess: () => {
  //     toast.success("Account created successfully");
  //     router.push("/auth/login");
  //   },
  //   onError: (error: Error) => {
  //     toast.error(error.message || "Registration failed");
  //   },
  // });

  const mutation = useMutation<RegisterResponse, Error, RegisterPayload>({
    mutationFn: registerUser,
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Account created successfully");
        router.push("/auth/login");
      } else {
        toast.error(data.message || "Registration failed");
      }
    },
    onError: (error) => {
      toast.error(error.message || "An unexpected error occurred");
    },
  });

  const handleSubmit = (
    values: RegisterFormValues,
    { setSubmitting }: FormikHelpers<RegisterFormValues>,
  ) => {
    const payload: RegisterPayload = {
      name: values.fullName,
      email: values.email,
      password: values.password,
    };

    mutation.mutate(payload, {
      onSettled: () => {
        setSubmitting(false);
      },
    });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-[white] shadow-[0_0_12px_4px_#ccc] rounded-2xl w-[95%] h-auto px-5 dark:bg-[#333]  py-8         
      my-5         
      md:w-[70%] 
      md:h-[80%] 
      md:px-15 
      md:py-0
      md:my-0
      dark:shadow-[0_0_20px_4px_#644DB3]
      "
    >
      <motion.div
        variants={itemVariants}
        className="flex justify-between pt-2 md:pt-7 mb-6 md:mb-0"
      >
        <p className="text-[black] font-bold text-[20px] md:text-[25px] dark:text-[white] ">
          Create your account
        </p>

        <Link href="/">
          <House size={30} color="#644DB3" className="mt-1 cursor-pointer" />
        </Link>

        <div
          onClick={toggleTheme}
          className="rounded-full flex items-center justify-center cursor-pointer"
        >
          <Sun
            size={30}
            className="text-orange-400 hidden dark:block transition-colors"
          />
          <Moon
            size={30}
            className="text-slate-700 block dark:hidden transition-colors hover:text-[#644DB3] transition-all duration-100"
          />
        </div>
      </motion.div>

      <Formik
        initialValues={{
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={RegisterSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="w-full relative mt-2 md:mt-5">
            <motion.div
              variants={itemVariants}
              className="w-full relative mb-6  "
            >
              <User
                className="absolute top-2.5 left-4"
                size={22}
                color={
                  errors.fullName && touched.fullName
                    ? "#ef4444c7"
                    : !errors.fullName && touched.fullName
                      ? "#22c55e"
                      : "#b1b1b1ff"
                }
              />

              <Field
                name="fullName"
                type="text"
                placeholder="Full Name"
                className={`border w-full py-2 rounded-md outline-none pl-12 pr-4 md:px-13 ${
                  errors.fullName && touched.fullName
                    ? "border-red-500 text-[#ff0000]"
                    : !errors.fullName && touched.fullName
                      ? "border-green-500"
                      : "border-[#ccc]"
                }`}
              />

              <ErrorMessage
                name="fullName"
                component="p"
                className="text-red-500 text-[13px] absolute top-11 left-1"
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="w-full relative mb-6"
            >
              <Mail
                className="absolute top-2.5 left-4"
                size={22}
                color={
                  errors.email && touched.email
                    ? "#ef4444c7"
                    : !errors.email && touched.email
                      ? "#22c55e"
                      : "#b1b1b1ff"
                }
              />

              <Field
                name="email"
                type="email"
                placeholder="Email Address"
                className={`border w-full py-2 rounded-md outline-none pl-12 pr-4 md:px-13 ${
                  errors.email && touched.email
                    ? "border-red-500 text-[#ff0000]"
                    : !errors.email && touched.email
                      ? "border-green-500"
                      : "border-[#ccc]"
                }`}
              />

              <ErrorMessage
                name="email"
                component="p"
                className="text-red-500 text-[13px] absolute top-11 left-1"
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="w-full relative mb-6"
            >
              <Lock
                className="absolute top-2.5 left-4"
                size={22}
                color={
                  errors.password && touched.password
                    ? "#ef4444c7"
                    : !errors.password && touched.password
                      ? "#22c55e"
                      : "#b1b1b1ff"
                }
              />

              <Field
                name="password"
                type={showPassword2 ? "text" : "password"}
                placeholder="Password"
                className={`border w-full py-2 rounded-md outline-none pl-12 pr-12 md:px-13 ${
                  errors.password && touched.password
                    ? "border-red-500 text-[#ff0000]"
                    : !errors.password && touched.password
                      ? "border-green-500"
                      : "border-[#ccc]"
                }`}
              />

              <div
                className="absolute top-2.5 right-3 cursor-pointer"
                onClick={() => setShowPassword2(!showPassword2)}
              >
                {showPassword2 ? (
                  <EyeOff
                    size={22}
                    color={
                      errors.password && touched.password
                        ? "#ef4444c7"
                        : !errors.password && touched.password
                          ? "#22c55e"
                          : "#b1b1b1ff"
                    }
                  />
                ) : (
                  <Eye
                    size={22}
                    color={
                      errors.password && touched.password
                        ? "#ef4444c7"
                        : !errors.password && touched.password
                          ? "#22c55e"
                          : "#b1b1b1ff"
                    }
                  />
                )}
              </div>

              <ErrorMessage
                name="password"
                component="p"
                className="text-red-500 text-[13px] absolute top-11 left-1"
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="w-full relative mb-6"
            >
              <Lock
                className="absolute top-2.5 left-4"
                size={22}
                color={
                  errors.confirmPassword && touched.confirmPassword
                    ? "#ef4444c7"
                    : !errors.confirmPassword && touched.confirmPassword
                      ? "#22c55e"
                      : "#b1b1b1ff"
                }
              />

              <Field
                name="confirmPassword"
                type={showPassword3 ? "text" : "password"}
                placeholder="Confim Password"
                className={`border w-full py-2 rounded-md outline-none pl-12 pr-12 md:px-13 ${
                  errors.confirmPassword && touched.confirmPassword
                    ? "border-red-500 text-[#ff0000]"
                    : !errors.confirmPassword && touched.confirmPassword
                      ? "border-green-500"
                      : "border-[#ccc]"
                }`}
              />

              <div
                className="absolute top-2.5 right-3 cursor-pointer"
                onClick={() => setShowPassword3(!showPassword3)}
              >
                {showPassword3 ? (
                  <EyeOff
                    size={22}
                    color={
                      errors.confirmPassword && touched.confirmPassword
                        ? "#ef4444c7"
                        : !errors.confirmPassword && touched.confirmPassword
                          ? "#22c55e"
                          : "#b1b1b1ff"
                    }
                  />
                ) : (
                  <Eye
                    size={22}
                    color={
                      errors.confirmPassword && touched.confirmPassword
                        ? "#ef4444c7"
                        : !errors.confirmPassword && touched.confirmPassword
                          ? "#22c55e"
                          : "#b1b1b1ff"
                    }
                  />
                )}
              </div>

              <ErrorMessage
                name="confirmPassword"
                component="p"
                className="text-red-500 text-[13px] absolute top-11 left-1"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                size="lg"
                className="w-full mb-5 border-none outline-none text-white font-semibold cursor-pointer bg-gradient-to-b
              from-[#644DB3]
              to-[#5B48AC]
              hover:from-[#6A52C0]
              hover:to-[#5F4FB8]
              transition-colors duration-200"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin" /> Signing Up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center mt-1 mb-8"
            >
              <span className="flex-grow border-t border-[#ccc]" />
              <span className="mx-4 text-sm text-[#898989]">
                or continue with
              </span>
              <span className="flex-grow border-t border-[#ccc]" />
            </motion.div>

            <motion.ul
              variants={itemVariants}
              className="flex items-center justify-between mt-4"
            >
              <li className="cursor-pointer bg-[#000] p-3 w-[31.3%] hover:scale-[1.06] transition-all duration-200 rounded-sm shadow-lg flex items-center justify-center">
                <Github size={28} color="white" />
              </li>

              <li className=" bg-[#0A66C2] cursor-pointer hover:scale-[1.06] transition-all duration-200 p-3 w-[31.3%] rounded-sm shadow-lg flex items-center justify-center">
                <Facebook size={28} color="white" />
              </li>

              <li className="bg-[#1877F2] cursor-pointer hover:scale-[1.06] transition-all duration-200 p-3 w-[31.3%] rounded-sm shadow-lg flex items-center justify-center">
                <Linkedin size={28} color="white" />
              </li>
            </motion.ul>

            <motion.p
              variants={itemVariants}
              className="text-center text-[#898989] mt-6 pb-4 md:pb-0"
            >
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-[#644DB3] font-semibold cursor-pointer"
              >
                Sign in
              </Link>
            </motion.p>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}
