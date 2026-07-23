"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

type Task = { id: string; title: string; done: boolean };

export default function Home() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      router.push("/login");
      return;
    }
    setUserId(data.user.id);
    loadTasks();
  }

  async function loadTasks() {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setTasks(data);
    setLoading(false);
  }

  async function addTask() {
    if (input.trim() === "" || !userId) return;
    const { data } = await supabase
      .from("tasks")
      .insert({ title: input.trim(), done: false, user_id: userId })
      .select()
      .single();
    if (data) {
      setTasks([data, ...tasks]);
      setInput("");
    }
  }

  async function toggleTask(id: string, done: boolean) {
    await supabase.from("tasks").update({ done: !done }).eq("id", id);
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !done } : t)));
  }

  async function deleteTask(id: string) {
    await supabase.from("tasks").delete().eq("id", id);
    setTasks(tasks.filter((t) => t.id !== id));
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">🧠 MindMate</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-500 hover:text-slate-900 transition"
          >
            Sign Out
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <input
            className="flex-1 px-4 py-3 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
            placeholder="What needs to be done?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <Button variant="primary" onClick={addTask}>Add</Button>
        </div>

        <div className="space-y-2">
          {tasks.length === 0 && (
            <p className="text-center text-slate-400 py-8">
              No tasks yet. Add one above! 👆
            </p>
          )}
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 bg-white p-4 rounded-lg border border-slate-200">
              <input type="checkbox" checked={task.done}
                onChange={() => toggleTask(task.id, task.done)}
                className="w-5 h-5 cursor-pointer" />
              <span className={`flex-1 ${task.done ? "line-through text-slate-400" : "text-slate-800"}`}>
                {task.title}
              </span>
              <button onClick={() => deleteTask(task.id)}
                className="text-slate-400 hover:text-red-500 transition">✕</button>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}