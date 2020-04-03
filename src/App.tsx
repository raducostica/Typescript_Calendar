import React from "react";
import "./App.css";

import Calendar from "./components/Calendar";

import Layout from "./components/Layout";

const App: React.FC = () => {
  return (
    <div>
      <Layout>
        <Calendar />
      </Layout>
    </div>
  );
};

export default App;
