import React, { useContext } from "react";
import { NoteContext } from "../../context/NoteContext";
import calendarStyles from "../../styles/calendar.module.css";

interface elementProps {
  handleDayClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  day: {
    id: number;
    selected: boolean;
    completed: boolean;
    content: { nid: number; content: string; createdon: string }[];
  };
  index: number;
  classNameDay: string;
  stateYear: number;
  handleEditNoteModal: (
    event: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => void;
}

const SingleDay: React.FC<elementProps> = ({
  handleDayClick,
  day,
  index,
  classNameDay,
  stateYear,
  handleEditNoteModal,
}) => {
  const { deleteNote } = useContext(NoteContext);

  const handleDeleteNote = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    deleteNote(Number(e.currentTarget.getAttribute("data-id")));
  };

  const handleLongContent = () => {
    return (
      <>
        {day.content.slice(0, 3).map((info, i) => {
          if (stateYear === new Date(info.createdon).getFullYear()) {
            return (
              <div
                data-id={info.nid}
                key={i}
                style={{
                  display: "flex",
                  background: "#b380ff",
                  justifyContent: "space-between",
                  border: "1px dotted #444",
                  maxHeight: "20%",
                }}
              >
                {info.content.length > 10 ? (
                  <p
                    className={calendarStyles.dayContent}
                    style={{
                      cursor: "pointer",
                      width: "85%",
                      height: "100%",
                    }}
                    onClick={handleEditNoteModal}
                  >
                    {i + 1}.
                    {info.content
                      .slice(0, 10)
                      .slice(0, info.content.lastIndexOf(" "))}
                    ...
                  </p>
                ) : (
                  <p
                    className={calendarStyles.dayContent}
                    style={{
                      cursor: "pointer",
                      width: "85%",
                      height: "100%",
                    }}
                    onClick={handleEditNoteModal}
                  >
                    {i + 1}.{info.content}
                  </p>
                )}
                <button
                  style={{
                    background: "blue",
                    maxHeight: "100%",
                    width: "15%",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    outline: "none",
                    border: "none",
                    cursor: "pointer",
                    position: "relative",
                    zIndex: 5,
                    color: "#f7f7f7",
                  }}
                  data-id={info.nid}
                  onClick={handleDeleteNote}
                >
                  -
                </button>
              </div>
            );
          }
        })}
        {day.content.length > 3 ? (
          <button
            style={{
              background: "#333",
              color: "#fff",
              position: "absolute",
              zIndex: 1,
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              height: "10px",
              border: "none",
              fontSize: "10px",
              outline: "none",
              cursor: "pointer",
            }}
          >
            View More
          </button>
        ) : null}
      </>
    );
  };

  return (
    <div data-info={day.id} key={index} className={classNameDay}>
      <div className={calendarStyles.dayTop}>
        <p>{day.id}</p>
        <p
          data-info={day.id}
          className={calendarStyles.dayAdd}
          onClick={handleDayClick}
        >
          +
        </p>
      </div>
      {handleLongContent()}
    </div>
  );
};

export default SingleDay;
