import React from "react";
import { FaUserAlt } from "react-icons/fa";

import calendarStyles from "../../styles/calendar.module.css";

const CalendarUserProfile: React.FC = () => {
  return (
    <>
      <div className={calendarStyles.calendarSideProfileInfo}>
        <div className={calendarStyles.calendarSideProfile}>
          <FaUserAlt className={calendarStyles.profileIcon} />
        </div>
        <p>Name</p>
      </div>
    </>
  );
};

export default CalendarUserProfile;
