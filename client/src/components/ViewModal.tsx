import React from "react";

import modalStyles from "../styles/modal.module.css";

interface ModalProps {
  handleActiveModal: () => void;
}

const ViewModal: React.FC<ModalProps> = ({ handleActiveModal, children }) => {
  return (
    <>
      <div className={modalStyles.overlay}></div>
      <div className={modalStyles.viewModal}>
        {children}
        <button className={modalStyles.cancelBtn} onClick={handleActiveModal}>
          Cancel
        </button>
      </div>
    </>
  );
};

export default ViewModal;
