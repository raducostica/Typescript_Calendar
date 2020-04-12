import React, { useState, useContext, ReactNode } from "react";
import { AuthContext } from "../context/AuthContext";
import AuthScreens from "./AuthScreens";

import authStyles from "../styles/authStyles.module.css";

import { FaArrowRight, FaEnvelope, FaLock } from "react-icons/fa";

interface LoginProps {
  handleClick: () => void;
}

const Login: React.FC<LoginProps> = ({ handleClick }) => {
  const { login } = useContext(AuthContext);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (user.email === "" || user.password === "") {
        setUser({
          email: "",
          password: "",
        });
      }
      login({ email: user.email, password: user.password });
    } catch (error) {
      setUser({
        email: "",
        password: "",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <>
      <AuthScreens
        handleSubmit={handleSubmit}
        title="Login"
        buttonText="Sign Up"
        type="Don't have an account?"
        handleClick={handleClick}
      >
        <>
          <div className={authStyles.inputGroup}>
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={user.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(e)
              }
            />
            <FaEnvelope className={authStyles.icon} size={25} />
          </div>
          <div className={authStyles.inputGroup}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(e)
              }
            />
            <FaLock size={25} className={authStyles.icon} />
          </div>
        </>
      </AuthScreens>
    </>
  );
};

export default Login;
