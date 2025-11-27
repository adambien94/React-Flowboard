import React from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

const Timer = ({ show }: { show: boolean }) => {
  return (
    <Toast
      show={show}
      style={{
        position: "absolute",
        bottom: "30px",
        right: "30px",
      }}
    >
      <Toast.Header closeButton={false}>
        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
        <strong className="me-auto">Bootstrap</strong>
        <small>11 mins ago</small>
      </Toast.Header>
      <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
    </Toast>
  );
};

export default Timer;
