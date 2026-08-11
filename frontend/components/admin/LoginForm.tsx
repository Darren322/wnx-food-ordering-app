"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminCredentials } from "@/data/business";
import { login } from "@/components/admin/adminStore";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (login(username.trim(), password)) {
      router.push("/admin");
    } else {
      setError("Incorrect username or password.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-sm space-y-4 rounded-xl border border-amber-200 bg-white p-6"
    >
      <p className="rounded-lg bg-amber-50 p-3 text-xs text-neutral-600">
        Prototype login — credentials are hardcoded in the config (
        <code>{adminCredentials.username}</code> /{" "}
        <code>{adminCredentials.password}</code>). Replace with real
        authentication before any deployment.
      </p>
      <label className="block text-sm font-medium">
        Username
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          className="mt-1 w-full rounded-lg border border-amber-300 px-3 py-2"
        />
      </label>
      <label className="block text-sm font-medium">
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg border border-amber-300 px-3 py-2"
        />
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        className="w-full rounded-lg bg-red-700 px-5 py-2.5 font-semibold text-white hover:bg-red-800"
      >
        Log in
      </button>
    </form>
  );
}
