"use client";

import { useMemo } from "react";
import { SchedulePlan, Task } from "@/lib/scheduler";

type DayInsightsProps = {
  plan: SchedulePlan;
  tasks: Task[];
};

const motivationPool = [
  "Skup się na jednym zadaniu naraz — Twój plan już wskazał najlepszą kolejność.",
  "Krótkie przerwy po każdym bloku dają mózgowi szansę na reset.",
  "Zaplanuj nagrodę na koniec dnia za ukończone kluczowe zadanie.",
  "Najpierw zaopiekuj się tym, co daje największy spokój — reszta pójdzie łatwiej.",
  "Dopasuj playlistę do poziomu energii w bieżącym bloku.",
];

const energyTips: Record<Task["energy"], string> = {
  high: "To zadania wymagające głębokiego skupienia. Wplataj je rano, zanim pojawią się dystraktory.",
  medium:
    "Zadania przy średniej energii świetnie nadają się po lunchu oraz w krótszych oknach czasowych.",
  low: "Niskie zużycie energii? Wypełnij nimi bufor albo czas przejazdów.",
};

const priorityTips: Record<Task["priority"], string> = {
  high: "Priorytet wysoki – zaplanuj moment checkpointu, aby upewnić się, że idziesz zgodnie z planem.",
  medium: "Priorytet średni – upewnij się, że wiesz, co oznacza „gotowe”.",
  low: "Priorytet niski – idealne do domknięcia dnia, gdy energia spada, ale chcesz czuć progres.",
};

const randomFrom = <T,>(items: T[]) =>
  items[Math.floor(Math.random() * items.length)];

export function DayInsights({ plan, tasks }: DayInsightsProps) {
  const openTasks = tasks.filter((task) => !task.done);
  const mustDoCount = openTasks.filter((task) => task.mustDo).length;
  const totalDuration = openTasks.reduce(
    (acc, task) => acc + task.duration,
    0
  );

  const dominantEnergy = useMemo(() => {
    if (!openTasks.length) return undefined;
    const energyBuckets = openTasks.reduce(
      (acc, task) => {
        acc[task.energy] += 1;
        return acc;
      },
      { high: 0, medium: 0, low: 0 } as Record<Task["energy"], number>
    );
    return Object.entries(energyBuckets).sort((a, b) => b[1] - a[1])[0][0] as
      | Task["energy"]
      | undefined;
  }, [openTasks]);

  const dominantPriority = useMemo(() => {
    if (!openTasks.length) return undefined;
    const priorityBuckets = openTasks.reduce(
      (acc, task) => {
        acc[task.priority] += 1;
        return acc;
      },
      { high: 0, medium: 0, low: 0 } as Record<Task["priority"], number>
    );
    return Object.entries(priorityBuckets).sort((a, b) => b[1] - a[1])[0][0] as
      | Task["priority"]
      | undefined;
  }, [openTasks]);

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-slate-100 shadow">
      <h2 className="text-lg font-semibold text-white">
        Puls dnia w skrócie
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase text-slate-300">Czas w zadaniach</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {plan.focusMinutes} min
          </p>
          <p className="text-xs text-slate-300">
            Łączny czas bloków koncentracji, wliczając przerwy co 90 minut.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase text-slate-300">
            Krytyczne zadania
          </p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {mustDoCount}
          </p>
          <p className="text-xs text-slate-300">
            Pilnuj, by ukończyć je przed {plan.finishTime}.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase text-slate-300">Pozostały bufor</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {plan.bufferMinutes} min
          </p>
          <p className="text-xs text-slate-300">
            Wolny czas na przejazdy, maile albo regenerację.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 p-4 text-sm text-emerald-50">
        <p className="font-medium">
          {randomFrom(motivationPool)} Zostało {totalDuration} minut pracy do
          zaplanowania.
        </p>
      </div>

      <div className="space-y-3 text-sm text-slate-200">
        {dominantEnergy && (
          <p className="rounded-xl border border-white/10 bg-white/5 p-3">
            <span className="font-semibold text-white">Energia dnia:</span>{" "}
            {energyTips[dominantEnergy]}
          </p>
        )}
        {dominantPriority && (
          <p className="rounded-xl border border-white/10 bg-white/5 p-3">
            <span className="font-semibold text-white">Priorytet:</span>{" "}
            {priorityTips[dominantPriority]}
          </p>
        )}
      </div>
    </div>
  );
}
