import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../state/auth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    collegeName: "",
    yearOfStudy: 1,
    branch: ""
  });
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.post("/auth/register", form);
      setAuth(data.token, data.user);
      navigate("/");
    } catch {
      setError("Registration failed. Email may already exist.");
    }
  };

  return (
    <main className="mx-auto mt-10 max-w-md rounded-xl border bg-white p-6">
      <h1 className="mb-4 text-2xl font-bold">Register</h1>

      <form onSubmit={submit} className="space-y-2">
        <input className="w-full rounded border p-2" placeholder="Full name" onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
        <input className="w-full rounded border p-2" placeholder="College email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="w-full rounded border p-2" placeholder="Password" type="password" minLength={6} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <input className="w-full rounded border p-2" placeholder="College name" onChange={(e) => setForm({ ...form, collegeName: e.target.value })} required />
        <input className="w-full rounded border p-2" placeholder="Year of study" type="number" min={1} max={6} onChange={(e) => setForm({ ...form, yearOfStudy: Number(e.target.value) })} required />
        <input className="w-full rounded border p-2" placeholder="Branch / Major" onChange={(e) => setForm({ ...form, branch: e.target.value })} required />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button className="mt-2 w-full rounded bg-black py-2 text-white">Create account</button>
      </form>

      <Link to="/login" className="mt-3 block text-sm text-blue-600">Already have an account?</Link>
    </main>
  );
}
