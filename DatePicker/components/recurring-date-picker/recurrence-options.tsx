"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useRecurringDateStore, type RecurrenceType } from "../../store/recurring-date-store"
import { getDayName } from "../../utils/date-utils"

const getOrdinalNumber = (num: number): string => {
  const ordinals = ["", "first", "second", "third", "fourth", "fifth"]
  return ordinals[num] || `${num}th`
}

export const RecurrenceOptions: React.FC = () => {
  const { config, setRecurrenceType, setInterval, setWeeklyPattern, setMonthlyPattern } = useRecurringDateStore()

  const handleRecurrenceTypeChange = (value: RecurrenceType) => {
    setRecurrenceType(value)
  }

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 1
    setInterval(Math.max(1, value))
  }

  const handleWeeklyDayToggle = (dayIndex: number, checked: boolean) => {
    const currentDays = config.weeklyPattern?.daysOfWeek || []
    const newDays = checked ? [...currentDays, dayIndex] : currentDays.filter((day) => day !== dayIndex)

    setWeeklyPattern({ daysOfWeek: newDays })
  }

  const handleMonthlyPatternChange = (type: "date" | "weekday") => {
    if (type === "date") {
      setMonthlyPattern({
        type: "date",
        date: config.startDate.getDate(),
      })
    } else {
      setMonthlyPattern({
        type: "weekday",
        weekday: config.startDate.getDay(),
        weekNumber: Math.ceil(config.startDate.getDate() / 7),
      })
    }
  }

  const getIntervalLabel = () => {
    switch (config.type) {
      case "daily":
        return config.interval === 1 ? "day" : "days"
      case "weekly":
        return config.interval === 1 ? "week" : "weeks"
      case "monthly":
        return config.interval === 1 ? "month" : "months"
      case "yearly":
        return config.interval === 1 ? "year" : "years"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recurrence Pattern</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recurrence Type */}
        <div className="space-y-2">
          <Label>Repeat</Label>
          <Select value={config.type} onValueChange={handleRecurrenceTypeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Interval */}
        <div className="flex items-center space-x-2">
          <Label>Every</Label>
          <Input type="number" min="1" value={config.interval} onChange={handleIntervalChange} className="w-20" />
          <span className="text-sm text-muted-foreground">{getIntervalLabel()}</span>
        </div>

        {/* Weekly Pattern */}
        {config.type === "weekly" && (
          <div className="space-y-2">
            <Label>On days</Label>
            <div className="grid grid-cols-7 gap-2">
              {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
                <div key={dayIndex} className="flex items-center space-x-1">
                  <Checkbox
                    id={`day-${dayIndex}`}
                    checked={config.weeklyPattern?.daysOfWeek.includes(dayIndex) || false}
                    onCheckedChange={(checked) => handleWeeklyDayToggle(dayIndex, checked as boolean)}
                  />
                  <Label htmlFor={`day-${dayIndex}`} className="text-xs">
                    {getDayName(dayIndex).slice(0, 3)}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monthly Pattern */}
        {config.type === "monthly" && (
          <div className="space-y-2">
            <Label>Monthly pattern</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="monthly-date"
                  checked={config.monthlyPattern?.type === "date"}
                  onCheckedChange={() => handleMonthlyPatternChange("date")}
                />
                <Label htmlFor="monthly-date" className="text-sm">
                  On day {config.startDate.getDate()} of every month
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="monthly-weekday"
                  checked={config.monthlyPattern?.type === "weekday"}
                  onCheckedChange={() => handleMonthlyPatternChange("weekday")}
                />
                <Label htmlFor="monthly-weekday" className="text-sm">
                  On the {getOrdinalNumber(Math.ceil(config.startDate.getDate() / 7))}{" "}
                  {getDayName(config.startDate.getDay())} of every month
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="monthly-last-weekday"
                  checked={config.monthlyPattern?.type === "weekday" && config.monthlyPattern?.weekNumber === -1}
                  onCheckedChange={() =>
                    setMonthlyPattern({
                      type: "weekday",
                      weekday: config.startDate.getDay(),
                      weekNumber: -1,
                    })
                  }
                />
                <Label htmlFor="monthly-last-weekday" className="text-sm">
                  On the last {getDayName(config.startDate.getDay())} of every month
                </Label>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
