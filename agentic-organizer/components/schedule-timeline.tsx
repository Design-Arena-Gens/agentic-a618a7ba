"use client";

import { ScheduleItem } from "@/lib/scheduler";

type ScheduleTimelineProps = {
  items: ScheduleItem[];
};

const categoryColors: Record<string, string> = {
  Praca: "from-emerald-400/80 to-emerald-500/80",
  Zdrowie: "from-rose-400/80 to-rose-500/80",
  Dom: "from-amber-400/80 to-amber-500/80",
  Nauka: "from-indigo-400/80 to-indigo-500/80",
};

const getGradient = (category: string) =>
  categoryColors[category] ?? "from-blue-400/80 to-sky-500/80";

export function ScheduleTimeline({ items }: ScheduleTimelineProps) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-center text-sm text-slate-200">
        Gdy dodasz zadania, wygeneruję plan dnia z blokami focusu i przerwami.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        if (item.type === "task") {
          const { task } = item;
          return (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow"
            >
              <div
                className={`absolute inset-0 opacity-40 blur-xl bg-gradient-to-r ${getGradient(
                  task.category
                )}`}
                aria-hidden
              />
              <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase text-slate-300">
                    {item.start} - {item.end}
                  </p>
                  <h3 className="text-lg font-semibold text-white">
                    {task.title}
                  </h3>
                  <p className="text-xs text-slate-200">
                    {task.category} • {task.duration} min • Priorytet{" "}
                    {task.priority === "high"
                      ? "wysoki"
                      : task.priority === "medium"
                      ? "średni"
                      : "niski"}
                  </p>
                </div>
                <div className="flex flex-col gap-1 text-right text-xs text-slate-200">
                  {task.mustDo && (
                    <span className="rounded-full bg-white/15 px-3 py-1 font-semibold uppercase tracking-wide text-emerald-100">
                      Krytyczne
                    </span>
                  )}
                  {task.dueTime && (
                    <span className="text-xs text-slate-100">
                      Termin: {task.dueTime}
                    </span>
                  )}
                  {task.notes && (
                    <span className="max-w-xs text-left text-slate-100 sm:text-right">
                      {task.notes}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        }

        return (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-gradient-to-r from-slate-600/30 to-slate-700/20 p-4 text-sm text-slate-100"
          >
            <div>
              <p className="text-xs uppercase text-slate-300">
                {item.start} - {item.end}
              </p>
              <p className="font-medium">
                {item.type === "break" ? "Przerwa" : item.label}
              </p>
            </div>
            <span className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-wide">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
