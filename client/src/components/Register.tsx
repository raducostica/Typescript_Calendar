import React, { useState, useContext, ReactNode } from "react";
import { AuthContext } from "../context/AuthContext";
import AuthScreens from "./AuthScreens";

import authStyles from "../styles/authStyles.module.css";

import { FaUserAlt, FaEnvelope, FaLock, FaUserTie } from "react-icons/fa";

interface RegisterProps {
  handleClick: () => void;
}

const Register: React.FC<RegisterProps> = ({ handleClick }) => {
  const { register } = useContext(AuthContext);
  const [user, setUser] = useState({
    email: "",
    username: "",
    password: "",
    github_user: "",
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (user.email === "" || user.password === "" || user.username === "") {
        setUser({
          email: "",
          password: "",
          username: "",
          github_user: "",
        });
      }
      register({
        email: user.email,
        username: user.username,
        password: user.password,
        github_user: user.github_user,
      });
    } catch (error) {
      setUser({
        email: "",
        password: "",
        username: "",
        github_user: "",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <>
      <AuthScreens
        handleClick={handleClick}
        handleSubmit={handleSubmit}
        title="Register"
        buttonText="Sign In"
        type="Already have an account?"
      >
        <>
          <div className={authStyles.inputGroupReg}>
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
          <div className={authStyles.inputGroupReg}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={user.username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(e)
              }
            />
            <FaUserAlt className={authStyles.icon} size={25} />
          </div>
          <div className={authStyles.inputGroupReg}>
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
          <div className={authStyles.inputGroupReg}>
            <input
              type="text"
              name="github_user"
              placeholder="Github Username"
              value={user.github_user}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(e)
              }
            />
            <FaUserTie className={authStyles.icon} size={25} />
          </div>
        </>
      </AuthScreens>
    </>
  );
};

export default Register;
