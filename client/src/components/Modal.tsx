import React, { useState, useEffect } from "react";

import modalStyles from "../styles/modal.module.css";

interface Props {
  activeModal: boolean;
  handleCloseModal: () => void;
  handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: () => void;
  content: string;
  date: string;
}

const Modal: React.FC<Props> = ({
  activeModal,
  handleCloseModal,
  handleChange,
  handleSubmit,
  content,
  date,
}) => {
  const [totalText, setTotalText] = useState(300);

  useEffect(() => {
    if (content === "") {
      setTotalText(300);
    }
  }, [content]);

  const handleText = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode === 8) {
      if (totalText === 300) {
        return;
      }
      setTotalText(totalText + 1);
    } else if (totalText > 0) {
      setTotalText(totalText - 1);
    }
  };

  return (
    <>
      {activeModal ? (
        <>
          <div className={modalStyles.overlay}></div>
          <div className={modalStyles.modal}>
            <h3>Notes</h3>
            <p>Adding Note for {date}</p>
            <div className={modalStyles.content}>
              <label htmlFor="note">My Note</label>
              <textarea
                name="note"
                id=""
                cols={20}
                rows={7}
                value={content}
                onKeyDown={handleText}
                maxLength={300}
                onChange={handleChange}
              ></textarea>
              <p>{totalText}</p>
            </div>
            <div className={modalStyles.btnContainer}>
              <button onClick={handleCloseModal}>Cancel</button>
              <button onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Modal;
