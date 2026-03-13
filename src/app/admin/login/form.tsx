"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";

import { adminLoginAction } from "./actions";

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(adminLoginAction, {} as { error?: string });

  return (
    <form action={action} className="mt-8 space-y-5">
      <Field name="email" type="email" label="Email admin" placeholder="admin@almamater.com" />
      <Field name="password" type="password" label="Contrasena" placeholder="change-me" />
      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      <div className="rounded-[1.25rem] border border-brand-900/10 bg-brand-900/[0.03] px-4 py-4 text-sm text-brand-900/68">
        Acceso pensado para mantener foco operativo: entrar, revisar estados y editar sin friccion.
      </div>
      <Button type="submit" className="w-full">
        {pending ? "Ingresando..." : "Ingresar al backoffice"}
      </Button>
    </form>
  );
}

function Field({ name, type, label, placeholder }: { name: string; type: string; label: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-brand-900/75">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-[1rem] border border-brand-900/12 bg-white px-4 py-3 text-sm outline-none ring-brand-700/30 placeholder:text-brand-900/35 focus:ring-2"
        required
      />
    </label>
  );
}
