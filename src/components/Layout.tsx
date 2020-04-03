import React from "react";

import layoutStyles from "../styles/layout.module.css";

const Layout: React.FC = ({ children }) => {
  return <div className={layoutStyles.container}>{children}</div>;
};

export default Layout;
