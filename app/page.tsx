"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

type Task = {
  id: string;
  title: string;
  done: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setTasks(data);
    setLoading(false);
  }

  async function addTask() {
    if (input.trim() === "") return;
    const { data, error } = await supabase
      .from("tasks")
      .insert({ title: input.trim(), done: false })
      .select()
      .single();

    if (!error && data) {
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

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-xl mx-auto">

        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🧠</div>
          <h1 className="text-3xl font-bold text-slate-900">MindMate</h1>
          <p className="text-slate-500">Your AI-powered task manager</p>
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
          {loading && (
            <p className="text-center text-slate-400 py-8">Loading...</p>
          )}

          {!loading && tasks.length === 0 && (
            <p className="text-center text-slate-400 py-8">
              No tasks yet. Add one above! 👆
            </p>
          )}

          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 bg-white p-4 rounded-lg border border-slate-200"
            >
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id, task.done)}
                className="w-5 h-5 cursor-pointer"
              />
              <span
                className={`flex-1 ${
                  task.done ? "line-through text-slate-400" : "text-slate-800"
                }`}
              >
                {task.title}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-slate-400 hover:text-red-500 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}