import React, { useContext } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";

import Calendar from "./components/Calendar";

import Layout from "./components/Layout";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => {
  return (
    <Router>
      <>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <ProtectedRoute exact path="/challenge" component={Calendar} />
        </Switch>
      </>
    </Router>
  );
};

export default App;
