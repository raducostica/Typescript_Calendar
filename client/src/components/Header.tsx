import React from "react";
import Layout from "./Layout";

import headerStyles from "../styles/header.module.css";

interface HeaderProps {
  handleClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Header: React.FC<HeaderProps> = ({ handleClick }) => {
  return (
    <Layout>
      <div style={{ padding: "2rem" }}>
        <div
          style={{
            display: "flex",
            paddingTop: "3rem",
          }}
        >
          <p style={{ fontSize: "4rem" }}>
            <span
              style={{ fontSize: "5.5rem", fontFamily: "Monoton, cursive" }}
            >
              C
            </span>
            oding
          </p>
          <p
            style={{
              fontSize: "4rem",
              paddingTop: "3rem",
            }}
          >
            <span
              style={{ fontSize: "5.5rem", fontFamily: "Monoton, cursive" }}
            >
              C
            </span>
            alendar
          </p>
        </div>
        <p
          style={{ padding: "2.5rem", textAlign: "center", fontSize: "1.2rem" }}
        >
          Track your progress starting today
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={handleClick} className={headerStyles.signUpBtn}>
            Sign Up
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Header;
