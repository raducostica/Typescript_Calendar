import React, { useContext, useState, Children, Component } from "react";
import { AuthContext } from "../context/AuthContext";

import { FaArrowRight, FaEnvelope, FaLock } from "react-icons/fa";

import authStyles from "../styles/authStyles.module.css";

interface Props {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void | undefined;
  title: string;
  type: string;
  buttonText: string;
  handleClick: () => void;
}

const AuthScreens: React.FC<Props> = ({
  handleSubmit,
  title,
  type,
  buttonText,
  children,
  handleClick,
}) => {
  return (
    <div className={authStyles.auth}>
      <div className={authStyles.authContainer}>
        <div className={authStyles.authTitle}>
          <h2>{title}</h2>
          <p>Let's get Started</p>
        </div>
        <form onSubmit={(e) => handleSubmit(e)}>
          {children}
          <div className={authStyles.loginBtn}>
            <button type="submit">
              <FaArrowRight />
            </button>
          </div>
        </form>
        <p>
          {type}
          <button onClick={handleClick} className={authStyles.signUpBtn}>
            {buttonText}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthScreens;
