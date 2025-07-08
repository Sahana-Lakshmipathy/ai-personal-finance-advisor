
// All calculations are based on Sunday as the first day of the week.

/**
 * Gets the start and end of the week for a given date.
 * @param date The date to get the week for.
 * @returns An object with startOfWeek, endOfWeek, and a unique weekId.
 */
export const getWeekStartAndEnd = (date: Date): { startOfWeek: Date, endOfWeek: Date, weekId: string } => {
  const d = new Date(date);
  const day = d.getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6
  const diffToSunday = d.getDate() - day;
  
  const startOfWeek = new Date(d.setDate(diffToSunday));
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  const weekId = `${startOfWeek.getFullYear()}-${startOfWeek.getMonth()}-${startOfWeek.getDate()}`;

  return { startOfWeek, endOfWeek, weekId };
};
