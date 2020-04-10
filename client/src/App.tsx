import React, { useContext } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";

import Calendar from "./pages/Calendar";

import Layout from "./components/Layout";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Leaderboard from "./pages/Leaderboard";

const App: React.FC = () => {
  return (
    <Router>
      <>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <ProtectedRoute exact path="/challenge" component={Calendar} />
          <ProtectedRoute exact path="/leaderboard" component={Leaderboard} />
        </Switch>
      </>
    </Router>
  );
};

export default App;
