"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Idea = { id: number; contenido: string; created_at: string };

export default function CuadernoPage() {
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [nuevaIdea, setNuevaIdea] = useState("");
  const [mensaje, setMensaje] = useState("");

  const cargarIdeas = async () => {
    const { data } = await supabase
      .from("ideas")
      .select("*")
      .order("created_at", { ascending: false });
    setIdeas(data ?? []);
  };

  useEffect(() => {
    const revisarPuerta = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) router.push("/login");
      else cargarIdeas();
    };
    revisarPuerta();
  }, []);

  const guardarIdea = async () => {
    if (!nuevaIdea.trim()) return;
    const { data } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("ideas")
      .insert({ contenido: nuevaIdea, user_id: data.user?.id });
    if (error) setMensaje("Ups: " + error.message);
    else {
      setNuevaIdea("");
      setMensaje("");
      cargarIdeas();
    }
  };

  const borrarIdea = async (id: number) => {
    await supabase.from("ideas").delete().eq("id", id);
    cargarIdeas();
  };

  const salir = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-violet-50 px-5 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-violet-700">Mis Ideas 💡</h1>
        <button onClick={salir} className="text-sm font-bold text-violet-600 underline">
          Salir
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <textarea
          placeholder="Escribe tu idea aquí... ✨"
          value={nuevaIdea}
          onChange={(e) => setNuevaIdea(e.target.value)}
          className="min-h-24 rounded-xl border border-violet-200 bg-white p-4"
        />
        <button onClick={guardarIdea} className="rounded-xl bg-violet-600 p-4 font-bold text-white">
          Guardar idea
        </button>
        {mensaje && <p className="text-center text-sm text-red-600">{mensaje}</p>}
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {ideas.length === 0 && (
          <p className="text-center text-gray-500">Aún no hay ideas. ¡Escribe la primera! 💜</p>
        )}
        {ideas.map((idea) => (
          <div key={idea.id} className="flex items-start justify-between rounded-xl bg-white p-4 shadow-sm">
            <p className="pr-3 text-gray-800">{idea.contenido}</p>
            <button onClick={() => borrarIdea(idea.id)} className="text-sm text-gray-400">
              🗑️
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}