import "./Header.css";
import profileimage from "../Assets/profile.png";
import { useState, useEffect } from "react";
import UpdateIcon from "@mui/icons-material/Update";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAuthContext } from "../../Hooks/useAuthContext";

dayjs.extend(relativeTime);
const Header = () => {

const { user, dispatch } = useAuthContext();

useEffect(() => {
    if (user === null) return;
    if (user.coordinates === null) {
      getUserCoordinates();
    }
  }, [user]);

const url = `http://localhost:8000`;
  const navigate = useNavigate();
  const gotoEdit = () => {
    navigate("/edit-profile");
};

const jsdate = () => {
    const isodate = new Date(user.created_at);
    const normalDate = dayjs(isodate).format("YYYY-MM-DD ");
    return dayjs(normalDate).fromNow();
};
const update = () => {
    if (user.coordinates == null) {
      getUserCoordinates();
      return;
    }
    const isotime = new Date(user.coordinates.last_updated);
    return dayjs(isotime).fromNow();
};

  return (
    <div className="headerContainer">
      <div className="profile">
        <img src={profileimage} alt="profile image" className="profileImage" />
        <div className="profileContent">
          <h2 className="name">
            {user && user.first_name && user.last_name
              ? user.first_name + " " + user.last_name
              : "" + " " + ""}
          </h2>
          <h4 className="date">
            Joined {user ? jsdate() : `Saturday, 12th june 2023`}
          </h4>
          <button className="editbutton" onClick={gotoEdit}>
            Edit Profile
          </button>
        </div>
      </div>
      <div className="lastUpdate">
        <div className="updateBox">
          <div id="google_translate_element"></div>
          <div className="updateText">
            <button className="refresh" onClick={getUserCoordinates}>
              <UpdateIcon className="updateIcon" />
            </button>
            <h4>Location Last Updated:</h4>
            <div className="data">{user ? update() : "12:30am "}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
