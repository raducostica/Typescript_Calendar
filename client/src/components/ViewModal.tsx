import React from "react";

import modalStyles from "../styles/modal.module.css";

const ViewModal: React.FC = () => {
  return (
    <>
      <div className={modalStyles.overlay}></div>
      <div className={modalStyles.modal}></div>
    </>
  );
};

export default ViewModal;
