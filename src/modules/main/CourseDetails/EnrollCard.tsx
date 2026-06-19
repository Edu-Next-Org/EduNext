"use client";

import Image from "next/image";
import React, { useState, useTransition } from "react";
import { BookOpenText } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addCourseToWishlist } from "@/core/services/api/post/addCourseToWishlist";
import { deleteCourseFromWishlist } from "@/core/services/api/delete/deleteCourseFromWishlist";
import api from "@/core/services/api";
import { toast } from "sonner";
import { RequestPayment } from "@/core/services/api/post/requestPayment";
import { useRouter } from "next/navigation";

interface EnrollCardProps {
  courseId: string;
  price: number;
  teacherName?: string;
  teacherImage?: string;
  initialIsFavorite: boolean;
  isPurchased?: boolean;
}

const FALLBACK_AVATAR = "/images/people.png";

export const EnrollCard: React.FC<EnrollCardProps> = ({
  courseId,
  price,
  teacherName = "",
  teacherImage = "",
  initialIsFavorite,
  isPurchased = false,
}) => {
  const queryClient = useQueryClient();
  const [hasError, setHasError] = useState(false);
  const [prevTeacherImage, setPrevTeacherImage] = useState(teacherImage);

  const [isPendingPayment, startPaymentTransition] = useTransition();

  const router = useRouter();

  if (teacherImage !== prevTeacherImage) {
    setPrevTeacherImage(teacherImage);
    setHasError(false);
  }

  const imgSrc = hasError || !teacherImage ? FALLBACK_AVATAR : teacherImage;

  const { data: isFavorite } = useQuery({
    queryKey: ["courseFavorite", courseId],
    queryFn: async () => {
      const res = await api.get(`/courses/${courseId}`);
      return res.data.data.isFavorite as boolean;
    },
    initialData: initialIsFavorite,
    staleTime: 0,
  });

  const addMutation = useMutation({
    mutationFn: () => addCourseToWishlist(courseId),
    onSuccess: () => {
      queryClient.setQueryData(["courseFavorite", courseId], true);
      toast.success("Course added to wishlist");
    },
    onError: (err: unknown) => {
      const errorResponse = err as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        errorResponse?.response?.data?.message || "Failed to add wishlist",
      );
    },
  });

  const removeMutation = useMutation({
    mutationFn: () => deleteCourseFromWishlist(courseId),
    onSuccess: () => {
      queryClient.setQueryData(["courseFavorite", courseId], false);
      toast.success("Removed from wishlist");
    },
    onError: (err: unknown) => {
      const errorResponse = err as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        errorResponse?.response?.data?.message ||
          "Failed to remove from wishlist",
      );
    },
  });

  const toggleWishlist = () => {
    if (addMutation.isPending || removeMutation.isPending) return;

    if (isFavorite) {
      removeMutation.mutate();
    } else {
      addMutation.mutate();
    }
  };

  const handleBuyNow = () => {
    startPaymentTransition(async () => {
      try {
        const paymentUrl = await RequestPayment(courseId);

        if (paymentUrl) {
          router.push(paymentUrl);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error(
            "An unexpected error occurred while connecting to the payment gateway.",
          );
        }
      }
    });
  };

  return (
    <div className="bg-gradient-to-b from-[#644DB3] to-[#5B48AC] text-white p-6 rounded-3xl shadow-xl font-sans dark:bg-none dark:bg-[#333]">
      <div className="flex flex-col items-center mb-4">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 mb-3 relative bg-gray-200 dark:bg-[#444]">
          <Image
            src={imgSrc}
            alt={teacherName}
            fill
            className="object-cover bg-[#ccc]"
            onError={() => setHasError(true)}
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
          </div>

          <button
            onClick={toggleWishlist}
            disabled={addMutation.isPending || removeMutation.isPending}
            className={`text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              isFavorite
                ? "text-red-500 hover:text-red-600"
                : "text-gray-500 hover:!text-[#5B48AC] dark:text-[#898989]"
            }`}
          >
            {isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>
        </div>

        {isPurchased ? (
          <div className="w-full text-sm py-3 text-center font-medium rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-[#555] text-gray-600 dark:text-gray-300 cursor-default">
            You have already purchased this course
          </div>
        ) : (
          <button
            onClick={handleBuyNow}
            disabled={isPendingPayment}
            className={`w-full bg-gradient-to-b from-[#644DB3] to-[#5B48AC] dark:bg-none dark:bg-[#644DB3] cursor-pointer text-white py-3 rounded-xl font-medium transition-all ${
              isPendingPayment
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-opacity-90 active:scale-95"
            }`}
          >
            {isPendingPayment ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              "Buy Now"
            )}
          </button>
        )}
      </div>
    </div>
  );
};
