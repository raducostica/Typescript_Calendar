import React, { useState, useEffect } from "react";

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

  useEffect(() => {
    console.log("year change");
    getAllMonthsInYear(state.year);
  }, [state.year]);

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

  return (
    <>
      <div>{getMonthName(state.month)}</div>
      <div>{state.year}</div>
      <button onClick={() => startChallenge()}>start challenge</button>
      <div className={calendarStyles.calendar}>
        {daysOfWeek().map(day => {
          return <div>{day}</div>;
        })}
      </div>
      <div className={calendarStyles.days}>
        {state.currentMonth.map(day => {
          let month = new Date().getMonth();
          let year = new Date().getFullYear();
          if (day.id === 0) {
            return <div></div>;
          } else if (
            day.id === state.today &&
            state.month === month &&
            state.year === year
          ) {
            return <div className={calendarStyles.active}>{day.id}</div>;
          } else if (day.selected === true && state.startYear === state.year) {
            return <div className={calendarStyles.challenge}>{day.id}</div>;
          } else {
            return <div>{day.id}</div>;
          }
        })}
      </div>
      <button onClick={() => changeMonth("-")}>prev</button>
      <button onClick={() => changeMonth("+")}>next</button>
    </>
  );
};

export default Calendar;
