import React, { useEffect, useState, useMemo } from 'react';
import { CalendarEvent } from '../api-client';

import { DailySummary, fetchCalendarSummary, findLongestEvent } from './utils';

import './CalendarSummary.css';


const CalendarSummary: React.FunctionComponent = () => {
  const [dailySummaries, setDailySummaries] = useState<DailySummary[]>([]);

  const longestEvent = useMemo(() => {
    const longetsEventsOfTheDays = dailySummaries
      .map(dailySummary => dailySummary.longestEvent)
      .filter(event => event !== null) as CalendarEvent[];

    return findLongestEvent(longetsEventsOfTheDays);
  }, [dailySummaries]);

  useEffect(() => {
    async function fetchSummary(fromDay: Date, daysCount: number) {
      const eventsMap = await fetchCalendarSummary(fromDay, daysCount);
      setDailySummaries(eventsMap);
    }

    fetchSummary(new Date(), 7);
  }, []);
  
  return (
    <div className="page-container">
      <h2 className="page-header">Calendar summary</h2>
      <table id="summary-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Number of events</th>
            <th>Total duration [min]</th>
            <th>Longest event</th>
          </tr>
        </thead>
        <tbody>
          {dailySummaries.map(dailySummary => (
            <tr key={dailySummary.date}>
              <td>{dailySummary.date}</td>
              <td>{dailySummary.eventsCount}</td>
              <td>{dailySummary.totalEventsDuration}</td>
              <td>{dailySummary.longestEvent?.title}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td>{dailySummaries.reduce((total, dailySummary) => total + dailySummary.eventsCount, 0)}</td>
            <td>{dailySummaries.reduce((total, dailySummary) => total + dailySummary.totalEventsDuration, 0)}</td>
            <td>{longestEvent?.title}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default CalendarSummary;