import React, { useContext } from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

import calendarStyles from "../../styles/calendar.module.css";
import { GiSevenPointedStar } from "react-icons/gi";
import { AuthContext } from "../../context/AuthContext";

interface Props {
  startChallenge: () => void;
  changeMonth: (op: string) => void;
  getMonthName: (month: number) => string;
  stopChallenge: () => void;
  stateMonth: number;
  stateYear: number;
  userChallStart: string;
}

const CalendarTitle: React.FC<Props> = ({
  startChallenge,
  changeMonth,
  getMonthName,
  stateMonth,
  stateYear,
  userChallStart,
  stopChallenge,
}) => {
  const { user } = useContext(AuthContext);
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {!userChallStart ? (
          <button
            className={calendarStyles.startChallengeBtn}
            onClick={() => startChallenge()}
          >
            Start Shallenge
          </button>
        ) : (
          <button
            className={`${calendarStyles.startChallengeBtn} ${calendarStyles.stopBtn}`}
            onClick={() => stopChallenge()}
          >
            Stop Challenge
          </button>
        )}
        <div style={{ display: "flex", alignItems: "center" }}>
          <GiSevenPointedStar size={30} />
          <p style={{ paddingLeft: "0.5rem" }}>Points: {user.points}</p>
        </div>
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
