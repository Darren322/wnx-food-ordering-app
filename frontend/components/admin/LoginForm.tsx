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

  function clearError() {
    if (error) setError("");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7 space-y-5">
      <label
        htmlFor="owner-username"
        className="block text-sm font-semibold text-stone-800"
      >
        Username
        <input
          id="owner-username"
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            clearError();
          }}
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
          aria-invalid={error ? true : undefined}
          className="input mt-2 min-h-12 text-base"
        />
      </label>
      <label
        htmlFor="owner-password"
        className="block text-sm font-semibold text-stone-800"
      >
        Password
        <input
          id="owner-password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            clearError();
          }}
          autoComplete="current-password"
          required
          aria-invalid={error ? true : undefined}
          className="input mt-2 min-h-12 text-base"
        />
      </label>
      {error ? (
        <p role="alert" className="form-error border-l-2 border-brand pl-3">
          {error}
        </p>
      ) : null}
      <button type="submit" className="btn-primary w-full">
        Open owner dashboard
      </button>

      <aside
        className="border-t border-stone-200 pt-5"
        aria-label="Prototype access details"
      >
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
          Prototype access
        </p>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Use{" "}
          <code className="rounded bg-paper px-1.5 py-0.5 font-semibold text-stone-800">
            {adminCredentials.username}
          </code>{" "}
          and{" "}
          <code className="rounded bg-paper px-1.5 py-0.5 font-semibold text-stone-800">
            {adminCredentials.password}
          </code>
          . Replace this demo login with real authentication before deployment.
        </p>
      </aside>
    </form>
  );
}
