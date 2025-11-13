export const isToday = (date: Date|string): boolean => {
    const today = new Date();
    const checkDate = new Date(date);
    return checkDate.toDateString() === today.toDateString();
}

export const isYesterday = (date: Date|string): boolean => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const checkDate = new Date(date);
    return checkDate.toDateString() === yesterday.toDateString();
}

export const isWithinLastWeek = (date: Date|string): boolean => {
    const checkDate = new Date(date);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - checkDate.getTime()) / (1000 * 60 *60 *24));
    return daysDiff >= 2 && daysDiff <= 7; // 2 - 7 days ago
}

export const getWeekdayName = (date: Date|string): string => {
    const checkDate = new Date(date);
    return checkDate.toLocaleDateString("en-US", { weekday: "long" });
}

export const getFullDate = (date: Date|string): string => {
    const checkDate = new Date(date);
    return checkDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    })
}

export const getDateGroupLabel = (date: Date|string): string => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    if (isWithinLastWeek(date)) return getWeekdayName(date);
    return getFullDate(date);
}



