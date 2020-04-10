import React, { createContext, useReducer } from "react";
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
    challstart: string | null;
    pointsdate: string | null;
    githubdate: string | null;
  };
}

type Dispatch = React.Dispatch<IAction>;

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
    challstart: "",
    pointsdate: "",
    githubdate: "",
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
          challstart: "",
          pointsdate: "",
          githubdate: "",
        },
      };
    case "UPDATE_POINTS":
      return {
        ...state,
        user: {
          ...state.user,
          pointsdate: action.payload.date,
          points: action.payload.points,
        },
      };
    case "UPDATE_POINTS_GH":
      return {
        ...state,
        user: {
          ...state.user,
          points: action.payload.points,
          githubdate: action.payload.current,
        },
      };
    default:
      return state;
  }
};

const AuthProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

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

  const updateGithubPoints = async (date: string) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      let current = new Date();
      let points = state.user.points;
      console.log("true");
      points = points + 5;

      let data = {
        github_user: state.user.github_user,
        day: current.getDate(),
        month: current.getMonth() + 1,
        year: current.getFullYear(),
        points,
      };
      const res = await axios.post("/api/commits", data, config);

      dispatch({ type: "UPDATE_POINTS_GH", payload: { current, points } });
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

    console.log(
      currentDate.getDate(),
      currentDate.getMonth(),
      currentDate.getFullYear()
    );
    console.log(
      lastUpdated.getDate(),
      lastUpdated.getMonth(),
      lastUpdated.getFullYear()
    );

    if (
      (currentDate.getDate() > lastUpdated.getDate() &&
        currentDate.getMonth() >= lastUpdated.getMonth() &&
        currentDate.getFullYear() >= lastUpdated.getFullYear()) ||
      (currentDate.getMonth() > lastUpdated.getMonth() + 1 &&
        currentDate.getFullYear() === lastUpdated.getFullYear())
    ) {
      points += 10;

      let data = {
        date: `${
          currentDate.getMonth() + 1
        }-${currentDate.getDate()}-${currentDate.getFullYear()}`,
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
        updateGithubPoints,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
