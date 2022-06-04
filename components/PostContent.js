import Link from "next/link";
import MarkdownPreview from "./MarkdownPreview";
import format from "date-fns/format";

// UI component for main post content
export default function PostContent({ post }) {
  let createdAt =
    typeof post?.createdAt === "number"
      ? new Date(post.createdAt)
      : post.createdAt.toDate();

  createdAt = format(createdAt, "eeee MMM dd, yyyy");

  return (
    <div className="card">
      <h1>{post?.title}</h1>
      <span className="text-sm">
        Written by{" "}
        <Link href={`/${post.username}/`}>
          <a className="text-info">@{post.username}</a>
        </Link>{" "}
        on {createdAt}
      </span>
      <MarkdownPreview content={post?.content} />
    </div>
  );
}
