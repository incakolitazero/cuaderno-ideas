"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const crearCuenta = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMensaje("Ups: " + error.message);
    else setMensaje("¡Cuenta creada! Ahora dale a Entrar 💜");
  };

  const entrar = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMensaje("Ups: " + error.message);
    else router.push("/cuaderno");
  };

  return (
    <main className="min-h-screen flex flex-col justify-center bg-violet-50 px-6">
      <h1 className="text-3xl font-extrabold text-violet-700 text-center">
        Mi Cuaderno de Ideas 💡
      </h1>
      <p className="mt-2 text-center text-gray-600">Entra a tu espacio privado</p>

      <div className="mt-8 flex flex-col gap-3">
        <input
          type="email"
          placeholder="Tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border border-violet-200 bg-white p-4"
        />
        <input
          type="password"
          placeholder="Tu contraseña (mínimo 6 letras)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl border border-violet-200 bg-white p-4"
        />

        <button onClick={entrar} className="rounded-xl bg-violet-600 p-4 font-bold text-white">
          Entrar
        </button>
        <button onClick={crearCuenta} className="rounded-xl border-2 border-violet-600 p-4 font-bold text-violet-700">
          Crear cuenta nueva
        </button>

        {mensaje && <p className="mt-2 text-center text-sm text-gray-700">{mensaje}</p>}
      </div>
    </main>
  );
}