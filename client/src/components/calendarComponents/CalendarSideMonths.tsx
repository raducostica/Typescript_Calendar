import React from "react";

import calendarStyles from "../../styles/calendar.module.css";

interface Props {
  stateMonth: number;
  getMonthName: (month: number) => string;
  handleEvent: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const CalendarSideMonths: React.FC<Props> = ({
  stateMonth,
  getMonthName,
  handleEvent,
}) => {
  return (
    <>
      <div className={calendarStyles.calendarSideMonthInfo}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
          if (i === stateMonth) {
            return (
              <div
                key={i}
                className={`${calendarStyles.calendarSideMonths} ${calendarStyles.activeMonth}`}
                data-id={i}
                onClick={(e) => handleEvent(e)}
              >
                <p>{getMonthName(i)}</p>
              </div>
            );
          } else {
            return (
              <div
                key={i}
                className={calendarStyles.calendarSideMonths}
                data-id={i}
                onClick={(e) => handleEvent(e)}
              >
                <p>{getMonthName(i)}</p>
              </div>
            );
          }
        })}
      </div>
    </>
  );
};

export default CalendarSideMonths;
