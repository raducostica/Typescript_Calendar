import React, { createContext, useReducer } from "react";
import axios from "axios";

interface Auth {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface Data {
  email: string;
  password: string;
}

const initialState: Auth = {
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

type Actions = { type: "SIGN_IN"; payload: string };

export const AuthContext = createContext<any>(null);

const reducer = (state: Auth, action: Actions) => {
  switch (action.type) {
    case "SIGN_IN":
      localStorage.setItem("token", action.payload.token);
      return {};
  }
};

const AuthProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async (data: Data) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post("/api/auth", data, config);

      console.log(res.data);
      dispatch({ type: "SIGN_IN", payload: res.data });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <AuthContext.Provider value={{ login }}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
