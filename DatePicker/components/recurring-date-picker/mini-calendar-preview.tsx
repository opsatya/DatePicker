"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRecurringDateStore } from "../../store/recurring-date-store"
import { getCalendarDays, isDateInArray, getShortDayName } from "../../utils/date-utils"
import { format, addMonths, subMonths, isSameMonth } from "date-fns"
import { cn } from "@/lib/utils"

export const MiniCalendarPreview: React.FC = () => {
  const { previewDates } = useRecurringDateStore()
  const [currentMonth, setCurrentMonth] = React.useState(new Date())

  const calendarDays = getCalendarDays(currentMonth)

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Preview Calendar</span>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">{format(currentMonth, "MMMM yyyy")}</span>
            <Button variant="outline" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1">
            {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
              <div key={dayIndex} className="text-center text-xs font-medium text-muted-foreground p-2">
                {getShortDayName(dayIndex)}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const isCurrentMonth = isSameMonth(day, currentMonth)
              const isRecurringDate = isDateInArray(day, previewDates)
              const isToday = isDateInArray(day, [new Date()])

              return (
                <div
                  key={index}
                  className={cn(
                    "aspect-square flex items-center justify-center text-sm rounded-md transition-colors",
                    isCurrentMonth ? "text-foreground" : "text-muted-foreground",
                    isRecurringDate && "bg-primary text-primary-foreground font-medium",
                    isToday && !isRecurringDate && "bg-accent text-accent-foreground",
                    !isCurrentMonth && "opacity-50",
                  )}
                >
                  {format(day, "d")}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground mt-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-primary rounded-sm"></div>
              <span>Recurring dates</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-accent rounded-sm"></div>
              <span>Today</span>
            </div>
          </div>

          {/* Preview list */}
          {previewDates.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium">Next occurrences:</h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {previewDates.slice(0, 10).map((date, index) => (
                  <div key={index} className="text-xs text-muted-foreground">
                    {format(date, "EEE, MMM dd, yyyy")}
                  </div>
                ))}
                {previewDates.length > 10 && (
                  <div className="text-xs text-muted-foreground italic">...and {previewDates.length - 10} more</div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
