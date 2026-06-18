"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { motion, Variants } from "framer-motion";
import {
  Mail,
  House,
  Lock,
  Facebook,
  Github,
  Linkedin,
  EyeOff,
  Eye,
  Sun,
  Moon,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/useThemes/useThemes";
import { toast } from "sonner";

import {
  loginUser,
  LoginPayload,
  LoginResponse,
} from "@/core/services/api/post/Login";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
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

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { toggleTheme } = useTheme();
  const router = useRouter();

  const mutation = useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Welcome back!");
        router.push("/");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Error: Invalid credentials");
    },
  });

  const handleSubmit = (
    values: LoginPayload,
    { setSubmitting }: FormikHelpers<LoginPayload>,
  ) => {
    mutation.mutate(values, {
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
      className="bg-[white] shadow-[0_0_12px_4px_#ccc] rounded-2xl w-[95%] h-auto px-5 py-8 my-5 md:w-[70%] md:h-[75%] md:px-15 md:py-0 md:my-0 dark:bg-[#333] dark:shadow-[0_0_20px_4px_#644DB3]"
    >
      <motion.div
        variants={itemVariants}
        className="flex justify-between pt-2 md:pt-7 mb-6 md:mb-0"
      >
        <p className="text-[black] font-bold text-[22px] md:text-[25px] dark:text-[white]">
          Sign in to EduNext
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
            className="text-slate-700 block dark:hidden hover:text-[#644DB3] transition-all duration-100"
          />
        </div>
      </motion.div>

      <Formik<LoginPayload>
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="w-full relative mt-2 md:mt-5">
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
                placeholder="Enter your email"
                className={`border w-full py-2 rounded-md outline-none pl-12 pr-4 md:px-13 dark:bg-transparent dark:text-white transition-colors ${
                  errors.email && touched.email
                    ? "border-red-500 text-red-500"
                    : !errors.email && touched.email
                      ? "border-green-500"
                      : "border-[#ccc] focus:border-[#644DB3]"
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
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`border w-full py-2 rounded-md outline-none pl-12 pr-12 md:px-13 dark:bg-transparent dark:text-white transition-colors ${
                  errors.password && touched.password
                    ? "border-red-500 text-red-500"
                    : !errors.password && touched.password
                      ? "border-green-500"
                      : "border-[#ccc] focus:border-[#644DB3]"
                }`}
              />
              <div
                className="absolute top-2.5 right-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={22} color="#b1b1b1ff" />
                ) : (
                  <Eye size={22} color="#b1b1b1ff" />
                )}
              </div>
              <ErrorMessage
                name="password"
                component="p"
                className="text-red-500 text-[13px] absolute top-11 left-1"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                size="lg"
                disabled={mutation.isPending}
                className={`w-full mb-5 bg-gradient-to-b from-[#644DB3] to-[#5B48AC] text-white flex gap-2 items-center justify-center transition-all ${
                  mutation.isPending
                    ? "opacity-70 cursor-not-allowed"
                    : "cursor-pointer hover:shadow-lg hover:shadow-[#644DB3]/30"
                }`}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin" /> Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-start text-[#644DB3] cursor-pointer hover:underline text-sm mb-6"
            >
              Forgot Password?
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex items-center mb-8"
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
              <li className="cursor-pointer bg-[#000] p-3 w-[31.3%] rounded-sm flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                <Github size={28} color="white" />
              </li>
              <li className="bg-[#0A66C2] cursor-pointer p-3 w-[31.3%] rounded-sm flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                <Facebook size={28} color="white" />
              </li>
              <li className="bg-[#1877F2] cursor-pointer p-3 w-[31.3%] rounded-sm flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                <Linkedin size={28} color="white" />
              </li>
            </motion.ul>

            <motion.p
              variants={itemVariants}
              className="text-center text-[#898989] mt-8 md:mt-12 text-sm"
            >
              Dont have an account?{" "}
              <Link
                href="/register"
                className="text-[#644DB3] font-semibold hover:underline"
              >
                Sign Up
              </Link>
            </motion.p>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}
