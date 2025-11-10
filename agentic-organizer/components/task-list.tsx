"use client";

import { Task } from "@/lib/scheduler";

type TaskListProps = {
  tasks: Task[];
  onToggleDone: (id: string) => void;
  onRemove: (id: string) => void;
};

const priorityLabel: Record<Task["priority"], string> = {
  high: "wysoki",
  medium: "średni",
  low: "niski",
};

export function TaskList({ tasks, onToggleDone, onRemove }: TaskListProps) {
  if (!tasks.length) {
    return (
      <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-slate-300">
        Zapisz najważniejsze zadania, a agent ułoży z nich Twój dzień.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-100 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-1 items-start gap-3">
            <button
              onClick={() => onToggleDone(task.id)}
              className={`mt-1 size-5 rounded-full border-2 ${
                task.done
                  ? "border-emerald-400 bg-emerald-400/20"
                  : "border-white/30 bg-transparent"
              } transition`}
              aria-label="Przełącz status"
            />
            <div>
              <p
                className={`text-base font-semibold ${
                  task.done ? "line-through text-slate-400" : "text-white"
                }`}
              >
                {task.title}
              </p>
              <div className="mt-1 flex flex-wrap gap-2 text-xs uppercase tracking-wide text-slate-300">
                <span className="rounded-full bg-white/10 px-2 py-1">
                  {task.category}
                </span>
                <span className="rounded-full bg-white/10 px-2 py-1">
                  {task.duration} min
                </span>
                <span className="rounded-full bg-white/10 px-2 py-1">
                  Priorytet {priorityLabel[task.priority]}
                </span>
                <span className="rounded-full bg-white/10 px-2 py-1">
                  Energia {priorityLabel[task.energy]}
                </span>
                {task.mustDo && (
                  <span className="rounded-full bg-emerald-400/20 px-2 py-1 text-emerald-100">
                    Kluczowe
                  </span>
                )}
                {task.dueTime && (
                  <span className="rounded-full bg-white/10 px-2 py-1">
                    Do {task.dueTime}
                  </span>
                )}
                {task.preferredSlot && (
                  <span className="rounded-full bg-white/10 px-2 py-1">
                    {task.preferredSlot === "morning"
                      ? "Poranek"
                      : task.preferredSlot === "afternoon"
                      ? "Popołudnie"
                      : "Wieczór"}
                  </span>
                )}
              </div>
              {task.notes && (
                <p className="mt-2 text-xs text-slate-300">{task.notes}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => onRemove(task.id)}
            className="self-end rounded-full border border-white/20 px-4 py-1 text-xs uppercase tracking-wide text-slate-200 transition hover:border-rose-400 hover:text-rose-200"
          >
            Usuń
          </button>
        </li>
      ))}
    </ul>
  );
}
