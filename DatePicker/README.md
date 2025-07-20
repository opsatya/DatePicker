# Recurring Date Picker

A modern React component for selecting recurring dates with advanced patterns, similar to popular calendar apps like TickTick.

## Features

✨ **Multiple patterns** - Daily, weekly, monthly, and yearly recurrence  
⚙️ **Advanced options** - Custom intervals, specific weekdays, nth weekday patterns  
📅 **Visual preview** - Mini calendar showing your recurring dates  
🎯 **TypeScript** - Fully typed with excellent IntelliSense  
📱 **Responsive** - Works seamlessly on desktop and mobile  

## Installation

```bash
npm install
```

## Quick Start

```tsx
import { RecurringDatePicker } from './components/recurring-date-picker'

function App() {
  return (
    <RecurringDatePicker 
      onSave={(config, dates) => {
        // Handle the recurring pattern
        console.log('Config:', config)
        console.log('Next 50 dates:', dates)
      }}
      onCancel={() => console.log('Cancelled')}
    />
  )
}
```

## Examples

### Every 2 days
```typescript
{
  type: "daily",
  interval: 2,
  startDate: new Date("2024-01-01")
}
```

### Monday, Wednesday, Friday
```typescript
{
  type: "weekly",
  interval: 1,
  startDate: new Date("2024-01-01"),
  weeklyPattern: {
    daysOfWeek: [1, 3, 5] // 0 = Sunday
  }
}
```

### Second Tuesday of every month
```typescript
{
  type: "monthly",
  interval: 1,
  startDate: new Date("2024-01-09"),
  monthlyPattern: {
    type: "weekday",
    weekday: 2, // Tuesday
    weekNumber: 2 // Second occurrence
  }
}
```

### Last Friday of every month
```typescript
{
  type: "monthly",
  interval: 1,
  startDate: new Date("2024-01-26"),
  monthlyPattern: {
    type: "weekday",
    weekday: 5, // Friday
    weekNumber: -1 // Last occurrence
  }
}
```

## API

### Props

| Name | Type | Description |
|------|------|-------------|
| `onSave` | `(config, dates) => void` | Called when user saves the pattern |
| `onCancel` | `() => void` | Called when user cancels |

### RecurrenceConfig

```typescript
interface RecurrenceConfig {
  type: "daily" | "weekly" | "monthly" | "yearly"
  interval: number
  startDate: Date
  endDate?: Date
  
  // Weekly options
  weeklyPattern?: {
    daysOfWeek: number[] // 0=Sun, 1=Mon, etc.
  }
  
  // Monthly options
  monthlyPattern?: {
    type: "date" | "weekday"
    date?: number           // 15th of month
    weekday?: number        // 0=Sun, 1=Mon, etc.
    weekNumber?: number     // 1=first, 2=second, -1=last
  }
}
```

## Development

```bash
# Start dev server
npm run dev

# Run tests
npm test

# Build
npm run build
```

## Architecture

```
components/recurring-date-picker/
├── recurring-date-picker.tsx      # Main component
├── recurrence-options.tsx         # Pattern selection
├── date-range-picker.tsx          # Date inputs
└── mini-calendar-preview.tsx      # Visual preview

store/recurring-date-store.ts      # Zustand state
utils/date-utils.ts               # Date helpers
```

Built with:
- **Zustand** for state management
- **date-fns** for date manipulation
- **shadcn/ui** for components
- **TypeScript** for type safety

## Edge Cases Handled

- End dates before start dates
- Invalid month dates (Feb 30th → Feb 28th/29th)
- Missing weekdays in short months
- Performance limits (50 date preview)

## Browser Support

Modern browsers supporting ES2020+, React 18+, TypeScript 5+

## License

MIT
