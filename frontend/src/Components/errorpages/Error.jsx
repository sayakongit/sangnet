import React from "react";
import "./Error.css";
import { useNavigate } from "react-router";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="lock"> </div>
      <div className="message">
        <h1 className="errortype">404</h1>
        <p className="errormsg">Opps! Some Error Occurred.</p>
      </div>
      <div className="button">
        <button
          className="errorButton"
          onClick={() => {
            navigate("/login");
          }}
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default Error;
