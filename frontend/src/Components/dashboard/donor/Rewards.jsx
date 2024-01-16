import React from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import "./Rewards.css";
import { Box } from "@mui/material";

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
    <Box sx={{bgcolor : "background.default" , height : "100vh"}}>
      <Box className="sidebarReward">
        <Sidebar {...sidebarProp} />
      </Box>
      <Box className="headerReward">
        <Header />
      </Box>
    </Box>
  );
};

export default Rewards;
