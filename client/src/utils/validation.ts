export function validateTodo(title: string, dueDate: string): string | null {
  if (!title.trim()) return "Title is required";
  if (title.length < 2) return "Title is too short";
  if (!dueDate) return "Due date is required";
  if (isNaN(Date.parse(dueDate))) return "Invalid date";

  return null;
}