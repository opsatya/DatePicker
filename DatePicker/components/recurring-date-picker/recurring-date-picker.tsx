"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RecurrenceOptions } from "./recurrence-options"
import { DateRangePicker } from "./date-range-picker"
import { MiniCalendarPreview } from "./mini-calendar-preview"
import { useRecurringDateStore } from "../../store/recurring-date-store"

interface RecurringDatePickerProps {
  onSave?: (config: any, previewDates: Date[]) => void
  onCancel?: () => void
}

export const RecurringDatePicker: React.FC<RecurringDatePickerProps> = ({ onSave, onCancel }) => {
  const { config, previewDates, generatePreviewDates, reset } = useRecurringDateStore()

  React.useEffect(() => {
    generatePreviewDates()
  }, [generatePreviewDates])

  const handleSave = () => {
    onSave?.(config, previewDates)
  }

  const handleCancel = () => {
    reset()
    onCancel?.()
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Recurring Date Picker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Recurrence Options */}
            <div className="space-y-4">
              <RecurrenceOptions />
              <DateRangePicker />
            </div>

            {/* Right Column - Calendar Preview */}
            <div className="lg:col-span-2">
              <MiniCalendarPreview />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={previewDates.length === 0}>
              Save Recurrence
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
