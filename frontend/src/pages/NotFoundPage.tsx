import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="mx-auto mt-20 max-w-xl rounded-xl border bg-white p-6 text-center">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <Link to="/" className="mt-4 inline-block text-blue-700">Go to feed</Link>
    </main>
  );
}
