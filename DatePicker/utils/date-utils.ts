import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns"

export const formatDate = (date: Date): string => {
  return format(date, "MMM dd, yyyy")
}

export const formatShortDate = (date: Date): string => {
  return format(date, "MMM dd")
}

export const getCalendarDays = (date: Date): Date[] => {
  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(date)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
}

export const isDateInArray = (date: Date, dates: Date[]): boolean => {
  return dates.some((d) => isSameDay(d, date))
}

export const getDayName = (dayIndex: number): string => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  return days[dayIndex]
}

export const getShortDayName = (dayIndex: number): string => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  return days[dayIndex]
}

export const getOrdinalNumber = (num: number): string => {
  const ordinals = ["", "first", "second", "third", "fourth", "fifth"]
  return ordinals[num] || `${num}th`
}

export const getWeekNumberInMonth = (date: Date): number => {
  return Math.ceil(date.getDate() / 7)
}

export const isLastWeekdayOfMonth = (date: Date): boolean => {
  const nextWeek = new Date(date)
  nextWeek.setDate(date.getDate() + 7)
  return nextWeek.getMonth() !== date.getMonth()
}
