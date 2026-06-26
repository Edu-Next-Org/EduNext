import { CommentsManagement } from "@/modules/panels/admin/components/comments-management/comments-management";
import { getAllComments } from "@/core/services/api/Get/GetAllCommentAdmin";
import { getAllCoursesAdmin } from "@/core/services/api/Get/GetAllCoursesAdmin";
import {
  getReplyCommentAdmin,
  MappedReply,
} from "@/core/services/api/Get/GetReplyCommentAdmin";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;

  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search;
  const status = resolvedSearchParams.status;
  const courseId = resolvedSearchParams.courseId;

  const commentsData = await getAllComments({
    page,
    limit: 10,
    search,
    status,
    courseId,
  });

  const coursesData = await getAllCoursesAdmin({ limit: 100 });

  const repliesPromises = commentsData.comments.map(async (comment) => {
    const replies = await getReplyCommentAdmin(comment.id);
    return { commentId: comment.id, replies };
  });

  const repliesResults = await Promise.all(repliesPromises);

  const repliesRecord: Record<string, MappedReply[]> = {};
  repliesResults.forEach((item) => {
    repliesRecord[item.commentId] = item.replies;
  });

  return (
    <CommentsManagement
      comments={commentsData.comments}
      meta={commentsData.meta}
      courses={coursesData.courses}
      repliesRecord={repliesRecord}
    />
  );
}
