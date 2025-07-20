import { describe, it, expect, beforeEach } from "@jest/globals"
import { useRecurringDateStore } from "../store/recurring-date-store"

describe("Recurrence Engine", () => {
  beforeEach(() => {
    useRecurringDateStore.getState().reset()
  })

  describe("Monthly Weekday Patterns", () => {
    it("should generate second Tuesday of every month", () => {
      const store = useRecurringDateStore.getState()

      // Set up for second Tuesday pattern
      const startDate = new Date("2024-01-09") // Second Tuesday of January 2024
      store.setStartDate(startDate)
      store.setRecurrenceType("monthly")
      store.setMonthlyPattern({
        type: "weekday",
        weekday: 2, // Tuesday
        weekNumber: 2, // Second
      })
      store.generatePreviewDates()

      const dates = store.previewDates.slice(0, 3)

      // Should be second Tuesday of Jan, Feb, Mar
      expect(dates[0].toDateString()).toBe("Tue Jan 09 2024")
      expect(dates[1].toDateString()).toBe("Tue Feb 13 2024")
      expect(dates[2].toDateString()).toBe("Tue Mar 12 2024")
    })

    it("should generate last Friday of every month", () => {
      const store = useRecurringDateStore.getState()

      const startDate = new Date("2024-01-26") // Last Friday of January 2024
      store.setStartDate(startDate)
      store.setRecurrenceType("monthly")
      store.setMonthlyPattern({
        type: "weekday",
        weekday: 5, // Friday
        weekNumber: -1, // Last
      })
      store.generatePreviewDates()

      const dates = store.previewDates.slice(0, 3)

      // Should be last Friday of Jan, Feb, Mar
      expect(dates[0].toDateString()).toBe("Fri Jan 26 2024")
      expect(dates[1].toDateString()).toBe("Fri Feb 23 2024")
      expect(dates[2].toDateString()).toBe("Fri Mar 29 2024")
    })

    it("should handle months where pattern doesn't exist", () => {
      const store = useRecurringDateStore.getState()

      // Try to get 5th Monday (which doesn't exist in most months)
      const startDate = new Date("2024-01-29") // 5th Monday of January 2024 (rare)
      store.setStartDate(startDate)
      store.setRecurrenceType("monthly")
      store.setMonthlyPattern({
        type: "weekday",
        weekday: 1, // Monday
        weekNumber: 5, // Fifth (often doesn't exist)
      })
      store.generatePreviewDates()

      // Should only include dates where 5th Monday actually exists
      const dates = store.previewDates
      expect(dates.length).toBeGreaterThan(0)
      dates.forEach((date) => {
        expect(date.getDay()).toBe(1) // All should be Mondays
      })
    })
  })

  describe("Edge Cases", () => {
    it("should respect end date even with low max dates", () => {
      const store = useRecurringDateStore.getState()

      const startDate = new Date("2024-01-01")
      const endDate = new Date("2024-01-05") // Only 5 days

      store.setStartDate(startDate)
      store.setEndDate(endDate)
      store.setRecurrenceType("daily")
      store.setInterval(1)
      store.generatePreviewDates()

      const dates = store.previewDates
      expect(dates.length).toBe(5) // Should be exactly 5 dates
      expect(dates[dates.length - 1] <= endDate).toBe(true)
    })

    it("should stop at max dates when no end date", () => {
      const store = useRecurringDateStore.getState()

      store.setStartDate(new Date("2024-01-01"))
      store.setEndDate(undefined) // No end date
      store.setRecurrenceType("daily")
      store.setInterval(1)
      store.generatePreviewDates()

      const dates = store.previewDates
      expect(dates.length).toBe(50) // Should hit max limit
    })

    it("should handle weekly pattern with end date", () => {
      const store = useRecurringDateStore.getState()

      const startDate = new Date("2024-01-01") // Monday
      const endDate = new Date("2024-01-15") // 2 weeks later

      store.setStartDate(startDate)
      store.setEndDate(endDate)
      store.setRecurrenceType("weekly")
      store.setWeeklyPattern({ daysOfWeek: [1, 3, 5] }) // Mon, Wed, Fri
      store.generatePreviewDates()

      const dates = store.previewDates
      expect(dates.length).toBeLessThanOrEqual(6) // Max 6 dates in 2 weeks
      dates.forEach((date) => {
        expect([1, 3, 5]).toContain(date.getDay())
        expect(date <= endDate).toBe(true)
      })
    })
  })

  describe("Performance and Safety", () => {
    it("should not create infinite loops with invalid patterns", () => {
      const store = useRecurringDateStore.getState()

      store.setStartDate(new Date("2024-01-01"))
      store.setRecurrenceType("weekly")
      store.setWeeklyPattern({ daysOfWeek: [] }) // Empty pattern

      // This should not hang
      const startTime = Date.now()
      store.generatePreviewDates()
      const endTime = Date.now()

      expect(endTime - startTime).toBeLessThan(1000) // Should complete quickly
    })
  })
})
