import React, { createContext, useReducer } from "react";

export interface Auth {
  token: string;
  isAuthenticated: boolean;
  loading: boolean;
  error: string;
  user: User;
}

export interface User {
  email: string;
  username: string;
  github_user: string | null;
  points: number;
  start_challenge: string;
}

type Actions =
  | { type: "SIGN_IN"; token: string }
  | { type: "REGISTER"; token: string }
  | { type: "START_CHALLENGE"; date: string };

export const reducer = (state: Auth, action: Actions) => {
  switch (action.type) {
    case "SIGN_IN":
    case "REGISTER":
      localStorage.setItem("token", action.token);
      return {
        ...state,
        token: action.token,
        isAuthenticated: true,
        loading: false,
      };
    case "START_CHALLENGE":
      return {
        ...state,
        start_challenge: action.date,
      };
  }
};
