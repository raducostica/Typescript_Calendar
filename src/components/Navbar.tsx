import React from "react";

import { GiSevenPointedStar } from "react-icons/gi";

import navStyles from "../styles/navbar.module.css";

const Navbar = () => {
  return (
    <nav className={navStyles.navbar}>
      <div className={navStyles.navContainer}>
        <h2>100DaysOfCode</h2>
        <div>
          <GiSevenPointedStar size={30} />
          <p>Points: 55</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
