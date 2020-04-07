import React, { createContext, useReducer, useEffect } from "react";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

interface IState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  user: {
    email: string;
    username: string;
    github_user: string | null;
    points: number;
    challStart: string | null;
  };
}

interface IAction {
  type: string;
  payload: any;
}

const initialState: IState = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  isLoading: true,
  error: "",
  user: {
    email: "",
    username: "",
    github_user: "",
    points: 0,
    challStart: "",
  },
};
export const AuthContext = createContext<IState | any>(initialState);

const reducer = (state: IState, action: IAction) => {
  switch (action.type) {
    case "SIGN_IN":
    case "REGISTER":
      localStorage.setItem("token", action.payload);
      return {
        ...state,
        token: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOAD_USER":
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        user: {
          email: "",
          username: "",
          github_user: "",
          points: 0,
          chall_Start: "",
        },
      };
    default:
      return state;
  }
};

const AuthProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    console.log(state.user);
  }, [state.user]);

  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    try {
      const res = await axios.get("/api/users");

      dispatch({ type: "LOAD_USER", payload: res.data[0] });
    } catch (error) {
      return console.log(error);
    }
  };

  const login = async (data: { email: string; password: string }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post("/api/auth", data, config);

      console.log(state.isAuthenticated);
      dispatch({ type: "SIGN_IN", payload: res.data.token });
      loadUser();
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

      dispatch({ type: "REGISTER", payload: res.data });
    } catch (error) {
      return console.log(error);
    }
  };

  const logout = async () => {
    dispatch({ type: "LOGOUT", payload: "" });
  };

  const updateStartChallenge = async (data: { date: string }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post("/api/users/start", data, config);

      dispatch({ type: "START_CHALLENGE", payload: data.date });
    } catch (error) {
      return console.log(error);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        user: state.user,
        login,
        loadUser,
        updateStartChallenge,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
