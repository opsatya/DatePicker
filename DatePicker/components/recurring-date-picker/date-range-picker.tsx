"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, X } from "lucide-react"
import { useRecurringDateStore } from "../../store/recurring-date-store"
import { formatDate } from "../../utils/date-utils"
import { cn } from "@/lib/utils"

export const DateRangePicker: React.FC = () => {
  const { config, setStartDate, setEndDate } = useRecurringDateStore()
  const [startDateOpen, setStartDateOpen] = React.useState(false)
  const [endDateOpen, setEndDateOpen] = React.useState(false)

  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      setStartDate(date)
      setStartDateOpen(false)
    }
  }

  const handleEndDateSelect = (date: Date | undefined) => {
    if (date) {
      setEndDate(date)
      setEndDateOpen(false)
    }
  }

  const clearEndDate = () => {
    setEndDate(undefined)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Date Range</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Start Date */}
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !config.startDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {config.startDate ? formatDate(config.startDate) : "Select start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={config.startDate} onSelect={handleStartDateSelect} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <Label>End Date (Optional)</Label>
          <div className="flex space-x-2">
            <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1 justify-start text-left font-normal",
                    !config.endDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {config.endDate ? formatDate(config.endDate) : "No end date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={config.endDate}
                  onSelect={handleEndDateSelect}
                  disabled={(date) => date < config.startDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {config.endDate && (
              <Button variant="outline" size="icon" onClick={clearEndDate} className="shrink-0 bg-transparent">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
