import React from "react";
import "./LoadingButton.css";
import loader from "./loader.gif";

function LoadingButton({ onClick, text, loading }) {
  return (
    <>
      <button className="input-button" onClick={onClick} disabled={loading}>
        {!loading ? (
          text
        ) : (
          <img className="loader-gif" src={loader} alt="loader" />
        )}
      </button>
    </>
  );
}

export default LoadingButton;
