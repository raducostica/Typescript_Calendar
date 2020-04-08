import React, { createContext, useReducer, useEffect } from "react";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import { userInfo } from "os";

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
    chall_Start: string | null;
    pointsdate: string | null;
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
    chall_Start: "",
    pointsdate: "",
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
          pointsdate: "",
        },
      };
    case "UPDATE_POINTS":
      return {
        ...state,
        user: {
          email: state.user.email,
          username: state.user.username,
          github_user: state.user.github_user,
          points: action.payload.points,
          chall_Start: state.user.chall_Start,
          pointsdate: action.payload.date,
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

      console.log(res);

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

      dispatch({ type: "REGISTER", payload: res.data.token });
      loadUser();
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

  const updatePoints = async (date: string) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let currentDate = new Date();
    let lastUpdated = new Date(date);
    let points = state.user.points;

    if (
      (currentDate.getDate() > lastUpdated.getDate() &&
        currentDate.getMonth() === lastUpdated.getMonth() &&
        currentDate.getFullYear() === lastUpdated.getFullYear()) ||
      (currentDate.getMonth() > lastUpdated.getMonth() &&
        currentDate.getFullYear() === lastUpdated.getFullYear())
    ) {
      points += 10;

      let data = {
        date: currentDate,
        points,
      };

      const res = await axios.post("/api/users/pointsdate", data, config);

      dispatch({ type: "UPDATE_POINTS", payload: data });
    }
    console.log(state.user);
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
        updatePoints,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
