import React from "react";
import "./Error.css";
import { useNavigate } from "react-router";
import { Box } from "@mui/material";

const Error = () => {
  const navigate = useNavigate();
  const themeColor = localStorage.getItem("theme");

  return (
    <Box sx={{ backgroundColor: "background.default" }} className="container">
      <Box className="lock"> </Box>
      <Box className="message">
        <h1
          style={{
            color:
              themeColor === null || themeColor === "light" ? "black" : "white",
          }}
          className="errortype"
        >
          404
        </h1>
        <p
          style={{
            color:
              themeColor === null || themeColor === "light" ? "black" : "white",
          }}
          className="errormsg"
        >
          Opps! Some Error Occurred.
        </p>
      </Box>
      <Box className="button">
        <button
          className="errorButton"
          onClick={() => {
            navigate("/login");
          }}
        >
          Home
        </button>
      </Box>
    </Box>
  );
};

export default Error;
