import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../state/auth";

export default function ProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [profile, setProfile] = useState<any>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const loadProfile = async () => {
    if (!id) return;
    const { data } = await api.get(`/users/${id}`);
    setProfile(data);
  };

  useEffect(() => {
    loadProfile();
  }, [id]);

  const followingIds = useMemo(
    () => new Set((user as any)?.following?.map((f: any) => (typeof f === "string" ? f : f._id)) || []),
    [user]
  );

  const followToggle = async (targetId: string) => {
    await api.post(`/users/${targetId}/follow-toggle`);
    await loadProfile();
  };

  const runSearch = async () => {
    const { data } = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
    setResults(data);
  };

  return (
    <main className="mx-auto max-w-2xl space-y-4 p-4">
      {profile && (
        <section className="rounded-xl border bg-white p-4">
          <h1 className="text-2xl font-bold">{profile.fullName} {profile.yearOfStudy >= 3 ? "• Senior" : ""}</h1>
          <p>{profile.collegeName} • Year {profile.yearOfStudy} • {profile.branch}</p>
          <p className="mt-2 text-gray-700">{profile.bio || "No bio yet."}</p>

          {user?._id !== profile._id && (
            <button className="mt-3 rounded bg-black px-3 py-1 text-white" onClick={() => followToggle(profile._id)}>
              Follow / Unfollow
            </button>
          )}

          <div className="mt-3">
            <p className="font-medium">Following ({profile.following?.length || 0})</p>
            <div className="mt-2 space-y-1 text-sm">
              {(profile.following || []).slice(0, 12).map((f: any) => (
                <Link className="block text-blue-700" to={`/profile/${f._id}`} key={f._id}>
                  {f.fullName} • {f.collegeName}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="rounded-xl border bg-white p-4">
        <h2 className="mb-2 font-semibold">Search Students</h2>
        <form onSubmit={async (e) => { e.preventDefault(); await runSearch(); }} className="flex gap-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)} className="flex-1 rounded border px-3 py-2" placeholder="Name / college / branch" />
          <button className="rounded bg-black px-3 text-white">Search</button>
        </form>

        <div className="mt-3 space-y-2">
          {results.map((result) => (
            <div key={result._id} className="flex items-center justify-between rounded border p-2 text-sm">
              <Link to={`/profile/${result._id}`}>{result.fullName} • {result.collegeName} • {result.branch}</Link>
              {result._id !== user?._id && (
                <button onClick={() => followToggle(result._id)} className="text-blue-700">
                  {followingIds.has(result._id) ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
