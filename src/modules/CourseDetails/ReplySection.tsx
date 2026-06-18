import CreateReplyModal from "./CreateReplyModal";
import GetReplys from "./GetReplys";

interface ReplySectionProps {
  commentId: string;
  courseId: string;
}

export default function ReplySection({
  commentId,
  courseId,
}: ReplySectionProps) {
  return (
    <div className="w-full mt-3 flex items-center justify-between px-2">
      <CreateReplyModal courseId={courseId} commentId={commentId} />
      <GetReplys commentId={commentId} />
    </div>
  );
}
