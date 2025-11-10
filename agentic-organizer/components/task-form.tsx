"use client";

import { useState } from "react";
import type { Task, Priority, Energy } from "@/lib/scheduler";

export type TaskFormValues = Omit<Task, "id" | "done">;

type TaskFormProps = {
  onSubmit: (values: TaskFormValues) => void;
};

const priorityOptions: { label: string; value: Priority }[] = [
  { label: "Wysoki", value: "high" },
  { label: "Średni", value: "medium" },
  { label: "Niski", value: "low" },
];

const energyOptions: { label: string; value: Energy }[] = [
  { label: "Wymaga skupienia", value: "high" },
  { label: "Pełna energia", value: "medium" },
  { label: "Na spokojnie", value: "low" },
];

const slotOptions = [
  { label: "Brak preferencji", value: "" },
  { label: "Poranek", value: "morning" },
  { label: "Popołudnie", value: "afternoon" },
  { label: "Wieczór", value: "evening" },
];

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(45);
  const [priority, setPriority] = useState<Priority>("medium");
  const [energy, setEnergy] = useState<Energy>("medium");
  const [category, setCategory] = useState("Praca");
  const [dueTime, setDueTime] = useState<string>("");
  const [mustDo, setMustDo] = useState(false);
  const [notes, setNotes] = useState("");
  const [preferredSlot, setPreferredSlot] =
    useState<TaskFormValues["preferredSlot"]>();

  const reset = () => {
    setTitle("");
    setDuration(45);
    setPriority("medium");
    setEnergy("medium");
    setCategory("Praca");
    setDueTime("");
    setMustDo(false);
    setNotes("");
    setPreferredSlot(undefined);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      duration: Math.max(10, duration),
      priority,
      energy,
      category: category.trim() || "Inne",
      dueTime: dueTime || undefined,
      mustDo,
      notes: notes.trim() || undefined,
      preferredSlot,
    });
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow backdrop-blur"
    >
      <div>
        <label className="flex items-center justify-between text-sm font-medium text-slate-100">
          Nazwa zadania
          <span className="text-xs text-slate-300">
            Co chcesz zrobić w trakcie dnia?
          </span>
        </label>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Przygotować prezentację, trening, telefon do ..."
          className="mt-2 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="text-sm font-medium text-slate-100">
            Czas trwania (min)
          </label>
          <input
            type="number"
            min={10}
            step={5}
            value={duration}
            onChange={(event) => setDuration(Number(event.target.value))}
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-100">Priorytet</label>
          <select
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as TaskFormValues["priority"])
            }
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-100">
            Zużycie energii
          </label>
          <select
            value={energy}
            onChange={(event) =>
              setEnergy(event.target.value as TaskFormValues["energy"])
            }
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
          >
            {energyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="text-sm font-medium text-slate-100">Kategoria</label>
          <input
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Praca, Zdrowie, Dom..."
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-100">
            Deadline (opcjonalny)
          </label>
          <input
            type="time"
            value={dueTime}
            onChange={(event) => setDueTime(event.target.value)}
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-100">
            Preferowana pora
          </label>
          <select
            value={preferredSlot ?? ""}
            onChange={(event) =>
              setPreferredSlot(
                event.target.value
                  ? (event.target.value as TaskFormValues["preferredSlot"])
                  : undefined
              )
            }
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
          >
            {slotOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-100">Notatki</label>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={3}
          placeholder="Warunki sukcesu, osoby do kontaktu, materiały..."
          className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none"
        />
      </div>

      <label className="flex items-center gap-3 text-sm font-medium text-slate-100">
        <input
          type="checkbox"
          checked={mustDo}
          onChange={(event) => setMustDo(event.target.checked)}
          className="size-4 rounded border-white/20 bg-white/10 text-emerald-400 focus:ring-emerald-400"
        />
        Kluczowe zadanie dnia
      </label>

      <button
        type="submit"
        className="w-full rounded-full bg-emerald-400 py-2 text-sm font-semibold text-slate-900 transition hover:bg-emerald-300"
      >
        Dodaj do planu
      </button>
    </form>
  );
}
