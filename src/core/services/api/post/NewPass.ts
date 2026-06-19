// import { INewPass } from "@/modules/ResetPass/Components/NewPasswordForm";
// import { BaseUrl } from "@/Utils/URL";
// import axios from "axios";
// import { z } from "zod";
// const UpsertValidation = (payload: INewPass) => {
//   const validationSchema = z
//     .object({
//       password: z.string().min(4, "must be at list 4 characters"),
//       confirmPassword: z.string().min(4, "must be at list 4 characters"),
//     })
//     .refine((data) => data.confirmPassword === data.password, {
//       path: ["confirmPassword"],
//       message: "Passwords don't match",
//     });
//   const result = validationSchema.safeParse(payload);
//   if (!result.success) {
//     const error: Record<string, string> = {};
//     result.error.issues.forEach((err) => {
//       error[err.path[0] as string] = err.message;
//     });
//     return error;
//   }
//   return null;
// };

// export const PostNewPass = async (
//   prevData: {
//     data: INewPass;
//     error: Record<string, string> | null;
//   },
//   formData: FormData,
// ) => {
//   const payload = {
//     token: formData.get("token"),
//     password: formData.get("password"),
//     confirmPassword: formData.get("confirmPassword"),
//   } as INewPass;
//   const error = UpsertValidation(payload);
//   if (error) {
//     return { data: prevData.data, error };
//   }
//   try {
//     const finalPayload = {
//       password: payload.password,
//       token: payload.token,
//     } as INewPass;
//     const result = await axios.post(
//       `${BaseUrl}/auth/reset-password`,
//       finalPayload,
//     );
//     console.log("data :", result.data);

//     return { data: result.data, error };
//   } catch (e) {
//     return {
//       data: prevData.data,
//       error: {
//         message: "somthing went wrong !",
//       },
//     };
//   }
// };
import { INewPass } from "@/modules/auth/ResetPass/Components/NewPasswordForm";
import axios from "axios";
import { z } from "zod";

const UpsertValidation = (payload: INewPass) => {
  const validationSchema = z
    .object({
      password: z.string().min(4, "must be at list 4 characters"),
      confirmPassword: z.string().min(4, "must be at list 4 characters"),
    })
    .refine((data) => data.confirmPassword === data.password, {
      path: ["confirmPassword"],
      message: "Passwords don't match",
    });
  const result = validationSchema.safeParse(payload);
  if (!result.success) {
    const error: Record<string, string> = {};
    result.error.issues.forEach((err) => {
      error[err.path[0] as string] = err.message;
    });
    return error;
  }
  return null;
};

export const PostNewPass = async (
  prevData: { data: INewPass; error: Record<string, string> | null },
  formData: FormData,
) => {
  const payload = {
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  } as INewPass;
  const error = UpsertValidation(payload);
  if (error) return { data: prevData.data, error };

  const isServer = typeof window === "undefined";
  const API_BASE = isServer ? "https://edunext-api.onrender.com/api" : "/api";

  try {
    const finalPayload = {
      password: payload.password,
      token: payload.token,
    } as INewPass;
    const result = await axios.post(
      `${API_BASE}/auth/reset-password`,
      finalPayload,
    );
    return { data: result.data, error };
  } catch (e) {
    return { data: prevData.data, error: { message: "somthing went wrong !" } };
  }
};
