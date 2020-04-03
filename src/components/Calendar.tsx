import React, { useState, useEffect } from "react";

import calendarStyles from "../styles/calendar.module.css";

interface WeekDays {
  [key: number]: string;
}

const getDaysinMonth = (month: number, year: number): number => {
  return 32 - new Date(year, month, 32).getDate();
};

const getArrayOfDayComponent = (year: number, month: number, today: number) => {
  let days: object[] = [];
  let firstDay: number = new Date(year, month).getDay();
  let numOfDays: number = getDaysinMonth(month, year);
  let day = 1;

  for (let i = 1; i < 50; i++) {
    if (day > numOfDays) {
      break;
    } else if (i <= firstDay) {
      days.push(<span></span>);
    } else {
      if (
        day === today &&
        month === new Date().getMonth() &&
        year === new Date().getFullYear()
      ) {
        days.push(<span className={calendarStyles.active}>{day}</span>);
      } else {
        days.push(<span>{day}</span>);
      }
      day++;
    }
  }

  console.log(days);

  return days;
};

const getDaysOfWeek = () => {
  let daysOfWeek: object[] = [];
  let week: WeekDays = {
    1: "Sunday",
    2: "Monday",
    3: "Tuesday",
    4: "Wednesday",
    5: "Thursday",
    6: "Friday",
    7: "Saturday"
  };

  for (let i in week) {
    daysOfWeek.push(
      <div key={week[i]} className={calendarStyles.days}>
        {week[i]}
      </div>
    );
  }

  return daysOfWeek;
};

interface Days {
  days: object[];
  today: number;
  month: number;
  year: number;
  monthName: string;
  challengeDays: number;
  startDate: number;
  startMonth: number;
  active: boolean;
}

const Calendar: React.FC = () => {
  const [state, setState] = useState<Days>({
    days: [],
    today: 0,
    month: 0,
    year: 0,
    monthName: "",
    challengeDays: 0,
    startDate: 4,
    startMonth: 0,
    active: false
  });

  const check = () => {
    let startDate = state.startDate;
    let startMonth = state.startMonth;
    let firstDay: number = new Date(state.year, state.month).getDay();
    // making copy of days array which holds component of each day in a month
    let temp = [...state.days];
    // keeping track of challenge days in each month
    let challengeDays: number = 0;

    let now = new Date();
    now.setDate(now.getDay() + 100);

    let date2 = new Date(now);
    let endDate = date2.getDate();
    let endMonth = date2.getMonth();
    if (state.month === startMonth) {
      for (let i = startDate + firstDay; i < temp.length; i++) {
        temp.splice(
          i,
          1,
          <div className={calendarStyles.challenge}>{i - firstDay + 1}</div>
        );
        challengeDays++;
      }
    } else if (state.month === endMonth) {
      for (let i = firstDay; i < endDate + firstDay; i++) {
        temp.splice(
          i,
          1,
          <div className={calendarStyles.challenge}>{i - firstDay + 1}</div>
        );
        challengeDays++;
      }
    } else {
      for (let i = firstDay; i < temp.length; i++) {
        temp.splice(
          i,
          1,
          <div className={calendarStyles.challenge}>{i - firstDay + 1}</div>
        );
        challengeDays++;
      }
    }

    setState({
      ...state,
      challengeDays: state.challengeDays + challengeDays,
      days: temp,
      active: true
    });
  };

  useEffect(() => {
    if (state.active && state.challengeDays < 100) {
      console.log(state.challengeDays);
      check();
    }

    return () => {
      console.log(state.challengeDays);
    };
  }, [state.month]);

  useEffect(() => {
    let month = new Date().getMonth();
    let year = new Date().getFullYear();
    let today = new Date().getDay();
    setState({
      days: getArrayOfDayComponent(year, month, today),
      today: today,
      month: month,
      year: year,
      monthName: getMonthName(month),
      challengeDays: state.challengeDays,
      startDate: 4,
      startMonth: month,
      active: false
    });
  }, []);

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

  const changeMonth = (op: string) => {
    let month = 0;
    if (op === "+") {
      month = state.month + 1;
    } else if (op === "-") {
      month = state.month - 1;
    }
    let days = getArrayOfDayComponent(state.year, month, state.today);
    let year = state.year;
    if (month === 12 && op === "+") {
      year = state.year + 1;
      month = 0;
    } else if (month < 0 && op === "-") {
      year = state.year - 1;
      month = 11;
    }
    setState({
      ...state,
      days,
      month: month,
      year,
      monthName: getMonthName(month)
    });
  };

  return (
    <>
      <button onClick={() => check()}>start challenge</button>
      <div>{state.monthName}</div>
      <div>{state.year}</div>
      <div className={calendarStyles.calendar}>{getDaysOfWeek()}</div>
      <div className={calendarStyles.days}>{state.days}</div>
      <button onClick={() => changeMonth("-")}>prev</button>
      <button onClick={() => changeMonth("+")}>next</button>
    </>
  );
};

export default Calendar;
