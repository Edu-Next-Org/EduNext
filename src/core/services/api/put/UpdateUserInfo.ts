import { BaseUrl } from "@/Utils/URL";
import { IUser, IUserInfo } from "../Get/GetUserInfo";

export const UpdateUserInfo = async (
  prevData: { data: IUser | null; message: string | null; hasError: boolean },
  formData: FormData,
) => {
  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    phoneNumber: formData.get("phoneNumber"),
    about: formData.get("about"),
  };
  const res = await fetch(`${BaseUrl}/user-panel/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    return {
      data: prevData.data,
      message: "something went wrong !cant update",
      hasError: true,
    };
  }
  const result = (await res.json()) as IUserInfo;
  return {
    data: result.user,
    message: "updated successfully",
    hasError: false,
  };
};
