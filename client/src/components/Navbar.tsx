import React, { useContext } from "react";

import { GiSevenPointedStar } from "react-icons/gi";

import navStyles from "../styles/navbar.module.css";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { logout, isAuthenticated } = useContext(AuthContext);
  return (
    <nav className={navStyles.navbar}>
      <div className={navStyles.navContainer}>
        <h2>100DaysOfCode</h2>
        {isAuthenticated && (
          <ul className={navStyles.navlinks}>
            <li>Leaderboards</li>
            <li>
              <a onClick={logout} href="#!">
                Logout
              </a>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
