import React, { useContext } from "react";
import { FaUserAlt } from "react-icons/fa";

import calendarStyles from "../../styles/calendar.module.css";
import { AuthContext } from "../../context/AuthContext";

const CalendarUserProfile: React.FC = () => {
  const { user } = useContext(AuthContext);
  return (
    <>
      <div className={calendarStyles.calendarSideProfileInfo}>
        <div className={calendarStyles.calendarSideProfile}>
          <FaUserAlt className={calendarStyles.profileIcon} />
        </div>
        <p>{user.username}</p>
      </div>
    </>
  );
};

export default CalendarUserProfile;
