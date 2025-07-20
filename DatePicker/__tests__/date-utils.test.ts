import { describe, it, expect } from "@jest/globals"
import { formatDate, formatShortDate, isDateInArray, getDayName } from "../utils/date-utils"

describe("Date Utils", () => {
  describe("formatDate", () => {
    it("should format date correctly", () => {
      const date = new Date("2024-01-15")
      expect(formatDate(date)).toBe("Jan 15, 2024")
    })
  })

  describe("formatShortDate", () => {
    it("should format short date correctly", () => {
      const date = new Date("2024-01-15")
      expect(formatShortDate(date)).toBe("Jan 15")
    })
  })

  describe("isDateInArray", () => {
    it("should return true if date is in array", () => {
      const date = new Date("2024-01-15")
      const dates = [new Date("2024-01-15"), new Date("2024-01-16")]
      expect(isDateInArray(date, dates)).toBe(true)
    })

    it("should return false if date is not in array", () => {
      const date = new Date("2024-01-17")
      const dates = [new Date("2024-01-15"), new Date("2024-01-16")]
      expect(isDateInArray(date, dates)).toBe(false)
    })
  })

  describe("getDayName", () => {
    it("should return correct day names", () => {
      expect(getDayName(0)).toBe("Sunday")
      expect(getDayName(1)).toBe("Monday")
      expect(getDayName(6)).toBe("Saturday")
    })
  })
})
