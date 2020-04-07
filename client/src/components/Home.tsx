import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { History, LocationState } from "history";
import AuthScreens from "./AuthScreens";
import Layout from "./Layout";

import homeStyles from "../styles/home.module.css";
import Login from "./Login";
import Register from "./Register";

interface Props {
  history: History<LocationState>;
}

const Home: React.FC<Props> = (props) => {
  const { isAuthenticated } = useContext(AuthContext);

  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push("/challenge");
    }
  }, [props.history, isAuthenticated]);

  return (
    <div className={homeStyles.home}>
      <div className={homeStyles.homeLeft}>Left Side</div>
      {!active ? (
        <Login handleClick={handleClick} />
      ) : (
        <Register handleClick={handleClick} />
      )}
    </div>
  );
};

export default Home;
