import { post } from "@/hooks/axios";
import { getValueFor, save } from "@/hooks/storage";

const PENDING_COMMENTS_KEY = "pending_comments";

export interface PendingComment {
  id: string;
  postId: string;
  content: string;
  timestamp: number;
  retryCount: number;
}

export const addPendingComment = async (
  comment: Omit<PendingComment, "retryCount" | "timestamp">
): Promise<void> => {
  try {
    const pendingComments = await getPendingComments();
    const newComment: PendingComment = {
      ...comment,
      timestamp: Date.now(),
      retryCount: 0,
    };
    await save(
      PENDING_COMMENTS_KEY,
      JSON.stringify([...pendingComments, newComment])
    );
  } catch (error) {
    console.error("Error adding pending comment:", error);
  }
};

export const getPendingComments = async (): Promise<PendingComment[]> => {
  try {
    const jsonValue = await getValueFor(PENDING_COMMENTS_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error("Error getting pending comments:", error);
    return [];
  }
};

export const removePendingComment = async (
  commentId: string
): Promise<void> => {
  try {
    const pendingComments = await getPendingComments();
    const updatedComments = pendingComments.filter(
      (comment) => comment.id !== commentId
    );
    await save(PENDING_COMMENTS_KEY, JSON.stringify(updatedComments));
  } catch (error) {
    console.error("Error removing pending comment:", error);
  }
};

export const updatePendingComment = async (
  commentId: string,
  updates: Partial<PendingComment>
): Promise<void> => {
  try {
    const pendingComments = await getPendingComments();
    const updatedComments = pendingComments.map((comment) =>
      comment.id === commentId ? { ...comment, ...updates } : comment
    );
    await save(PENDING_COMMENTS_KEY, JSON.stringify(updatedComments));
  } catch (error) {
    console.error("Error updating pending comment:", error);
  }
};

export const retryPendingComments = async (): Promise<void> => {
  const pendingComments = await getPendingComments();
  const now = Date.now();
  const RETRY_DELAY = 60000; // 1 minute

  for (const comment of pendingComments) {
    // Only retry if it's been long enough since the last attempt
    if (now - comment.timestamp > RETRY_DELAY) {
      try {
        await post("comments/create/" + comment.postId, {
          content: comment.content,
        });
        await removePendingComment(comment.id);

        // For now, just update the timestamp and retry count
        await updatePendingComment(comment.id, {
          timestamp: now,
          retryCount: comment.retryCount + 1,
        });
      } catch (error) {
        console.error(`Failed to retry comment ${comment.id}:`, error);
      }
    }
  }
};
