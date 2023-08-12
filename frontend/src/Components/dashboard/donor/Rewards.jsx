import React from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import "./Rewards.css";

const Rewards = () => {
  const sidebarProp = {
    home: false,
    historyDonor: false,
    rewards: true,
    donor: true,
    active: {
      padding: "20px",
      border: "none",
      textAlign: "center",
      color: "white",
      borderRadius: "20px",
      backgroundColor: "rgba(255, 255, 255, 0.383)",
      cursor: "pointer",
    },
  };
  return (
    <div>
      <div className="sidebarReward">
        <Sidebar {...sidebarProp} />
      </div>
      <div className="headerReward">
        <Header />
      </div>
    </div>
  );
};

export default Rewards;
