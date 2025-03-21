import React from "react";
import styles from "./Spinner.module.css";

const Spinner = () => {
  return (
    <div
      className={`${styles.spin} mx-auto min-vh-100 d-flex flex-column justify-content-center`}
    ></div>
  );
};

export default Spinner;
