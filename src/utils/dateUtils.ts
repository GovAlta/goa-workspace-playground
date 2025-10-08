export const isToday = (date: Date | string): boolean => {
  const today = new Date();
  const checkDate = new Date(date);
  return checkDate.toDateString() === today.toDateString();
};

export const isYesterday = (date: Date | string): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const checkDate = new Date(date);
  return checkDate.toDateString() === yesterday.toDateString();
};

export const isWithinLastWeek = (date: Date | string): boolean => {
  const checkDate = new Date(date);
  const today = new Date();
  const daysDiff = Math.floor(
    (today.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  return daysDiff >= 2 && daysDiff <= 7; // 2 - 7 days ago
};

export const getWeekdayName = (date: Date | string): string => {
  const checkDate = new Date(date);
  return checkDate.toLocaleDateString("en-US", { weekday: "long" });
};

export const getFullDate = (date: Date | string): string => {
  const checkDate = new Date(date);
  return checkDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const getDateGroupLabel = (date: Date | string): string => {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (isWithinLastWeek(date)) return getWeekdayName(date);
  return getFullDate(date);
};

export function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-CA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-CA", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export function formatDueDate(dateStr: string): string {
  const date = parseDate(dateStr);
  if (!date) return "No date";

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor((dueDay.getTime() - today.getTime()) / 86400000);

  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays <= 14) return "Next week";
  return date.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

export function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) {
    return date.toLocaleTimeString("en-CA", {
      hour: "numeric",
      minute: "2-digit",
    });
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}
