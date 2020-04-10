import React, { useState, useEffect, useContext } from "react";
import Layout from "../components/Layout";

import calendarStyles from "../styles/calendar.module.css";

// components
import CalendarComp from "../components/calendarComponents/CalendarComp";
import CalendarTitle from "../components/calendarComponents/CalendarTitle";
import CalendarUserProfile from "../components/calendarComponents/CalendarUserProfile";
import CalendarSideMonths from "../components/calendarComponents/CalendarSideMonths";
import { AuthContext } from "../context/AuthContext";
import { NoteContext } from "../context/NoteContext";

interface Calendar {
  days: Array<
    Array<{
      id: number;
      selected: boolean;
      completed: boolean;
      content: string[];
    }>
  >;
  year: number;
  month: number;
  today: number;
  challengeDays: number;
  startDate: number;
  startMonth: number;
  startYear: number;
  active: boolean;
  currentMonth: Array<{
    id: number;
    selected: boolean;
    completed: boolean;
    content: string[];
  }>;
}

const Calendar = () => {
  const {
    user,
    updateStartChallenge,
    updatePoints,
    isLoading,
    updateGithubPoints,
  } = useContext(AuthContext);

  const { getNotes, noteState } = useContext(NoteContext);

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

  const getDaysSinceStart = (): number => {
    let start = new Date(user.challstart);
    let now = new Date();

    let ms = +now - +start;

    let daysSinceStart = Math.floor(ms / (24 * 60 * 60 * 1000));

    return daysSinceStart;
  };

  const checkDate = () => {
    let todayDate = new Date();
    let githubdate = new Date(user.githubdate);

    if (
      (user.github_user &&
        todayDate.getDate() > githubdate.getDate() &&
        todayDate.getMonth() >= githubdate.getMonth() &&
        todayDate.getFullYear() >= githubdate.getFullYear()) ||
      (user.github_user &&
        todayDate.getDate() <= githubdate.getDate() &&
        todayDate.getMonth() > githubdate.getMonth() &&
        todayDate.getFullYear() >= githubdate.getFullYear())
    ) {
      console.log("updating github points");
      updateGithubPoints(user.githubdate);
    }
  };

  useEffect(() => {
    updatePoints(user.pointsdate);
    getNotes();
    let month = new Date().getMonth();
    let year = new Date().getFullYear();
    let today = new Date().getDate();
    let days = getAllMonthsInYear(year);
    let startDate = 0;
    let startMonth = 0;
    let startYear = 0;
    let challengeDays = 0;
    let active = true;

    let currentMonth = days[month];
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
    // }
  }, []);

  useEffect(() => {
    if (user.challstart && state.active) {
      checkDate();
      // get date user started challenege
      let date = new Date(user.challstart);
      // starting day
      let startDate = date.getDate();
      // starting month
      let startMonth = date.getMonth();
      // starting year
      let startYear = date.getFullYear();
      // keep track of how many days we loop over
      let challengeDays = 0;

      // get first day of the month
      let firstDay: number = new Date(state.year, state.month).getDay();

      // copy array which holds the months and days for the year
      let tempDays = [...state.days];

      let daysSinceStart = getDaysSinceStart() + startDate + firstDay;

      for (let i = 0; i < tempDays.length; i++) {
        if (i === startMonth) {
          for (let j = startDate + firstDay - 1; j < tempDays[i].length; j++) {
            if (j >= startDate) {
              tempDays[i][j].selected = true;
              challengeDays++;
            }

            if (j < daysSinceStart) {
              tempDays[i][j].completed = true;
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

            if (j <= daysSinceStart && tempDays[i][j].id !== 0) {
              tempDays[i][j].completed = true;
            }
          }
        }
      }

      let currentMonth = tempDays[state.month];

      setState({
        ...state,
        days: tempDays,
        challengeDays,
        startDate,
        startMonth,
        startYear,
        currentMonth,
      });
    }
  }, [user.challstart, state.active]);

  useEffect(() => {
    console.log(noteState);
  }, [noteState]);

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
  ): Array<
    Array<{
      id: number;
      selected: boolean;
      completed: boolean;
      content: string[];
    }>
  > => {
    let arrayOfYear = [];

    for (let i = 0; i < 12; i++) {
      let monthArr = [];
      let totalDays = getDaysinMonth(i, year);
      let firstDay: number = new Date(year, i).getDay();
      for (let j = 1 - firstDay; j < totalDays + 1; j++) {
        if (j < 1) {
          monthArr.push({
            id: 0,
            selected: false,
            completed: false,
            content: [],
          });
        } else {
          monthArr.push({
            id: j,
            selected: false,
            completed: false,
            content: [],
          });
        }
      }

      arrayOfYear.push(monthArr);
    }

    return arrayOfYear;
  };

  const addContentToDays = () => {
    let tempDays = [...state.days];

    // tempDays.forEach((day) => {
    //   day.map((d) => {
    //     if (d.content.length > 0) {
    //       d.content = [];
    //     }
    //     return d;
    //   });
    // });

    console.log(tempDays);

    let tempNotes = noteState.notes.sort(function (
      a: {
        nid: number;
        content: string;
        createdon: string;
        userid: number;
      },
      b: {
        nid: number;
        content: string;
        createdon: string;
        userid: number;
      }
    ) {
      let total: any =
        new Date(a.createdon).getTime() - new Date(b.createdon).getTime();
      return total;
    });

    let x = 0;
    for (let i = 0; i < tempDays.length; i++) {
      tempDays[i].map((day) => {
        if (day.content.length > 0) {
          day.content = [];
        }
        if (x < tempNotes.length) {
          let date = new Date(tempNotes[x].createdon);

          if (day.id === date.getDate() && i === date.getMonth()) {
            day.content.push(tempNotes[x].content);
            x++;
          }
        }
      });
    }

    let currentMonth = tempDays[state.month];

    setState({
      ...state,
      days: tempDays,
      currentMonth,
    });
  };

  useEffect(() => {
    if (noteState.notes.length > 0) {
      addContentToDays();
    }
  }, [noteState.notes]);

  const startChallenge = () => {
    let month = new Date().getMonth();
    let year = new Date().getFullYear();
    let day = new Date().getDate();
    let firstDay: number = new Date(year, month).getDay();

    let tempDays = [...state.days];
    let challengeDays = 0;

    updateStartChallenge({ date: `${month + 1}-${day}-${year}` });

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
  ): {
    id: number;
    selected: boolean;
    completed: boolean;
    content: string[];
  }[] => {
    return state.days[month];
  };

  const changeMonth = (op: string) => {
    let month = 0;
    let days: Array<Array<{
      id: number;
      selected: boolean;
      completed: boolean;
      content: string[];
    }>> = [];
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
      <>
        {!isLoading ? (
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
        ) : (
          <div>Loading...</div>
        )}
      </>
    </Layout>
  );
};

export default Calendar;
