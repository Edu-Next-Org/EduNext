// import { IEmail } from "@/modules/ResetPass/Components/form";
// import { BaseUrl } from "@/Utils/URL";
// import axios from "axios";
// import { z } from "zod";
// const upsertValidation = (email: string) => {
//   const validationschema = z.object({
//     email: z.string().email("email is not valid"),
//   });
//   const result = validationschema.safeParse({ email });
//   if (!result.success) {
//     const error: Record<string, string> = {};
//     result.error.issues.forEach((err) => {
//       error[err.path[0] as string] = err.message;
//     });
//     return error;
//   }
//   return null;
// };
// export const PostForgotPass = async (
//   prevData: {
//     data: IEmail | null;
//     error: Record<string, string> | null;
//   },
//   formData: FormData,
// ) => {
//   const email = formData.get("email") as string;

//   const error = upsertValidation(email);
//   if (error) {
//     return { data: prevData.data, error };
//   }
//   try {
//     const result = await axios.post(`${BaseUrl}/auth/forgot-password`, {
//       email,
//     });
//     return { data: result.data, error: null };
//   } catch (e) {
//     return {
//       data: null,
//       error: { server: "Something went wrong" },
//     };
//   }
// };
import { IEmail } from "@/modules/ResetPass/Components/form";
import axios from "axios";
import { z } from "zod";

const upsertValidation = (email: string) => {
  const validationschema = z.object({ email: z.string().email("email is not valid"), });
  const result = validationschema.safeParse({ email });
  if (!result.success) {
    const error: Record<string, string> = {};
    result.error.issues.forEach((err) => { error[err.path[0] as string] = err.message; });
    return error;
  }
  return null;
};

export const PostForgotPass = async (
  prevData: { data: IEmail | null; error: Record<string, string> | null; },
  formData: FormData,
) => {
  const email = formData.get("email") as string;
  const error = upsertValidation(email);
  if (error) return { data: prevData.data, error };

  const isServer = typeof window === "undefined";
  const API_BASE = isServer ? "https://edunext-api.onrender.com/api" : "/api";

  try {
    const result = await axios.post(`${API_BASE}/auth/forgot-password`, { email });
    return { data: result.data, error: null };
  } catch (e) {
    return { data: null, error: { server: "Something went wrong" } };
  }
};