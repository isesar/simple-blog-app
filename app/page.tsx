
"use client"

import Link from "next/link";
import { useBlog } from "@/components/BlogContext";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { posts, deletePost } = useBlog();

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Latest Posts</h1>
        <Button asChild>
          <Link href="/posts/new">New Post</Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="border rounded-xl p-8 text-center text-muted-foreground">
          <p className="mb-4">No posts yet. Create your first blog post.</p>
          <Button asChild>
            <Link href="/posts/new">Create Post</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onDelete={(id) => deletePost(id)} />
          ))}
        </div>
      )}
    </main>
  );
}
