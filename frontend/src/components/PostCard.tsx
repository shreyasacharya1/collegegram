import { useMemo, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../state/auth";

type PostCardProps = {
  post: any;
  onRefresh: () => void;
};

export default function PostCard({ post, onRefresh }: PostCardProps) {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");

  const liked = post.likes.some((id: string) => id === user?._id);

  const sortedComments = useMemo(() => {
    if (post.type !== "ask") return post.comments;
    return [...post.comments].sort((a: any, b: any) => b.upvotes.length - a.upvotes.length);
  }, [post.comments, post.type]);

  return (
    <article className="space-y-3 rounded-xl border bg-white p-4">
      <div className="text-sm">
        <div className="font-semibold">
          {post.author.fullName} {post.author.yearOfStudy >= 3 ? "• Senior" : ""}
        </div>
        <div className="text-gray-500">{post.author.collegeName} • {post.author.branch}</div>
      </div>

      {post.type === "ask" && <div className="inline-block rounded bg-blue-100 px-2 py-1 text-xs">Ask Seniors • {post.askCategory}</div>}

      <p>{post.text}</p>
      {post.imageUrl && <img src={post.imageUrl} alt="post" className="max-h-96 w-full rounded-lg object-cover" />}

      <div className="flex gap-3 text-sm">
        <button onClick={async () => { await api.post(`/posts/${post._id}/like-toggle`); onRefresh(); }}>
          {liked ? "Unlike" : "Like"} ({post.likes.length})
        </button>

        {post.author._id === user?._id && (
          <button className="text-red-600" onClick={async () => { await api.delete(`/posts/${post._id}`); onRefresh(); }}>
            Delete
          </button>
        )}
      </div>

      <div className="space-y-2">
        {sortedComments.map((comment: any) => (
          <div key={comment._id} className="flex justify-between gap-3 border-t pt-2 text-sm">
            <div>
              <b>{comment.author?.fullName || "User"}</b>: {comment.text}
              {post.type === "ask" && (
                <button className="ml-2 text-blue-600" onClick={async () => { await api.post(`/posts/${post._id}/comments/${comment._id}/upvote-toggle`); onRefresh(); }}>
                  Upvote ({comment.upvotes.length})
                </button>
              )}
            </div>

            {comment.author?._id === user?._id && (
              <button className="text-red-600" onClick={async () => { await api.delete(`/posts/${post._id}/comments/${comment._id}`); onRefresh(); }}>
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      <form
        className="flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const trimmed = commentText.trim();
          if (!trimmed) return;
          await api.post(`/posts/${post._id}/comments`, { text: trimmed });
          setCommentText("");
          onRefresh();
        }}
      >
        <input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          maxLength={300}
          placeholder="Add a comment"
          className="flex-1 rounded border px-3 py-2"
        />
        <button className="rounded bg-black px-3 text-white">Post</button>
      </form>
    </article>
  );
}
