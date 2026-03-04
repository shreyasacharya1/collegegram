import { useEffect, useState } from "react";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import { api } from "../lib/api";

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([]);

  const load = async () => {
    const { data } = await api.get("/posts/feed");
    setPosts(data);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="mx-auto max-w-2xl space-y-4 p-4">
      <CreatePost onCreated={load} />
      {posts.map((post) => <PostCard key={post._id} post={post} onRefresh={load} />)}
    </main>
  );
}
