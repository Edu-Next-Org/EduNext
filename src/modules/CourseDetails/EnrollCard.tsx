"use client";

import Image from "next/image";
import React, { useState } from "react";
import { BookOpenText, Heart } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { addCourseToWishlist } from "@/core/services/api/post/addCourseToWishlist";
import { deleteCourseFromWishlist } from "@/core/services/api/delete/deleteCourseFromWishlist";
import { toast } from "react-toastify";

interface EnrollCardProps {
  courseId: string;
  price: number;
  teacherName?: string;
  teacherImage?: string;
  initialIsFavorite: boolean;
}

export const EnrollCard: React.FC<EnrollCardProps> = ({
  courseId,
  price,
  teacherName = "",
  teacherImage = "",
  initialIsFavorite,
}) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  const addMutation = useMutation({
    mutationFn: () => addCourseToWishlist(courseId),
    onSuccess: () => {
      toast.success("Course added to wishlist");
    },
    onError: () => {
      setIsFavorite(false);
      toast.error("Failed to add wishlist");
    },
  });

  const removeMutation = useMutation({
    mutationFn: () => deleteCourseFromWishlist(courseId),
    onSuccess: () => {
      toast.success("Removed from wishlist");
    },
    onError: () => {
      setIsFavorite(true);
      toast.error("Failed to remove from wishlist");
    },
  });

  const toggleWishlist = () => {
    if (isFavorite) {
      setIsFavorite(false);
      removeMutation.mutate();
    } else {
      setIsFavorite(true);
      addMutation.mutate();
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#644DB3] to-[#5B48AC] text-white p-6 rounded-3xl shadow-xl font-sans dark:bg-none dark:bg-[#333] max-w-sm">
      <div className="flex flex-col items-center mb-4">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 mb-3 relative">
          <Image
            src={teacherImage}
            alt={teacherName}
            fill
            className="object-cover"
          />
        </div>
        <p className="text-sm text-gray-300">Teacher Name:</p>
        <h4 className="text-lg font-semibold">{teacherName}</h4>
      </div>

      <hr className="border-t border-white/10 my-4" />

      <div className="flex flex-col items-center mb-6 pt-4">
        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 text-2xl">
          <BookOpenText />
        </div>
        <h3 className="text-xl font-bold">Enroll Now</h3>
        <p className="text-gray-400 text-sm mt-1">Start your journey today</p>
      </div>

      <div className="bg-white text-gray-900 p-5 rounded-2xl dark:bg-[#444]">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-3xl font-bold dark:text-[white]">
              ${price}
            </span>
            <div className="h-1.5 w-10 bg-[#644DB3] rounded-full mt-2"></div>
          </div>

          <button
            onClick={toggleWishlist}
            disabled={addMutation.isPending || removeMutation.isPending}
            className={`text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              isFavorite
                ? "text-red-500 hover:text-red-600"
                : "text-gray-500 hover:text-blue-600 dark:text-[#898989]"
            }`}
          >
            {isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>
        </div>

        <button className="w-full bg-gradient-to-b from-[#644DB3] to-[#5B48AC] dark:bg-none dark:bg-[#644DB3] cursor-pointer text-white py-3 rounded-xl font-medium hover:bg-opacity-90 transition-all active:scale-95">
          Buy Now
        </button>
      </div>
    </div>
  );
};
