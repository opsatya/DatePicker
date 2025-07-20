import { describe, it, expect, beforeEach } from "@jest/globals"
import { useRecurringDateStore } from "../store/recurring-date-store"

describe("Recurring Date Store", () => {
  beforeEach(() => {
    useRecurringDateStore.getState().reset()
  })

  describe("setRecurrenceType", () => {
    it("should update recurrence type", () => {
      const store = useRecurringDateStore.getState()
      store.setRecurrenceType("weekly")
      expect(store.config.type).toBe("weekly")
    })
  })

  describe("setInterval", () => {
    it("should update interval", () => {
      const store = useRecurringDateStore.getState()
      store.setInterval(3)
      expect(store.config.interval).toBe(3)
    })
  })

  describe("setStartDate", () => {
    it("should update start date", () => {
      const store = useRecurringDateStore.getState()
      const newDate = new Date("2024-02-15")
      store.setStartDate(newDate)
      expect(store.config.startDate.toDateString()).toBe(newDate.toDateString())
    })
  })

  describe("generatePreviewDates", () => {
    it("should generate daily recurring dates", () => {
      const store = useRecurringDateStore.getState()
      store.setRecurrenceType("daily")
      store.setInterval(2)
      store.setStartDate(new Date("2024-01-01"))
      store.generatePreviewDates()

      expect(store.previewDates.length).toBeGreaterThan(0)
      expect(store.previewDates[0].toDateString()).toBe(new Date("2024-01-01").toDateString())
    })

    it("should generate weekly recurring dates", () => {
      const store = useRecurringDateStore.getState()
      store.setRecurrenceType("weekly")
      store.setInterval(1)
      store.setStartDate(new Date("2024-01-01")) // Monday
      store.setWeeklyPattern({ daysOfWeek: [1, 3, 5] }) // Mon, Wed, Fri
      store.generatePreviewDates()

      expect(store.previewDates.length).toBeGreaterThan(0)
    })
  })
})
