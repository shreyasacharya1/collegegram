import { useState } from "react";
import { api } from "../lib/api";

type CreatePostProps = {
  askOnly?: boolean;
  onCreated: () => void;
};

export default function CreatePost({ askOnly = false, onCreated }: CreatePostProps) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("guidance");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="space-y-3 rounded-xl border bg-white p-4"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        const fd = new FormData();
        fd.append("text", text.trim());
        fd.append("type", askOnly ? "ask" : "normal");
        if (askOnly) fd.append("askCategory", category);
        if (image) fd.append("image", image);

        setLoading(true);
        try {
          await api.post("/posts", fd);
          setText("");
          setImage(null);
          onCreated();
        } finally {
          setLoading(false);
        }
      }}
    >
      {askOnly && (
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded border px-2 py-2">
          <option value="guidance">Guidance</option>
          <option value="placement">Placement</option>
          <option value="course">Course</option>
          <option value="internship">Internship</option>
          <option value="other">Other</option>
        </select>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={500}
        className="w-full rounded border p-3"
        placeholder={askOnly ? "Ask your question to seniors..." : "Share something about campus life..."}
      />

      {!askOnly && <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />}

      <button disabled={loading} className="rounded bg-black px-4 py-2 text-white disabled:opacity-60">
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
}
