"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Trash } from "lucide-react";
import React, { useState } from "react";
import UploadImageModal from "./UploadImageModal";
import DeleteImageModal from "./DeleteImageModal";

const UserImage = ({ imageAdd }: { imageAdd: string | null }) => {
  const [image, setImage] = useState<string>(imageAdd || "/images/NoImage.png");

  const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);
  const handleCloseUpload = () => {
    setOpenUploadModal(false);
  };
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const handleCloseDelete = () => {
    setOpenDeleteModal(false);
  };
  return (
    <div className="pb-3">
      <div className="relative w-24 h-24 mx-auto  ">
        <Avatar className="w-24 h-24 border-4 border-indigo-100 dark:border-indigo-900/30 ">
          <AvatarImage src={imageAdd || "/images/NoImage.png"} />
          <AvatarFallback>no image</AvatarFallback>
        </Avatar>
        <Camera
          onClick={() => setOpenUploadModal(true)}
          className="absolute bottom-0 right-[-8px] cursor-pointer"
        />
        <Trash
          onClick={() => setOpenDeleteModal(true)}
          className="absolute bottom-0 left-[-8px] rounded-full cursor-pointer  "
        />
      </div>
      <UploadImageModal open={openUploadModal} onClose={handleCloseUpload} />
      <DeleteImageModal open={openDeleteModal} onClose={handleCloseDelete} />
    </div>
  );
};

export default UserImage;
