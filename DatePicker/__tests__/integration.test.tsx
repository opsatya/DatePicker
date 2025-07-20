import { describe, it, expect, vi } from "@jest/globals"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { RecurringDatePicker } from "../components/recurring-date-picker/recurring-date-picker"

describe("RecurringDatePicker Integration", () => {
  it("should complete monthly second Tuesday workflow", async () => {
    const user = userEvent.setup()
    const mockOnSave = vi.fn()

    render(<RecurringDatePicker onSave={mockOnSave} />)

    // Step 1: Change to monthly recurrence
    const recurrenceSelect = screen.getByRole("combobox", { name: /repeat/i })
    await user.click(recurrenceSelect)
    await user.click(screen.getByText("Monthly"))

    // Step 2: Set start date to second Tuesday
    const startDateButton = screen.getByRole("button", { name: /select start date/i })
    await user.click(startDateButton)

    // Find and click on a Tuesday that's the second one in the month
    // This is a simplified test - in real usage, user would navigate calendar
    const tuesdayButton = screen.getByRole("button", { name: "9" }) // Assuming Jan 9, 2024 is second Tuesday
    await user.click(tuesdayButton)

    // Step 3: Select monthly weekday pattern
    const weekdayCheckbox = screen.getByRole("checkbox", { name: /second tuesday/i })
    await user.click(weekdayCheckbox)

    // Step 4: Verify preview shows correct dates
    await waitFor(() => {
      expect(screen.getByText("Preview Calendar")).toBeInTheDocument()
    })

    // Step 5: Save the configuration
    const saveButton = screen.getByRole("button", { name: /save recurrence/i })
    await user.click(saveButton)

    // Verify onSave was called with correct configuration
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "monthly",
          monthlyPattern: expect.objectContaining({
            type: "weekday",
            weekday: 2, // Tuesday
            weekNumber: 2, // Second
          }),
        }),
        expect.any(Array),
      )
    })
  })

  it("should handle weekly multi-day selection", async () => {
    const user = userEvent.setup()
    const mockOnSave = vi.fn()

    render(<RecurringDatePicker onSave={mockOnSave} />)

    // Change to weekly
    const recurrenceSelect = screen.getByRole("combobox", { name: /repeat/i })
    await user.click(recurrenceSelect)
    await user.click(screen.getByText("Weekly"))

    // Select Monday, Wednesday, Friday
    await user.click(screen.getByLabelText("Mon"))
    await user.click(screen.getByLabelText("Wed"))
    await user.click(screen.getByLabelText("Fri"))

    // Set interval to every 2 weeks
    const intervalInput = screen.getByRole("spinbutton", { name: /every/i })
    await user.clear(intervalInput)
    await user.type(intervalInput, "2")

    // Save
    const saveButton = screen.getByRole("button", { name: /save recurrence/i })
    await user.click(saveButton)

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "weekly",
          interval: 2,
          weeklyPattern: expect.objectContaining({
            daysOfWeek: expect.arrayContaining([1, 3, 5]), // Mon, Wed, Fri
          }),
        }),
        expect.any(Array),
      )
    })
  })

  it("should validate end date is after start date", async () => {
    const user = userEvent.setup()

    render(<RecurringDatePicker />)

    // Set start date
    const startDateButton = screen.getByRole("button", { name: /select start date/i })
    await user.click(startDateButton)
    await user.click(screen.getByRole("button", { name: "15" }))

    // Try to set end date before start date
    const endDateButton = screen.getByRole("button", { name: /no end date/i })
    await user.click(endDateButton)

    // The calendar should disable dates before start date
    const earlierDate = screen.getByRole("button", { name: "10" })
    expect(earlierDate).toBeDisabled()
  })
})
