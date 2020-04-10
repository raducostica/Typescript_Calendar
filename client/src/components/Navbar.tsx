import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";

import navStyles from "../styles/navbar.module.css";
import { AuthContext } from "../context/AuthContext";
import { NoteContext } from "../context/NoteContext";

const Navbar = () => {
  const { logout, isAuthenticated, loadUser } = useContext(AuthContext);

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <nav className={navStyles.navbar}>
      <div className={navStyles.navContainer}>
        <h2>
          <Link to="/">100DaysOfCode</Link>
        </h2>
        {isAuthenticated && (
          <ul className={navStyles.navlinks}>
            <li>
              <Link to="/leaderboard"> Leaderboards</Link>
            </li>
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
