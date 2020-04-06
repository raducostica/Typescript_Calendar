import React from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

import calendarStyles from "../../styles/calendar.module.css";

interface Props {
  startChallenge: () => void;
  changeMonth: (op: string) => void;
  getMonthName: (month: number) => string;
  stateMonth: number;
  stateYear: number;
}

const CalendarTitle: React.FC<Props> = ({
  startChallenge,
  changeMonth,
  getMonthName,
  stateMonth,
  stateYear,
}) => {
  return (
    <>
      <div>
        <button
          className={calendarStyles.startChallengeBtn}
          onClick={() => startChallenge()}
        >
          start challenge
        </button>
      </div>
      <div className={calendarStyles.calendarTitles}>
        <div className={calendarStyles.calendarHeader}>
          <p style={{ fontSize: 23 }}>Code Calendar</p>
        </div>
        <div className={calendarStyles.calendarMonth}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <IoIosArrowBack
              style={{ cursor: "pointer" }}
              size={25}
              onClick={() => changeMonth("-")}
            />
            <p style={{ fontSize: 18, margin: "0.5rem", width: "5rem" }}>
              {getMonthName(stateMonth)}
            </p>
            <IoIosArrowForward
              style={{ cursor: "pointer" }}
              size={25}
              onClick={() => changeMonth("+")}
            />
          </div>
          <p style={{ fontSize: 16 }}>{stateYear}</p>
        </div>
      </div>
    </>
  );
};

export default CalendarTitle;
