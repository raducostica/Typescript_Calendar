import React from "react";

import calendarStyles from "../../styles/calendar.module.css";

interface Props {
  stateYear: number;
  daysOfWeek: () => string[];
  currentMonth: Array<{ id: number; selected: boolean }>;
  stateToday: number;
  stateMonth: number;
  startYear: number;
}

const CalendarComp: React.FC<Props> = ({
  stateYear,
  daysOfWeek,
  currentMonth,
  stateToday,
  stateMonth,
  startYear,
}) => {
  return (
    <>
      <div className={calendarStyles.weekDays}>
        {daysOfWeek().map((day, i) => {
          return (
            <div key={i} style={{ padding: "1rem" }}>
              {day}
            </div>
          );
        })}
      </div>
      <div className={calendarStyles.days}>
        {currentMonth.map((day, i) => {
          let month = new Date().getMonth();
          let year = new Date().getFullYear();
          if (day.id === 0) {
            return <div key={i} className={calendarStyles.day}></div>;
          } else if (
            day.id === stateToday &&
            stateMonth === month &&
            stateYear === year
          ) {
            return (
              <div
                key={i}
                className={`${calendarStyles.activeDay} ${calendarStyles.day}`}
              >
                <p style={{ fontSize: 16 }}>{day.id}</p>
              </div>
            );
          } else if (day.selected === true && startYear === stateYear) {
            return (
              <div
                key={i}
                className={`${calendarStyles.challenge} ${calendarStyles.day}`}
              >
                <p style={{ fontSize: 16 }}>{day.id}</p>
              </div>
            );
          } else {
            return (
              <div key={i} className={calendarStyles.day}>
                <p style={{ fontSize: 16 }}>{day.id}</p>
              </div>
            );
          }
        })}
      </div>
    </>
  );
};

export default CalendarComp;
