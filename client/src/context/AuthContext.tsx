import React, { createContext, useReducer } from "react";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

interface IState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  user: {
    uid: number | null;
    email: string;
    username: string;
    github_user: string | null;
    points: number;
    challstart: string | null;
    pointsdate: string | null;
    githubdate: string | null;
  };
  allUserPoints: {
    users: { username: string; points: number; row_number: number }[];
    prev: { page: number };
    next: { page: number };
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
    uid: null,
    email: "",
    username: "",
    github_user: "",
    points: 0,
    challstart: "",
    pointsdate: "",
    githubdate: "",
  },
  allUserPoints: {
    users: [],
    prev: { page: 0 },
    next: { page: 0 },
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
    case "GET_POINTS":
      return {
        ...state,
        allUserPoints: action.payload,
        isLoading: false,
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
    let currentDate = new Date("2021-04-13T02:17:44.000Z");
    let lastUpdated = new Date(date);
    let points = state.user.points;

    if (
      (currentDate.getDate() > lastUpdated.getDate() &&
        currentDate.getMonth() === lastUpdated.getMonth() &&
        currentDate.getFullYear() === lastUpdated.getFullYear()) ||
      (currentDate.getDate() <= lastUpdated.getDate() &&
        currentDate.getMonth() > lastUpdated.getMonth() &&
        currentDate.getFullYear() === lastUpdated.getFullYear()) ||
      (currentDate.getDate() > lastUpdated.getDate() &&
        currentDate.getMonth() > lastUpdated.getMonth() &&
        currentDate.getFullYear() === lastUpdated.getFullYear()) ||
      (currentDate.getDate() <= lastUpdated.getDate() &&
        currentDate.getMonth() <= lastUpdated.getMonth() &&
        currentDate.getFullYear() > lastUpdated.getFullYear()) ||
      (currentDate.getDate() > lastUpdated.getDate() &&
        currentDate.getMonth() <= lastUpdated.getMonth() &&
        currentDate.getFullYear() > lastUpdated.getFullYear()) ||
      (currentDate.getDate() > lastUpdated.getDate() &&
        currentDate.getMonth() > lastUpdated.getMonth() &&
        currentDate.getFullYear() > lastUpdated.getFullYear())
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
  };

  const getUserPoints = async (page: number) => {
    try {
      const res = await axios.get(
        `/api/users/leaderboards?page=${page}&limit=1`
      );

      console.log(res.data);
      dispatch({ type: "GET_POINTS", payload: res.data });
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
        allUserPoints: state.allUserPoints,
        login,
        loadUser,
        updateStartChallenge,
        register,
        logout,
        updatePoints,
        updateGithubPoints,
        getUserPoints,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
