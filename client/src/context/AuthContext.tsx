import React, { createContext, useReducer } from "react";
import axios from "axios";

import { User, Auth, reducer } from "./AuthReducer";

export const AuthContext = createContext<any>(null);

const AuthProvider: React.FC = ({ children }) => {
  const initialState: Auth = {
    token: "",
    isAuthenticated: false,
    loading: true,
    error: "",
    user: {
      email: "",
      username: "",
      github_user: null,
      points: 0,
      start_challenge: "",
    },
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async (data: { email: string; password: string }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post("/api/auth", data, config);

      console.log(res.data);
      dispatch({ type: "SIGN_IN", token: res.data });
    } catch (error) {
      console.log(error);
    }
  };

  const register = async (data: {
    email: string;
    username: string;
    password: string;
    github_user?: string;
  }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post("/api/users", data, config);

      dispatch({ type: "REGISTER", token: res.data });
    } catch (error) {
      return console.log(error);
    }
  };

  const startChallenge = async (data: { date: string }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post("/api/users/start", data, config);

      dispatch({ type: "START_CHALLENGE", date: data.date });
    } catch (error) {
      return console.log(error);
    }
  };
  return (
    <AuthContext.Provider value={{ login, register, startChallenge }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
