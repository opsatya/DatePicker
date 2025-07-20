# Recurring Date Picker Component

A comprehensive, reusable React component for selecting recurring dates, similar to the functionality found in TickTick and other calendar applications.

## Features

- **Multiple Recurrence Types**: Daily, Weekly, Monthly, and Yearly patterns
- **Advanced Customization**: 
  - Custom intervals (every X days/weeks/months/years)
  - Weekly: Select specific days of the week
  - Monthly: Choose between date-based ("15th of every month") or weekday-based ("second Tuesday of every month", "last Friday of every month")
- **Date Range Selection**: Start date with optional end date
- **Visual Preview**: Mini calendar showing highlighted recurring dates
- **State Management**: Built with Zustand for efficient state handling
- **Fully Typed**: Complete TypeScript support
- **Tested**: Comprehensive unit and integration tests
- **Responsive**: Works on desktop and mobile devices

## Quick Start

### Installation

\`\`\`bash
npm install
\`\`\`

### Development

\`\`\`bash
# Start development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Build for production
npm run build
\`\`\`

### Basic Usage

\`\`\`tsx
import { RecurringDatePicker } from './components/recurring-date-picker/recurring-date-picker'

function MyApp() {
  const handleSave = (config, previewDates) => {
    console.log('Recurrence config:', config)
    console.log('Generated dates:', previewDates)
    
    // Save to your backend or local storage
    // config contains all the recurrence settings
    // previewDates contains the first 50 generated dates
  }

  const handleCancel = () => {
    console.log('User cancelled')
  }

  return (
    <RecurringDatePicker 
      onSave={handleSave}
      onCancel={handleCancel}
    />
  )
}
\`\`\`

## API Reference

### RecurringDatePicker Props

| Prop | Type | Description |
|------|------|-------------|
| \`onSave\` | \`(config: RecurrenceConfig, previewDates: Date[]) => void\` | Called when user saves the recurrence configuration |
| \`onCancel\` | \`() => void\` | Called when user cancels the configuration |

### RecurrenceConfig Type

\`\`\`typescript
interface RecurrenceConfig {
  type: "daily" | "weekly" | "monthly" | "yearly"
  interval: number // every X days/weeks/months/years
  startDate: Date
  endDate?: Date
  weeklyPattern?: {
    daysOfWeek: number[] // 0 = Sunday, 1 = Monday, etc.
  }
  monthlyPattern?: {
    type: "date" | "weekday"
    date?: number // for "15th of every month"
    weekday?: number // 0 = Sunday
    weekNumber?: number // 1 = first, 2 = second, -1 = last
  }
}
\`\`\`

### Example Configurations

#### Daily Recurrence
\`\`\`typescript
{
  type: "daily",
  interval: 2, // every 2 days
  startDate: new Date("2024-01-01"),
  endDate: new Date("2024-12-31")
}
\`\`\`

#### Weekly Recurrence
\`\`\`typescript
{
  type: "weekly",
  interval: 1, // every week
  startDate: new Date("2024-01-01"),
  weeklyPattern: {
    daysOfWeek: [1, 3, 5] // Monday, Wednesday, Friday
  }
}
\`\`\`

#### Monthly Weekday Recurrence
\`\`\`typescript
{
  type: "monthly",
  interval: 1,
  startDate: new Date("2024-01-09"), // Second Tuesday of January
  monthlyPattern: {
    type: "weekday",
    weekday: 2, // Tuesday
    weekNumber: 2 // Second Tuesday of each month
  }
}
\`\`\`

#### Last Friday of Every Month
\`\`\`typescript
{
  type: "monthly",
  interval: 1,
  startDate: new Date("2024-01-26"), // Last Friday of January
  monthlyPattern: {
    type: "weekday",
    weekday: 5, // Friday
    weekNumber: -1 // Last Friday of each month
  }
}
\`\`\`

## Architecture

### Component Structure

\`\`\`
components/recurring-date-picker/
├── recurring-date-picker.tsx     # Main container component
├── recurrence-options.tsx        # Recurrence type and pattern selection
├── date-range-picker.tsx         # Start/end date selection
└── mini-calendar-preview.tsx     # Visual calendar preview

store/
└── recurring-date-store.ts       # Zustand state management

utils/
└── date-utils.ts                 # Date manipulation utilities
\`\`\`

### State Management

The component uses Zustand for state management, providing:
- Centralized recurrence configuration
- Automatic preview date generation
- Reactive updates across all components

### Date Generation Algorithm

The recurrence engine handles complex patterns:

1. **Daily**: Simple interval-based addition
2. **Weekly**: Finds next occurrence of selected weekdays
3. **Monthly**: 
   - Date-based: Same date each month (with month-end handling)
   - Weekday-based: Nth weekday of each month (e.g., "second Tuesday")
4. **Yearly**: Same date each year

### Edge Case Handling

- **End Date Validation**: Ensures end date is after start date
- **Month Boundaries**: Handles months without the target date (e.g., 31st)
- **Weekday Patterns**: Gracefully handles months without the Nth weekday
- **Performance**: Limits generation to 50 dates with early termination
- **Invalid Patterns**: Prevents infinite loops with empty or invalid patterns

## Testing

### Running Tests

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run specific test file
npm test recurrence-engine.test.ts
\`\`\`

### Test Coverage

- **Unit Tests**: Date utilities, store logic, recurrence engine
- **Integration Tests**: Complete user workflows
- **Edge Cases**: Invalid patterns, boundary conditions, performance

### Example Test Scenarios

- Monthly "second Tuesday" pattern generation
- Weekly multi-day selection
- End date validation
- Performance with large date ranges

## Design Decisions & Trade-offs

### State Management Choice: Zustand
- **Why**: Lightweight, TypeScript-friendly, minimal boilerplate
- **Trade-off**: Less ecosystem than Redux, but sufficient for this use case

### Date Library: date-fns
- **Why**: Modular, immutable, excellent TypeScript support
- **Trade-off**: Larger bundle than native Date, but much more reliable

### UI Framework: shadcn/ui
- **Why**: Consistent design system, accessible components, customizable
- **Trade-off**: Opinionated styling, but provides excellent defaults

### Preview Limitation: 50 dates
- **Why**: Prevents performance issues with infinite recurrences
- **Trade-off**: May not show all dates for very long ranges, but covers 99% of use cases

### Monthly Weekday Complexity
- **Why**: Spports advanced patterns like "last Friday of month"
- **Trade-off**: More complex logic, but essential for business applications

## Browser Support

- Modern browsers with ES2020 support
- React 18+
- TypeScript 5+

## License

MIT License - see LICENSE file for details
