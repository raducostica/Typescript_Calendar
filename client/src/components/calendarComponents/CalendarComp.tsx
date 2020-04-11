import React, { useState, useContext } from "react";

import calendarStyles from "../../styles/calendar.module.css";
import Modal from "../Modal";
import { NoteContext } from "../../context/NoteContext";
import { AuthContext } from "../../context/AuthContext";

import SingleDay from "./SingleDay";

interface Props {
  stateYear: number;
  daysOfWeek: () => string[];
  currentMonth: Array<{
    id: number;
    selected: boolean;
    completed: boolean;
    content: { nid: number; content: string; createdon: string }[];
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
  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentID, setCurrentID] = useState<number>(0);

  const handleDayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setActiveModal(true);
    setEditMode(false);
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
    addNote({ nid: noteState.length + 1, content, createdon: date });
    setActiveModal(false);
    setContent("");
  };

  const handleEditNoteModal = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    setActiveModal(true);
    let id = Number(e.currentTarget.parentElement?.getAttribute("data-id"));
    let noteContent: any = noteState.notes.find((note: any) => note.nid === id);
    console.log(noteState.notes);

    setCurrentID(id);

    setContent(noteContent.content);
    setEditMode(true);
  };

  return (
    <>
      <Modal
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        editMode={editMode}
        handleCloseModal={handleCloseModal}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        content={content}
        date={date}
        currentID={currentID}
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
                <SingleDay
                  handleEditNoteModal={handleEditNoteModal}
                  key={i}
                  handleDayClick={handleDayClick}
                  day={day}
                  index={i}
                  classNameDay={`${calendarStyles.activeDay} ${calendarStyles.day}`}
                  stateYear={stateYear}
                />
              );
            }
            return (
              <SingleDay
                handleEditNoteModal={handleEditNoteModal}
                key={i}
                handleDayClick={handleDayClick}
                day={day}
                index={i}
                classNameDay={`${calendarStyles.activeDay} ${calendarStyles.day}`}
                stateYear={stateYear}
              />
            );
          } else if (day.completed) {
            if (day.content.length > 0) {
              return (
                <SingleDay
                  handleEditNoteModal={handleEditNoteModal}
                  key={i}
                  handleDayClick={handleDayClick}
                  day={day}
                  index={i}
                  classNameDay={`${calendarStyles.challengeComplete} ${calendarStyles.day}`}
                  stateYear={stateYear}
                />
              );
            }
            return (
              <SingleDay
                handleEditNoteModal={handleEditNoteModal}
                key={i}
                handleDayClick={handleDayClick}
                day={day}
                index={i}
                classNameDay={`${calendarStyles.challengeComplete} ${calendarStyles.day}`}
                stateYear={stateYear}
              />
            );
          } else if (day.selected) {
            if (day.content.length > 0) {
              return (
                <SingleDay
                  handleEditNoteModal={handleEditNoteModal}
                  key={i}
                  handleDayClick={handleDayClick}
                  day={day}
                  index={i}
                  classNameDay={`${calendarStyles.challenge} ${calendarStyles.day}`}
                  stateYear={stateYear}
                />
              );
            }
            return (
              <SingleDay
                handleEditNoteModal={handleEditNoteModal}
                key={i}
                handleDayClick={handleDayClick}
                day={day}
                index={i}
                classNameDay={`${calendarStyles.challenge} ${calendarStyles.day}`}
                stateYear={stateYear}
              />
            );
          } else {
            if (day.content.length > 0) {
              return (
                <SingleDay
                  handleEditNoteModal={handleEditNoteModal}
                  key={i}
                  handleDayClick={handleDayClick}
                  day={day}
                  index={i}
                  classNameDay={calendarStyles.day}
                  stateYear={stateYear}
                />
              );
            }
            return (
              <SingleDay
                handleEditNoteModal={handleEditNoteModal}
                key={i}
                handleDayClick={handleDayClick}
                day={day}
                index={i}
                classNameDay={calendarStyles.day}
                stateYear={stateYear}
              />
            );
          }
        })}
      </div>
    </>
  );
};

export default CalendarComp;
