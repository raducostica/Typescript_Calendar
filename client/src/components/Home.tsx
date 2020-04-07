import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { History, LocationState } from "history";

interface Props {
  history: History<LocationState>;
}

const Home: React.FC<Props> = (props) => {
  const { isAuthenticated, login, loadUser } = useContext(AuthContext);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push("/challenge");
    }
  }, [props.history, isAuthenticated]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      login({ email: user.email, password: user.password });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form action="" onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          name="email"
          value={user.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
        />
        <input
          type="text"
          name="password"
          value={user.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
        />
        <button type="submit">LOGIN</button>
      </form>
    </div>
  );
};

export default Home;
