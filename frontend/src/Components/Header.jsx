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

const url = `http://localhost:8000`;
  const navigate = useNavigate();
  const gotoEdit = () => {
    navigate("/edit-profile");
};

useEffect(() => {
    if (user === null) return;
    if (user.coordinates === null) {
      getUserCoordinates();
    }
  }, [user]);

  useEffect(() => {
    var addScript = document.createElement("script");
    addScript.setAttribute(
      "src",
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    );
    document.body.appendChild(addScript);
    window.googleTranslateElementInit = googleTranslateElementInit;
  }, []);

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

  // geoLocation
  const geolocationAPI = navigator.geolocation;
  const getUserCoordinates = () => {
    if (!geolocationAPI) {
      toast.error("Geolocation API is not available in your browser!");
      return;
    } else {
      geolocationAPI.getCurrentPosition(
        (position) => {
          const { coords } = position;
          try {
            let { data } = axios.post(
              `${url}/accounts/location/`,
              {
                email: user.email ? user.email : "",
                longitude: coords.longitude,
                latitude: coords.latitude,
              },
              {
                headers: {
                  "Content-type": "application/json",
                },
              }
            );
            dispatch({
              type: "LOCATION",
              payload: {
                last_updated: new Date().toISOString(),
                longitude: coords.longitude,
                latitude: coords.latitude,
              },
            });
            toast.success("Location updated successfully");
          } catch (error) {
            if (error.response.status === 400) {
              toast.error(error.response.data.message);
            } else {
              toast.error("Something went wrong!");
            }
          }
        },
        (error) => {
          toast.error(error.message);
        }
      );
    }
  };

const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        layout: window.google.translate.TranslateElement.FloatPosition.TOP_LEFT,
      },
      "google_translate_element"
    );
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
