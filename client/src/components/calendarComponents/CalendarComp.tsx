import React, { useState, useContext } from "react";

import calendarStyles from "../../styles/calendar.module.css";
import Modal from "../Modal";
import { NoteContext } from "../../context/NoteContext";

interface Props {
  stateYear: number;
  daysOfWeek: () => string[];
  currentMonth: Array<{
    id: number;
    selected: boolean;
    completed: boolean;
    content: string[];
  }>;
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
  const { addNote, noteState } = useContext(NoteContext);

  const [activeModal, setActiveModal] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const handleDayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setActiveModal(true);
    let date = `${stateMonth + 1}-${Number(
      e.currentTarget.getAttribute("data-info")
    )}-${stateYear}`;
    setDate(date);
  };

  const handleCloseModal = () => {
    setActiveModal(false);
    setContent("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSubmit = () => {
    addNote({ nid: noteState.notes.length, content, createdon: date });
    setActiveModal(false);
    setContent("");
  };

  return (
    <>
      <Modal
        activeModal={activeModal}
        handleCloseModal={handleCloseModal}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        content={content}
        date={date}
      />
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
            return (
              <div
                key={i}
                style={{ cursor: "default" }}
                className={calendarStyles.day}
              ></div>
            );
          } else if (
            day.id === stateToday &&
            stateMonth === month &&
            stateYear === year
          ) {
            if (day.content.length > 0) {
              return (
                <Element
                  key={i}
                  handleDayClick={handleDayClick}
                  day={day}
                  index={i}
                  classNameDay={`${calendarStyles.activeDay} ${calendarStyles.day}`}
                  content={day.content}
                />
              );
            }
            return (
              <Element
                key={i}
                handleDayClick={handleDayClick}
                day={day}
                index={i}
                classNameDay={`${calendarStyles.activeDay} ${calendarStyles.day}`}
                content={null}
              />
            );
          } else if (
            day.completed &&
            month === stateMonth &&
            stateYear === year
          ) {
            if (day.content.length > 0) {
              return (
                <Element
                  key={i}
                  handleDayClick={handleDayClick}
                  day={day}
                  index={i}
                  classNameDay={`${calendarStyles.challengeComplete} ${calendarStyles.day}`}
                  content={day.content}
                />
              );
            }
            return (
              <Element
                key={i}
                handleDayClick={handleDayClick}
                day={day}
                index={i}
                classNameDay={`${calendarStyles.challengeComplete} ${calendarStyles.day}`}
                content={null}
              />
            );
          } else if (day.selected && startYear === year) {
            if (day.content.length > 0) {
              return (
                <Element
                  key={i}
                  handleDayClick={handleDayClick}
                  day={day}
                  index={i}
                  classNameDay={`${calendarStyles.challenge} ${calendarStyles.day}`}
                  content={day.content}
                />
              );
            }
            return (
              <Element
                key={i}
                handleDayClick={handleDayClick}
                day={day}
                index={i}
                classNameDay={`${calendarStyles.challenge} ${calendarStyles.day}`}
                content={null}
              />
            );
          } else {
            if (day.content.length > 0) {
              return (
                <Element
                  key={i}
                  handleDayClick={handleDayClick}
                  day={day}
                  index={i}
                  classNameDay={calendarStyles.day}
                  content={day.content}
                />
              );
            }
            return (
              <Element
                key={i}
                handleDayClick={handleDayClick}
                day={day}
                index={i}
                classNameDay={calendarStyles.day}
                content={null}
              />
            );
          }
        })}
      </div>
    </>
  );
};

interface elementProps {
  handleDayClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  day: {
    id: number;
    selected: boolean;
    completed: boolean;
    content: string[];
  };
  index: number;
  classNameDay: string;
  content: string[] | null;
}

const Element: React.FC<elementProps> = ({
  handleDayClick,
  day,
  index,
  classNameDay,
  content,
}) => {
  return (
    <div
      data-info={day.id}
      onClick={handleDayClick}
      key={index}
      className={classNameDay}
    >
      <div className={calendarStyles.dayTop}>
        <p>{day.id}</p>
        <p className={calendarStyles.dayAdd} onClick={handleDayClick}>
          +
        </p>
      </div>
      {content?.map((info) => {
        return (
          <p key={index} className={calendarStyles.dayContent}>
            {info}
          </p>
        );
      })}
    </div>
  );
};

export default CalendarComp;
