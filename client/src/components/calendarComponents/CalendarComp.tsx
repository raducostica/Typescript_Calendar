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
        {daysOfWeek().map((day) => {
          return <div style={{ padding: "1rem" }}>{day}</div>;
        })}
      </div>
      <div className={calendarStyles.days}>
        {currentMonth.map((day) => {
          let month = new Date().getMonth();
          let year = new Date().getFullYear();
          if (day.id === 0) {
            return <div className={calendarStyles.day}></div>;
          } else if (
            day.id === stateToday &&
            stateMonth === month &&
            stateYear === year
          ) {
            return (
              <div
                className={`${calendarStyles.activeDay} ${calendarStyles.day}`}
              >
                <p style={{ fontSize: 16 }}>{day.id}</p>
              </div>
            );
          } else if (day.selected === true && startYear === stateYear) {
            return (
              <div
                className={`${calendarStyles.challenge} ${calendarStyles.day}`}
              >
                <p style={{ fontSize: 16 }}>{day.id}</p>
              </div>
            );
          } else {
            return (
              <div className={calendarStyles.day}>
                {" "}
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
