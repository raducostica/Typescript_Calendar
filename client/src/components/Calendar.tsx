import React, { useState, useEffect, useContext } from "react";
import Layout from "./Layout";

import calendarStyles from "../styles/calendar.module.css";

// components
import CalendarComp from "./calendarComponents/CalendarComp";
import CalendarTitle from "./calendarComponents/CalendarTitle";
import CalendarUserProfile from "./calendarComponents/CalendarUserProfile";
import CalendarSideMonths from "./calendarComponents/CalendarSideMonths";
import { AuthContext } from "../context/AuthContext";

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
  const { user, updateStartChallenge } = useContext(AuthContext);
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
    currentMonth: [],
  });

  useEffect(() => {
    let month = new Date().getMonth();
    let year = new Date().getFullYear();
    let today = new Date().getDate();
    let days = getAllMonthsInYear(year);
    let startDate = 0;
    let startMonth = 0;
    let startYear = 0;
    let challengeDays = 0;
    let active = false;

    let currentMonth = days.find((day) => day[month])!;

    setState({
      days,
      month,
      year,
      today,
      challengeDays,
      startDate,
      startMonth,
      active,
      startYear,
      currentMonth,
    });
  }, []);

  useEffect(() => {
    if (user.chall_start) {
      // get date user started challenege
      let date = new Date(user.chall_start);
      // starting day
      let startDate = date.getDate() - 1;
      // starting month
      let startMonth = date.getMonth() + 1;
      // starting year
      let startYear = date.getFullYear();
      // keep track of how many days we loop over
      let challengeDays = 0;

      // get first day of the month
      let firstDay: number = new Date(state.year, state.month).getDay();

      // copy array which holds the months and days for the year
      let tempDays = [...state.days];
      console.log(tempDays);

      for (let i = 0; i < tempDays.length; i++) {
        if (i === startMonth) {
          for (let j = startDate + firstDay; j < tempDays[i].length; j++) {
            if (j >= startDate) {
              tempDays[i][j].selected = true;
              challengeDays++;
            }
          }
        } else if (i > startMonth) {
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

      setState({
        ...state,
        startDate,
        startMonth,
        startYear,
        days: tempDays,
        currentMonth,
        challengeDays,
        active: true,
      });
    }
  }, [user.chall_start]);

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
      "Saturday",
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
      "December",
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

    updateStartChallenge({ date: `${month}-${day}-${year}` });

    for (let i = 0; i < tempDays.length; i++) {
      if (i === month) {
        for (let j = day + firstDay; j < tempDays[i].length; j++) {
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
      startYear: year,
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
        month,
      });
    } else {
      setState({
        ...state,
        currentMonth,
        year,
        month,
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
      month,
    });
  };

  return (
    <Layout>
      <section className={calendarStyles.container}>
        <div className={calendarStyles.calendarMonthsInfo}>
          <CalendarUserProfile />
          <CalendarSideMonths
            stateMonth={state.month}
            getMonthName={getMonthName}
            handleEvent={handleEvent}
          />
        </div>
        <div className={calendarStyles.calendar}>
          <CalendarTitle
            startChallenge={startChallenge}
            changeMonth={changeMonth}
            getMonthName={getMonthName}
            stateMonth={state.month}
            stateYear={state.year}
          />
          <CalendarComp
            stateYear={state.year}
            daysOfWeek={daysOfWeek}
            currentMonth={state.currentMonth}
            stateToday={state.today}
            stateMonth={state.month}
            startYear={state.startYear}
          />
        </div>
      </section>
    </Layout>
  );
};

export default Calendar;