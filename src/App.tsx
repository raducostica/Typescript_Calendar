import React from "react";
import "./App.css";

import Calendar from "./components/Calendar";

import Layout from "./components/Layout";

import Navbar from "./components/Navbar";

const App: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Layout>
        <Calendar />
      </Layout>
    </div>
  );
};

export default App;
