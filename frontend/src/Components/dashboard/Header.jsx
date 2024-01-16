import "./Header.css";
import profileimage from "../Assets/profile.png";
import React, { useState, useEffect } from "react";
import UpdateIcon from "@mui/icons-material/Update";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAuthContext } from "../../Hooks/useAuthContext";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  MenuItem,
  Popover,
  Stack,
  Typography,

} from "@mui/material";

import ThemeToggleButton from "../UI/ThemeToggleButton";


dayjs.extend(relativeTime);
const Header = () => {
  // get request to udpateprofile api
  // const [response, setResponse] = useState(null);
  const { user, dispatch } = useAuthContext();

  const url = `http://localhost:8000`;
  const navigate = useNavigate();
  const access = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");
  
  // const gotoEdit = () => {
  //   navigate("/edit-profile");
  // };
  // const fetchdata = async (user_id) => {
  //   try {
  //     let data = await axios.get(`${url}/accounts/profile/${user_id}`);
  //     setResponse(data);
  //     localStorage.setItem("is_donor", data.data.is_donor);
  //     localStorage.setItem("donor_id", data.data.donor_id);
  //   } catch (error) {
  //     if (error.response.status === 400) {
  //       toast.error(error.response.data.message);
  //     } else {
  //       toast.error("Something went wrong!");
  //     }
  //   }
  // };

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

  // useEffect(() => {
  //   const user_id = localStorage.getItem("user_id");
  //   if (user_id === null) return;
  //   fetchdata(user_id);
  // }, []);

  useEffect(() => {
    if (user === null) return;
    if (user.coordinates === null) {
      getUserCoordinates();
    }
  }, [user]);
  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        layout: window.google.translate.TranslateElement.FloatPosition.TOP_LEFT,
      },
      "google_translate_element"
    );
  };

  useEffect(() => {
    var addScript = document.createElement("script");
    addScript.setAttribute(
      "src",
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    );
    document.body.appendChild(addScript);
    window.googleTranslateElementInit = googleTranslateElementInit;
  }, []);

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const MENU_OPTIONS = [
    {
      label: "Home",
      onClick: () => {
        navigate("#");
      },
    },
    {
      label: "Edit Profile",
      onClick: () => {
        navigate("/edit-profile");
      },
    },
    {
      label: "Location Update",
      onClick: () => {
        getUserCoordinates();
      },
    },
  ];

  const signOut = async () => {
    try {
      let { data } = await axios.post(
        `${url}/accounts/logout/`,
        {
          refresh_token: refresh,
        },
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
      localStorage.clear();
      toast.success("Signed out successfully");

      dispatch({ type: "LOGOUT" });
      navigate("/login", { replace: true });
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
  return (
    <>
      <Box sx={{bgcolor : "background.default"}} className="headerContainer">
        <Box className="profile">
          {/* <img src={profileimage} alt="profile image" className="profileImage" /> */}
          <Box className="profileContent">
            <Typography variant="h4">
              <span style={{ color: "#40339f" }}>Hi, </span>
              {user && user.first_name && user.last_name
                ? user.first_name + " " + user.last_name
                : "" + " " + ""}
            </Typography>
            {/* <h2 className="name">
            {user && user.first_name && user.last_name
              ? user.first_name + " " + user.last_name
              : "" + " " + ""}
          </h2> */}
            {/* <h4 className="date">
            Joined {user ? jsdate() : `Saturday, 12th june 2023`}
          </h4>
          <button className="editbutton" onClick={gotoEdit}>
            Edit Profile
          </button> */}
          </Box>
        </Box>
        <Box className="lastUpdate">
          <Box className="updateBox">
            <Box id="google_translate_element"></Box>
            {/* <Box className="updateText">
            <button className="refresh" onClick={getUserCoordinates}>
              <UpdateIcon className="updateIcon" />
            </button>
            <h4>Location Last Updated:</h4>
            <Box className="data">{user ? update() : "12:30am "}</Box>
          </Box> */}
          </Box>
          <Box>
            <IconButton
              onClick={handleOpen}
              sx={{
                p: 0,
                ...(open && {
                  "&:before": {
                    zIndex: 1,
                    content: "''",
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    position: "absolute",
                    // bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
                  },
                }),
              }}
            >
              <Avatar sx={{ bgcolor: "#40339f" }}>
                {user?.first_name.charAt(0) + user?.last_name.charAt(0)}
              </Avatar>
            </IconButton>

            <Popover
              open={Boolean(open)}
              anchorEl={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{
                sx: {
                  p: 0,
                  mt: 1.5,
                  ml: 0.75,
                  width: 180,
                  "& .MuiMenuItem-root": {
                    typography: "body2",
                    borderRadius: 0.75,
                  },
                },
              }}
            >
              <Box sx={{ my: 1.5, px: 2.5 }}>
                <Typography variant="subtitle2" noWrap>
                  {user && user.first_name && user.last_name
                    ? user.first_name + " " + user.last_name
                    : "" + " " + ""}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary" }}
                  noWrap
                >
                  {user?.email}
                </Typography>
              </Box>

              <Divider sx={{ borderStyle: "dashed" }} />

              <Stack sx={{ p: 1 }}>
                {MENU_OPTIONS.map((option) => (
                  <MenuItem key={option.label} onClick={option.onClick}>
                    {option.label}
                  </MenuItem>
                ))}
              </Stack>
              <Divider sx={{ borderStyle: "dashed" }} />
              <Stack sx={{ p: 1 }}>
                <MenuItem onClick={signOut}>Sign Out</MenuItem>
              </Stack>
            </Popover>
          {/*  */}
          <ThemeToggleButton/>  
          </Box>
        </Box>
      </Box>
      <Divider
        sx={{
          color: "#246b38",
          borderBottom: "3px solid #40339f",
          fontWeight: "bold",
          marginBottom: "10px",
        }}
      />
    </>
  );
};

export default Header;
