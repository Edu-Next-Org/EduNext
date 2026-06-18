"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { getCommentReply } from "@/core/services/api/Get/getCommentReply";
import Empty from "@/assets/Lottie/Empty.json";
import Lottie from "lottie-react";

const DEFAULT_AVATAR = "/images/people.png";

interface ReplyAvatarProps {
  name: string;
  profileImage: string | null;
}

function ReplyAvatar({ name, profileImage }: ReplyAvatarProps) {
  const [src, setSrc] = useState<string>(profileImage ?? DEFAULT_AVATAR);

  return (
    <Image
      src={src}
      alt={name}
      width={44}
      height={44}
      className="rounded-full mt-7 object-cover dark:bg-[#ccc]"
      onError={() => setSrc(DEFAULT_AVATAR)}
    />
  );
}

interface GetReplysProps {
  commentId: string;
}

export default function GetReplys({ commentId }: GetReplysProps) {
  const [isAnswersOpen, setIsAnswersOpen] = useState(false);

  const { data: replies = [], isLoading } = useQuery({
    queryKey: ["replies", commentId],
    queryFn: () => getCommentReply(commentId),
    enabled: !!commentId,
  });

  return (
    <Dialog open={isAnswersOpen} onOpenChange={setIsAnswersOpen}>
      <DialogTrigger asChild>
        <button className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer transition-colors">
          {isLoading ? "Loading..." : `Answers (${replies.length})`}
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col p-0 overflow-hidden dark:bg-[#1e1e1e]">
        <DialogHeader className="p-6 border-b dark:border-gray-700">
          <DialogTitle>All Answers</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 w-full">
          <div className="p-6 flex flex-col gap-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-full py-10 dark:text-white">
                Loading answers...
              </div>
            ) : replies.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-10 pt-5 pb-10 text-slate-500 dark:text-[#aaa]">
                <Lottie
                  style={{ width: 200, height: 200 }}
                  animationData={Empty}
                />
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No replies yet. Be the first to reply!
                </p>
              </div>
            ) : (
              replies.map((reply) => (
                <div key={reply._id} className="flex gap-4">
                  <ReplyAvatar
                    name={reply.user.name}
                    profileImage={reply.user.profileImage}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm dark:text-white">
                        {reply.user.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(reply.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-[#252525] p-3 rounded-lg">
                      {reply.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-[#252525] flex justify-end">
          <Button
            variant="ghost"
            onClick={() => setIsAnswersOpen(false)}
            className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
