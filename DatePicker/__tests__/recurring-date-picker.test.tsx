import { describe, it, expect, vi } from "@jest/globals"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { RecurringDatePicker } from "../components/recurring-date-picker/recurring-date-picker"
import { useRecurringDateStore } from "../store/recurring-date-store"

// Mock the store
vi.mock("../store/recurring-date-store", () => ({
  useRecurringDateStore: vi.fn(() => ({
    config: {
      type: "daily",
      interval: 1,
      startDate: new Date("2024-01-01"),
      endDate: undefined,
      weeklyPattern: { daysOfWeek: [1] },
      monthlyPattern: { type: "date", date: 1 },
    },
    previewDates: [new Date("2024-01-01"), new Date("2024-01-02")],
    generatePreviewDates: vi.fn(),
    reset: vi.fn(),
    setRecurrenceType: vi.fn(),
    setInterval: vi.fn(),
    setStartDate: vi.fn(),
    setEndDate: vi.fn(),
    setWeeklyPattern: vi.fn(),
    setMonthlyPattern: vi.fn(),
  })),
}))

describe("RecurringDatePicker Integration", () => {
  it("should render all main components", () => {
    render(<RecurringDatePicker />)

    expect(screen.getByText("Recurring Date Picker")).toBeInTheDocument()
    expect(screen.getByText("Recurrence Pattern")).toBeInTheDocument()
    expect(screen.getByText("Date Range")).toBeInTheDocument()
    expect(screen.getByText("Preview Calendar")).toBeInTheDocument()
  })

  it("should call onSave when save button is clicked", async () => {
    const mockOnSave = vi.fn()
    render(<RecurringDatePicker onSave={mockOnSave} />)

    const saveButton = screen.getByText("Save Recurrence")
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalled()
    })
  })

  it("should call onCancel when cancel button is clicked", async () => {
    const mockOnCancel = vi.fn()
    render(<RecurringDatePicker onCancel={mockOnCancel} />)

    const cancelButton = screen.getByText("Cancel")
    fireEvent.click(cancelButton)

    await waitFor(() => {
      expect(mockOnCancel).toHaveBeenCalled()
    })
  })

  it("should disable save button when no preview dates", () => {
    // Mock empty preview dates
    vi.mocked(useRecurringDateStore).mockReturnValue({
      ...vi.mocked(useRecurringDateStore)(),
      previewDates: [],
    })

    render(<RecurringDatePicker />)

    const saveButton = screen.getByText("Save Recurrence")
    expect(saveButton).toBeDisabled()
  })
})
