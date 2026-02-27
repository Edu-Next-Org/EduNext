import { BaseUrl } from "@/Utils/URL";
import axios from "axios";

export interface IUploadImgRes {
  status: string;
  message: string;
  data: Data;
}

export interface Data {
  user: User;
}

export interface User {
  _id: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  about: string;
  birthday: string;
  gender: string;
  phoneNumber: string;
  name: string;
  passwordResetExpires: string;
  passwordResetToken: string;
  purchasedCourses: string[];
  profileImage: string;
  profileImagePublicId: string;
}

export const addProfileImage = async (
  imageFile: File,
): Promise<IUploadImgRes | null> => {
  const res = await axios.post(
    `${BaseUrl}/user-panel/profile-image`,
    imageFile,
  );
  if (res.status !== 200) {
    throw new Error(res.data?.message || "Delete failed");
  }
  if (!res.data) {
    throw new Error("somthing went wrong !");
  }
  const result = res.data;
  return result;
};
