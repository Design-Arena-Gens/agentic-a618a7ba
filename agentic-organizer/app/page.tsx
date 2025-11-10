"use client";

import { useEffect, useMemo, useState } from "react";
import { TaskForm, type TaskFormValues } from "@/components/task-form";
import { TaskList } from "@/components/task-list";
import { ScheduleTimeline } from "@/components/schedule-timeline";
import { DayInsights } from "@/components/day-insights";
import {
  Task,
  generatePlan,
  minutesToTime,
  timeToMinutes,
} from "@/lib/scheduler";

const STORAGE_KEY = "agentic-organizer-state-v1";

type PersistedState = {
  tasks: Task[];
  dayStart: string;
  dayEnd: string;
};

const defaultState: PersistedState = {
  tasks: [],
  dayStart: "08:00",
  dayEnd: "18:00",
};

export default function Home() {
  const [state, setState] = useState<PersistedState>(defaultState);
  const { tasks, dayStart, dayEnd } = state;

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored) as PersistedState;
      setState({
        tasks: parsed.tasks ?? [],
        dayStart: parsed.dayStart ?? defaultState.dayStart,
        dayEnd: parsed.dayEnd ?? defaultState.dayEnd,
      });
    } catch (error) {
      console.error("Nie udało się wczytać danych", error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const plan = useMemo(
    () => generatePlan(tasks, dayStart, dayEnd),
    [tasks, dayStart, dayEnd]
  );

  const groupedByCategory = useMemo(() => {
    return tasks.reduce(
      (acc, task) => {
        const base = acc[task.category] ?? { total: 0, done: 0 };
        base.total += 1;
        base.done += task.done ? 1 : 0;
        acc[task.category] = base;
        return acc;
      },
      {} as Record<string, { total: number; done: number }>
    );
  }, [tasks]);

  const addTask = (values: TaskFormValues) => {
    const newTask: Task = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Date.now()),
      done: false,
      ...values,
    };
    setState((prev) => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  };

  const toggleDone = (id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      ),
    }));
  };

  const removeTask = (id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task.id !== id),
    }));
  };

  const resetDay = () => {
    setState((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.done) }));
  };

  const changeDayStart = (value: string) => {
    setState((prev) => ({
      ...prev,
      dayStart: value,
      dayEnd:
        timeToMinutes(prev.dayEnd) <= timeToMinutes(value)
          ? minutesToTime(Math.min(timeToMinutes(value) + 8 * 60, 23 * 60))
          : prev.dayEnd,
    }));
  };

  const changeDayEnd = (value: string) => {
    setState((prev) => ({
      ...prev,
      dayEnd: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="relative mx-auto max-w-6xl px-6 py-16">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        </div>

        <header className="space-y-6">
          <div className="inline-flex items-center gap-3 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-sm text-emerald-100">
            Twój agent planowania dnia
            <span className="inline-block size-2 rounded-full bg-emerald-300" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Ułóż dzień jak strateg – bez chaosu, z automatycznym planem i
            inteligentnymi przerwami.
          </h1>
          <p className="max-w-2xl text-lg text-slate-200">
            Zapisz zadania, określ priorytety oraz energię, a agent ułoży je w
            rytm dnia. W pakiecie otrzymasz sugestie regeneracji i bufor na
            niespodziewane sprawy.
          </p>

          <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-100">
            <div>
              <p className="text-xs uppercase text-slate-300">Start dnia</p>
              <input
                type="time"
                value={dayStart}
                onChange={(event) => changeDayStart(event.target.value)}
                className="mt-2 rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <p className="text-xs uppercase text-slate-300">Koniec dnia</p>
              <input
                type="time"
                value={dayEnd}
                onChange={(event) => changeDayEnd(event.target.value)}
                className="mt-2 rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <button
              onClick={resetDay}
              className="ml-auto rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-wide text-slate-200 transition hover:border-rose-400 hover:text-rose-200"
            >
              Wyczyść ukończone
            </button>
          </div>
        </header>

        <main className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <section className="space-y-8">
            <TaskForm onSubmit={addTask} />
            <div>
              <h2 className="text-xl font-semibold text-white">
                Twoje zadania
              </h2>
              <p className="text-sm text-slate-300">
                Zadbaj o jasne nazwy – agent wykorzysta je w planie.
              </p>
              <div className="mt-4">
                <TaskList
                  tasks={tasks}
                  onToggleDone={toggleDone}
                  onRemove={removeTask}
                />
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <DayInsights plan={plan} tasks={tasks} />
            <div>
              <h2 className="text-xl font-semibold text-white">
                Twój plan dnia
              </h2>
              <p className="text-sm text-slate-300">
                Bloki budowane są w oparciu o priorytety, energię i terminy.
              </p>
              <div className="mt-4">
                <ScheduleTimeline items={plan.items} />
              </div>
            </div>

            {Object.keys(groupedByCategory).length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200">
                <h3 className="text-lg font-semibold text-white">
                  Balans kategorii
                </h3>
                <p className="text-xs text-slate-300">
                  Kontroluj, czy Twoja energia idzie w odpowiednie obszary.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {Object.entries(groupedByCategory).map(
                    ([category, stats]) => (
                      <div
                        key={category}
                        className="rounded-xl border border-white/10 bg-slate-900/60 p-4"
                      >
                        <p className="text-sm font-semibold text-white">
                          {category}
                        </p>
                        <p className="text-xs text-slate-300">
                          {stats.done} / {stats.total} ukończone
                        </p>
                        <div className="mt-2 h-2 rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-emerald-400 transition-all"
                            style={{
                              width: `${(stats.done / stats.total) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
