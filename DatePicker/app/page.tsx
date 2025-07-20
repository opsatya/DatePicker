"use client"

import { RecurringDatePicker } from "../components/recurring-date-picker/recurring-date-picker"

export default function Home() {
  const handleSave = (config: any, previewDates: Date[]) => {
    console.log("Saved configuration:", config)
    console.log("Preview dates:", previewDates)
    // Here you would typically save to your backend or local storage
  }

  const handleCancel = () => {
    console.log("Cancelled")
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Recurring Date Picker </h1>
        <RecurringDatePicker onSave={handleSave} onCancel={handleCancel} />
      </div>
    </main>
  )
}
