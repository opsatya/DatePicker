import { create } from "zustand"
import { addDays, addMonths, addYears, startOfDay } from "date-fns"

export type RecurrenceType = "daily" | "weekly" | "monthly" | "yearly"

export type WeeklyPattern = {
  daysOfWeek: number[] // 0 = Sunday, 1 = Monday, etc.
}

export type MonthlyPattern = {
  type: "date" | "weekday"
  date?: number // for "15th of every month"
  weekday?: number // 0 = Sunday
  weekNumber?: number // 1 = first, 2 = second, etc., -1 = last
}

export interface RecurrenceConfig {
  type: RecurrenceType
  interval: number // every X days/weeks/months/years
  startDate: Date
  endDate?: Date
  weeklyPattern?: WeeklyPattern
  monthlyPattern?: MonthlyPattern
}

interface RecurringDateStore {
  config: RecurrenceConfig
  previewDates: Date[]
  setRecurrenceType: (type: RecurrenceType) => void
  setInterval: (interval: number) => void
  setStartDate: (date: Date) => void
  setEndDate: (date: Date | undefined) => void
  setWeeklyPattern: (pattern: WeeklyPattern) => void
  setMonthlyPattern: (pattern: MonthlyPattern) => void
  generatePreviewDates: () => void
  reset: () => void
}

const defaultConfig: RecurrenceConfig = {
  type: "daily",
  interval: 1,
  startDate: new Date(),
  endDate: undefined,
  weeklyPattern: { daysOfWeek: [new Date().getDay()] },
  monthlyPattern: { type: "date", date: new Date().getDate() },
}

export const useRecurringDateStore = create<RecurringDateStore>((set, get) => ({
  config: defaultConfig,
  previewDates: [],

  setRecurrenceType: (type) => {
    set((state) => ({
      config: { ...state.config, type },
    }))
    get().generatePreviewDates()
  },

  setInterval: (interval) => {
    set((state) => ({
      config: { ...state.config, interval },
    }))
    get().generatePreviewDates()
  },

  setStartDate: (startDate) => {
    set((state) => ({
      config: { ...state.config, startDate: startOfDay(startDate) },
    }))
    get().generatePreviewDates()
  },

  setEndDate: (endDate) => {
    set((state) => ({
      config: { ...state.config, endDate: endDate ? startOfDay(endDate) : undefined },
    }))
    get().generatePreviewDates()
  },

  setWeeklyPattern: (weeklyPattern) => {
    set((state) => ({
      config: { ...state.config, weeklyPattern },
    }))
    get().generatePreviewDates()
  },

  setMonthlyPattern: (monthlyPattern) => {
    set((state) => ({
      config: { ...state.config, monthlyPattern },
    }))
    get().generatePreviewDates()
  },

  generatePreviewDates: () => {
    const { config } = get()
    const dates = generateRecurringDates(config, 50) // Generate up to 50 preview dates
    set({ previewDates: dates })
  },

  reset: () => {
    set({ config: defaultConfig, previewDates: [] })
  },
}))

// Utility function to generate recurring dates
function generateRecurringDates(config: RecurrenceConfig, maxDates = 50): Date[] {
  const dates: Date[] = []
  let currentDate = new Date(config.startDate)
  const endDate = config.endDate

  // Better loop condition: stop when we hit end date OR max dates
  while (dates.length < maxDates && (!endDate || currentDate <= endDate)) {
    switch (config.type) {
      case "daily":
        if (dates.length === 0) {
          dates.push(new Date(currentDate))
        } else {
          currentDate = addDays(currentDate, config.interval)
          if (!endDate || currentDate <= endDate) {
            dates.push(new Date(currentDate))
          }
        }
        break

      case "weekly":
        if (config.weeklyPattern) {
          if (dates.length === 0) {
            // Add start date if it matches the pattern
            if (config.weeklyPattern.daysOfWeek.includes(currentDate.getDay())) {
              dates.push(new Date(currentDate))
            }
          }

          // Find next occurrence
          let nextDate = new Date(currentDate)
          let found = false

          for (let j = 1; j <= 7 * config.interval; j++) {
            nextDate = addDays(currentDate, j)
            if ((!endDate || nextDate <= endDate) && config.weeklyPattern.daysOfWeek.includes(nextDate.getDay())) {
              currentDate = nextDate
              dates.push(new Date(currentDate))
              found = true
              break
            }
          }

          if (!found || (endDate && currentDate > endDate)) break
        }
        break

      case "monthly":
        if (dates.length === 0) {
          dates.push(new Date(currentDate))
        } else {
          if (config.monthlyPattern?.type === "weekday") {
            // Handle "second Tuesday of every month" pattern
            currentDate = addMonths(currentDate, config.interval)
            const targetDate = getNthWeekdayOfMonth(
              currentDate,
              config.monthlyPattern.weekday!,
              config.monthlyPattern.weekNumber!,
            )
            if (targetDate && (!endDate || targetDate <= endDate)) {
              currentDate = targetDate
              dates.push(new Date(currentDate))
            } else {
              break
            }
          } else {
            // Handle "15th of every month" pattern
            currentDate = addMonths(currentDate, config.interval)
            if (!endDate || currentDate <= endDate) {
              dates.push(new Date(currentDate))
            }
          }
        }
        break

      case "yearly":
        if (dates.length === 0) {
          dates.push(new Date(currentDate))
        } else {
          currentDate = addYears(currentDate, config.interval)
          if (!endDate || currentDate <= endDate) {
            dates.push(new Date(currentDate))
          }
        }
        break
    }

    // Safety check to prevent infinite loops
    if (dates.length >= maxDates) break
  }

  return dates.filter((date) => !endDate || date <= endDate)
}

// Helper function to get the Nth weekday of a month
function getNthWeekdayOfMonth(date: Date, weekday: number, weekNumber: number): Date | null {
  const year = date.getFullYear()
  const month = date.getMonth()

  if (weekNumber === -1) {
    // Last occurrence of weekday in month
    const lastDayOfMonth = new Date(year, month + 1, 0)
    const lastWeekday = lastDayOfMonth.getDay()
    const daysBack = (lastWeekday - weekday + 7) % 7
    return new Date(year, month, lastDayOfMonth.getDate() - daysBack)
  } else {
    // Nth occurrence of weekday in month
    const firstDayOfMonth = new Date(year, month, 1)
    const firstWeekday = firstDayOfMonth.getDay()
    const daysToAdd = (weekday - firstWeekday + 7) % 7
    const firstOccurrence = 1 + daysToAdd
    const nthOccurrence = firstOccurrence + (weekNumber - 1) * 7

    // Check if this date exists in the month
    const targetDate = new Date(year, month, nthOccurrence)
    if (targetDate.getMonth() === month) {
      return targetDate
    }
    return null
  }
}
