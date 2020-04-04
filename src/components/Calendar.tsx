import React, { useState, useEffect } from "react";
import { FaUserAlt } from "react-icons/fa";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

import calendarStyles from "../styles/calendar.module.css";

interface Calendar {
  days: Array<Array<{ id: number; selected: boolean }>>;
  year: number;
  month: number;
  today: number;
  challengeDays: number;
  startDate: number;
  startMonth: number;
  startYear: number;
  active: boolean;
  currentMonth: Array<{ id: number; selected: boolean }>;
}

const Calendar = () => {
  const [state, setState] = useState<Calendar>({
    days: [],
    month: 0,
    year: 0,
    today: 0,
    challengeDays: 0,
    startDate: 0,
    startMonth: 0,
    active: false,
    startYear: 0,
    currentMonth: []
  });

  // useEffect(() => {
  //   console.log("year change");
  //   getAllMonthsInYear(state.year);
  // }, [state.year]);

  useEffect(() => {
    let month = new Date().getMonth();
    let year = new Date().getFullYear();
    let today = new Date().getDate();
    let days = getAllMonthsInYear(year);
    let currentMonth = days.find(day => day[month])!;
    setState({
      days,
      month,
      year,
      today,
      challengeDays: 100,
      startDate: 4,
      startMonth: 0,
      active: false,
      startYear: 0,
      currentMonth
    });
  }, []);

  const getDaysinMonth = (month: number, year: number): number => {
    return 32 - new Date(year, month, 32).getDate();
  };

  const daysOfWeek = (): string[] => {
    return [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
  };

  const getMonthName = (month: number) => {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    return months[month];
  };

  const getAllMonthsInYear = (
    year: number
  ): Array<Array<{ id: number; selected: boolean }>> => {
    let arrayOfYear = [];

    for (let i = 0; i < 12; i++) {
      let monthArr = [];
      let totalDays = getDaysinMonth(i, year);
      let firstDay: number = new Date(year, i).getDay();
      for (let j = 1 - firstDay; j < totalDays + 1; j++) {
        if (j < 1) {
          monthArr.push({ id: 0, selected: false });
        } else {
          monthArr.push({ id: j, selected: false });
        }
      }

      arrayOfYear.push(monthArr);
    }

    return arrayOfYear;
  };

  const startChallenge = () => {
    let month = new Date().getMonth();
    let year = new Date().getFullYear();
    let day = new Date().getDate();
    let firstDay: number = new Date(year, month).getDay();

    let tempDays = [...state.days];
    let challengeDays = 0;

    for (let i = 0; i < tempDays.length; i++) {
      if (i === month) {
        for (
          let j = state.startDate + firstDay - 1;
          j < tempDays[i].length;
          j++
        ) {
          if (j >= day) {
            tempDays[i][j].selected = true;
            challengeDays++;
          }
        }
      } else if (i > month) {
        for (let j = 0; j < tempDays[i].length; j++) {
          if (challengeDays === 101) {
            break;
          }

          if (tempDays[i][j].id !== 0) {
            tempDays[i][j].selected = true;
            challengeDays++;
          }
        }
      }
    }

    let currentMonth = getCurrentMonthArray(state.month);
    console.log(challengeDays);

    setState({
      ...state,
      currentMonth,
      days: tempDays,
      challengeDays,
      startMonth: month,
      startDate: day,
      startYear: year
    });
  };

  const getCurrentMonthArray = (
    month: number
  ): { id: number; selected: boolean }[] => {
    return state.days[month];
  };

  const changeMonth = (op: string) => {
    let month = 0;
    let days: Array<Array<{ id: number; selected: boolean }>> = [];
    if (op === "+") {
      month = state.month + 1;
    } else if (op === "-") {
      month = state.month - 1;
    }
    let year = state.year;
    if (month === 12 && op === "+") {
      year = state.year + 1;
      month = 0;
      days = getAllMonthsInYear(year);
    } else if (month < 0 && op === "-") {
      year = state.year - 1;
      month = 11;
      days = getAllMonthsInYear(year);
    }

    let currentMonth = getCurrentMonthArray(month);

    if (days.length !== 0) {
      setState({
        ...state,
        days,
        currentMonth,
        year,
        month
      });
    } else {
      setState({
        ...state,
        currentMonth,
        year,
        month
      });
    }
  };

  const handleEvent = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    let month = Number(e.currentTarget.getAttribute("data-id"));
    let currentMonth = getCurrentMonthArray(month);
    setState({
      ...state,
      currentMonth,
      month
    });
  };

  return (
    <>
      <section className={calendarStyles.container}>
        <div className={calendarStyles.calendarMonthsInfo}>
          <div className={calendarStyles.calendarSideProfileInfo}>
            <div className={calendarStyles.calendarSideProfile}>
              <FaUserAlt className={calendarStyles.profileIcon} />
            </div>
            <p>Name</p>
          </div>
          <div className={calendarStyles.calendarSideMonthInfo}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => {
              if (i === state.month) {
                return (
                  <div
                    className={`${calendarStyles.calendarSideMonths} ${calendarStyles.activeMonth}`}
                    data-id={i}
                    onClick={e => handleEvent(e)}
                  >
                    <p>{getMonthName(i)}</p>
                  </div>
                );
              } else {
                return (
                  <div
                    className={calendarStyles.calendarSideMonths}
                    data-id={i}
                    onClick={e => handleEvent(e)}
                  >
                    <p>{getMonthName(i)}</p>
                  </div>
                );
              }
            })}
          </div>
        </div>
        <div className={calendarStyles.calendar}>
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
                  {getMonthName(state.month)}
                </p>
                <IoIosArrowForward
                  style={{ cursor: "pointer" }}
                  size={25}
                  onClick={() => changeMonth("+")}
                />
              </div>
              <p style={{ fontSize: 16 }}>{state.year}</p>
            </div>
          </div>
          <div className={calendarStyles.weekDays}>
            {daysOfWeek().map(day => {
              return <div style={{ padding: "1rem" }}>{day}</div>;
            })}
          </div>
          <div className={calendarStyles.days}>
            {state.currentMonth.map(day => {
              let month = new Date().getMonth();
              let year = new Date().getFullYear();
              if (day.id === 0) {
                return <div className={calendarStyles.day}></div>;
              } else if (
                day.id === state.today &&
                state.month === month &&
                state.year === year
              ) {
                return (
                  <div
                    className={`${calendarStyles.activeDay} ${calendarStyles.day}`}
                  >
                    <p style={{ fontSize: 16 }}>{day.id}</p>
                  </div>
                );
              } else if (
                day.selected === true &&
                state.startYear === state.year
              ) {
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
        </div>
      </section>
    </>
  );
};

export default Calendar;
