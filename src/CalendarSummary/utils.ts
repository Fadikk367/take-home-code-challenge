import { getCalendarEvents, CalendarEvent } from '../api-client';


export interface DailySummary {
  date: string;
  totalEventsDuration: number;
  longestEvent: CalendarEvent | null;
  eventsCount: number;
}


export async function fetchCalendarSummary(startDate: Date, daysCount: number): Promise<DailySummary[]> {
  const dailySummaries: DailySummary[] = [];
  const dates = datesGenerator(startDate, daysCount);
  
  for (const date of dates) {
    const dailyEvents = await getCalendarEvents(date);
    const dailySummary = generateDailySummary(date, dailyEvents)
    dailySummaries.push(dailySummary);
  }

  return dailySummaries;
}


function* datesGenerator(startDate: Date, daysCount: number): Generator<Date> {
  let count = 0;

  while (count < daysCount) {
    const nextDay = new Date(startDate);
    nextDay.setDate(startDate.getDate() + count++);
    yield nextDay;
  }
}


function generateDailySummary(day: Date, events: CalendarEvent[]): DailySummary {
  return {
    date: day.toISOString().substring(0, 10),
    totalEventsDuration: events.reduce((total, event) => total + event.durationInMinutes, 0),
    longestEvent: findLongestEvent(events),
    eventsCount: events.length
  }
}


export function findLongestEvent(events: CalendarEvent[]): CalendarEvent | null {
  if (events.length === 0)
    return null;

  let longestEvent = events[0];
  for (let i = 1; i < events.length; i++) {
    if (events[i].durationInMinutes > longestEvent.durationInMinutes) {
      longestEvent = events[i]
    }
  }

  return longestEvent;
}