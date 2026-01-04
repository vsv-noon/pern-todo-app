import { useEffect } from "react";
import type { Todo } from "../types/todo";

export function useReminders(todos: Todo[]) {
  useEffect(() => {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const timers: number[] = [];

    todos.forEach((todo) => {
      if (!todo.remind_at || todo.completed) return;

      const diff = new Date(todo.remind_at).getTime() - Date.now();

      console.log("Scheduling reminder", {
        title: todo.title,
        remind_at: todo.remind_at,
        remindDate: new Date(todo.remind_at).toString(),
        now: new Date().toString(),
        diff,
      });

      if (diff <= 0) return;

      const id = window.setTimeout(() => {
        new Notification("Todo reminder", {
          body: todo.title,
        });
      }, diff);

      timers.push(id);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [todos]);
}
