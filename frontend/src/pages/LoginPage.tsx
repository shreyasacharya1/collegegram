import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../state/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.post("/auth/login", { email, password });
      setAuth(data.token, data.user);
      navigate("/");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <main className="mx-auto mt-10 max-w-md rounded-xl border bg-white p-6">
      <h1 className="mb-4 text-2xl font-bold">Login</h1>

      <form onSubmit={submit} className="space-y-3">
        <input className="w-full rounded border p-2" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full rounded border p-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button className="w-full rounded bg-black py-2 text-white">Login</button>
      </form>

      <Link to="/register" className="mt-3 block text-sm text-blue-600">Create account</Link>
    </main>
  );
}
