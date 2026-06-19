import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  Calendar,
  User,
  MapPin,
  BookOpen,
  Save,
} from "lucide-react";
import UserInfoForm from "./UserInfoForm";
import {
  getUserInfo,
  IUser,
  IUserInfo,
} from "@/core/services/api/Get/GetUserInfo";
import UserImage from "./UserImage";

export async function UserInfo() {
  const userData: IUser | null = await getUserInfo();

  return (
    <Card className="border-0 shadow-xl bg-white dark:bg-gray-900 py-4 ">
      <CardHeader className="border-b border-gray-100 dark:border-gray-800">
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-500" />
          Personal Information
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4">
        <UserImage imageAdd={userData?.profileImage ?? null} />
        <UserInfoForm userInfo={userData} />
      </CardContent>
    </Card>
  );
}
