"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IUser, IUserInfo } from "@/core/services/api/Get/GetUserInfo";
import { UpdateUserInfo } from "@/core/services/api/put/UpdateUserInfo";
import {
  BookOpen,
  Calendar,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
} from "lucide-react";
import { ChangeEvent, useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

const UserInfoForm = ({ userInfo }: { userInfo: IUser | null }) => {
  const [image, setImage] = useState<string>(
    userInfo?.profileImage || "/images/NoImage.png",
  );

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };
  const handleImageDelete = () => {
    setImage("/images/NoImage.png");
  };
  const [state, action, isPending] = useActionState<
    {
      data: IUser | null;
      message: string | null;
      hasError: boolean;
    },
    FormData
  >(UpdateUserInfo, { data: userInfo ?? null, message: null, hasError: false });
  const { data, message, hasError } = state;

  useEffect(() => {
    if (!message) return;

    if (hasError) {
      toast.error(message);
    } else {
      toast.success(message);
    }
  }, [message, hasError]);
  return (
    <form action={action} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="text-sm font-medium flex items-center gap-2"
          >
            <User className="w-4 h-4 text-gray-400" />
            Full Name
          </Label>
          <Input
            id="name"
            name="name"
            defaultValue={data?.name || ""}
            placeholder="Enter your full name"
            className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-sm font-medium flex items-center gap-2"
          >
            <Mail className="w-4 h-4 text-gray-400" />
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={data?.email || ""}
            placeholder="Enter your email"
            className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="phoneNumber"
            className="text-sm font-medium flex items-center gap-2"
          >
            <Phone className="w-4 h-4 text-gray-400" />
            Phone Number
          </Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            defaultValue={data?.phoneNumber || ""}
            placeholder="Enter your phone number"
            className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            Birthday
          </Label>
          <Input
            defaultValue={data?.birthday || "no information"}
            readOnly
            className="bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            Gender
          </Label>

          <Input
            defaultValue={data?.gender || "no information"}
            readOnly
            className="bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="about"
          className="text-sm font-medium flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4 text-gray-400" />
          About Me
        </Label>
        <Textarea
          id="about"
          name="about"
          defaultValue={data?.about || ""}
          placeholder="Tell us about yourself..."
          rows={4}
          className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 resize-none"
        />
      </div>
      <div className="w-full flex justify-center">
        <Button
          type="submit"
          disabled={isPending}
          className=" bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700
         text-white "
        >
          <Save className="w-4 h-4 mr-2" />
          {isPending ? "Saving...." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default UserInfoForm;
