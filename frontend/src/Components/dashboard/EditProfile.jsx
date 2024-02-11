import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingButton from "../UI/LoadingButton";
import "./EditProfile.css";
import { useAuthContext } from "../../Hooks/useAuthContext";
import { Box  , Typography} from "@mui/material";
import ThemeToggleButton from "../UI/ThemeToggleButton";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";



const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [prevData, setprevData] = useState(null);
  const [inputErrorFname, setinputErrorFname] = useState(false);
  const [inputErrorLname, setinputErrorLname] = useState(false);
  const [inputErrorPhone, setinputErrorPhone] = useState(false);
  const [inputErrorAddress, setinputErrorAddress] = useState(false);
  const { user, dispatch } = useAuthContext();
  
  const [value, setValue] = useState(dayjs());

  // const fetchProfileData = async (user_id) => {
  //   try {
  //     let { data } = await axios.get(
  //       `http://localhost:8000/accounts/profile/${user_id}`
  //     );
  //     setprevData(data);
  //     console.log("Data", data);
  //   } catch (error) {
  //     if (error) {
  //       toast.error("Some error happened while retrieving your previous data");
  //     }
  //   }
  // };
  const registerUser = async () => {
    try {
      setLoading(true);
      const user_id = localStorage.getItem("user_id");
      let { data } = await axios.put(
        `http://localhost:8000/accounts/profile/${user_id}/`,
        {
          first_name: prevData.first_name,
          last_name: prevData.last_name,
          phone: prevData.phone,
          address: prevData.address,
        },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );

      dispatch({ type: "LOGIN", payload: prevData });

      toast.success("Profile updated successfully");

      navigate("/");
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong!");
      }
    }
    setLoading(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const handleChange = (e) => {
    if (e.target.name === "fname") {
      if (e.target.value.length > 30 || e.target.value.length === 0) {
        setinputErrorFname(true);
      } else {
        setinputErrorFname(false);
      }
    } else if (e.target.name === "lname") {
      if (e.target.value.length > 30 || e.target.value.length === 0) {
        setinputErrorLname(true);
      } else {
        setinputErrorLname(false);
      }
    } else if (e.target.name === "address") {
      if (e.target.value.length > 100 || e.target.value.length === 0) {
        setinputErrorAddress(true);
      } else {
        setinputErrorAddress(false);
      }
    } else if (e.target.name === "number") {
      if (
        e.target.value.length > 10 ||
        e.target.value.length < 10 ||
        !Number(e.target.value)
      ) {
        setinputErrorPhone(true);
      } else {
        setinputErrorPhone(false);
      }
    }
  };

  useEffect(() => {
    // const user_id = localStorage.getItem("user_id");
    // fetchProfileData(user_id);
    setprevData(user);
    console.log("hye");
  }, [user]);

  
  const themeColor = localStorage.getItem("theme");

  return (
    <Box bgcolor={"background.default"}  className="editContainer">
      <Box className="editContainerLeft">
        <h1 className="logo-h1">Sangnet</h1>
      </Box>
      <Box className="editContainerRight" sx={{display : "flex" , flexDirection : "column"}}>
        <div style={{display : "flex" , justifyContent : "flex-end" , width : "100%" , paddingRight : "1rem"}}>

            <ThemeToggleButton/>  
        </div>
        <Box className="form-container sign-up">
          <Box className="edit_text">
          <h6
              style={{flex : "100%" ,fontSize : "1.25rem" ,color : (themeColor === null || themeColor === "light")?"black":"white"}}
            >
              Edit your profile
            </h6>
          </Box>
          
          <form
          style={{gap : 5 , display : "flex" , flexDirection : "column"}}
            onSubmit={(e) => {
              handleSubmit(e);
            }}
            autoComplete="off"
          >
            {/* name */}
            <Box className="name_container">
              {/* FirstName */}
              <Box className="form-group">
                <label style={{color : (themeColor === null || themeColor === "light")?"black":"white"}} htmlFor="fname" className="input-label">
                  First Name{" "}
                </label>
                <input
                  type="text"
                  name="fname"
                  autoComplete="off"
                  value={prevData?.first_name}
                  placeholder="Enter your first name :"
                  onChange={(e) => {
                    setprevData({ ...prevData, first_name: e.target.value });
                    handleChange(e);
                  }}
                  className="class_fname"
                  style={{
                    backgroundColor : !(themeColor === null || themeColor === "light")?"#121212":"white",
                    border : "0.05px solid rgba(155,155,155,0.35)",
                    color : (themeColor === null || themeColor === "light")?"#121212":"white",
                  }}
                />
                {inputErrorFname && (
                  <p className="errorProfileMsg">enter a valid name</p>
                )}
              </Box>

              {/* LastName */}
              <Box className="form-group">
                <label style={{color : (themeColor === null || themeColor === "light")?"black":"white"}}   htmlFor="lname" className="input-label">
                  Last Name{" "}
                </label>
                <input
                  type="text"
                  name="lname"
                  id="lname"
                  autoComplete="off"
                  placeholder="Enter your last name :"
                  value={prevData?.last_name}
                  onChange={(e) => {
                    setprevData({ ...prevData, last_name: e.target.value });
                    handleChange(e);
                  }}
                  style={{
                    backgroundColor : !(themeColor === null || themeColor === "light")?"#121212":"white",
                    border : "0.05px solid rgba(155,155,155,0.35)",
                    color : (themeColor === null || themeColor === "light")?"#121212":"white",
                  }}
                />
                {inputErrorLname && (
                  <p className="errorProfileMsg">enter a valid name</p>
                )}
              </Box>
            </Box>
            {/* Email */}
            <Box className="form-group">
              <label style={{color : (themeColor === null || themeColor === "light")?"black":"white"}}  htmlFor="email" className="input-label">
                Email{" "}
              </label>
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="off"
                value={prevData?.email}
                placeholder="Enter your email"
                readOnly
                style={{
                  backgroundColor : !(themeColor === null || themeColor === "light")?"#121212":"white",
                  border : "0.05px solid rgba(155,155,155,0.35)",
                  color : (themeColor === null || themeColor === "light")?"#121212":"white",
                }}
              />
            </Box>

            {/* address */}
            <Box className="form-group">
              <label style={{color : (themeColor === null || themeColor === "light")?"black":"white"}}  htmlFor="address" className="input-label">
                Address{" "}
              </label>
              <input
                type="address"
                name="address"
                id="address"
                autoComplete="off"
                value={prevData?.address}
                onChange={(e) => {
                  setprevData({ ...prevData, address: e.target.value });
                  handleChange(e);
                }}
                placeholder="Enter the address : "
                style={{
                  backgroundColor : !(themeColor === null || themeColor === "light")?"#121212":"white",
                  border : "0.05px solid rgba(155,155,155,0.35)",
                  color : (themeColor === null || themeColor === "light")?"#121212":"white",
                }}
              />
              {inputErrorAddress && (
                <p className="errorProfileMsg">enter a valid address</p>
              )}
            </Box>

            {/* Date of Birth */}
            {/* <Box className="form-group">
              <label style={{color : (themeColor === null || themeColor === "light")?"black":"white"}}  htmlFor="date" className="input-label">
                Date of Birth{" "}
              </label>
              <input
                type="date"
                name="date"
                id="date"
                autoComplete="off"
                // style={{ color: "black" }}
                value={prevData?.date_of_birth}
                readOnly
                placeholder="Enter the data of birth"
                style={{
                  color:
                  themeColor === null || themeColor === "light"
                    ? "black"
                    : "lightgray",
                backgroundColor:
                  themeColor === null || themeColor === "light"
                    ? ""
                    : "rgba(150,150,150,0.3)",
              }}
              />
            </Box> */}

            <Box className="form-group">
                  <label
                    style={{
                      color:
                        themeColor === null || themeColor === "light"
                          ? "black"
                          : "white",
                    }}
                    htmlFor="date"
                    className="input-label"
                  >
                    Date of Birth{" "}
                  </label>
                  {/* <input
                    type="date"
                    name="date"
                    id="date"
                    autoComplete="off"
                    placeholder="Enter your Date of Birth"
                    // style={{ color: "black" }}
                    value={values.date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{
                      backgroundColor : !(themeColor === null || themeColor === "light")?"#121212":"white",
                      border : "0.05px solid rgba(155,155,155,0.35)",
                      color : (themeColor === null || themeColor === "light")?"#121212":"white",
                    }}
                  /> */}
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                  name="date"
                  sx={{color : "white"}}
                  value={value}
                  onChange={handleChange}
/>
    </LocalizationProvider>
                  {/* {errors.date && touched.date ? (
                    <Box className="errors">
                      <p>{errors.date}</p>
                    </Box>
                  ) : null} */}
                </Box>

            {/* Phone Number */}
            <Box className="form-group">
              <label style={{color : (themeColor === null || themeColor === "light")?"black":"white"}} htmlFor="number" className="input-label">
                Phone Number{" "}
              </label>
              <input
                type="number"
                name="number"
                id="number"
                autoComplete="off"
                value={prevData?.phone}
                onChange={(e) => {
                  setprevData({ ...prevData, phone: e.target.value });
                  handleChange(e);
                }}
                placeholder="Enter your phone number : "
                style={{
                  backgroundColor : !(themeColor === null || themeColor === "light")?"#121212":"white",
                  border : "0.05px solid rgba(155,155,155,0.35)",
                  color : (themeColor === null || themeColor === "light")?"#121212":"white",
                }}
              />
              {inputErrorPhone && (
                <p className="errorProfileMsg">enter a valid number</p>
              )}
            </Box>
            {/* Adhaar card number */}
            <Box className="form-group">
              <label style={{color : (themeColor === null || themeColor === "light")?"black":"white"}}  htmlFor="adhaar_number" className="input-label">
                Adhaar Card Number{" "}
              </label>
              <input
                type="number"
                name="adhaar_number"
                id="adhaar_number"
                autoComplete="off"
                value={prevData?.adhaar_number}
                readOnly
                placeholder="Enter the Adhaar Number : "
                style={{
                  backgroundColor : !(themeColor === null || themeColor === "light")?"#121212":"white",
                  border : "0.05px solid rgba(155,155,155,0.35)",
                  color : (themeColor === null || themeColor === "light")?"#121212":"white",
                }}
              />
            </Box>

            {/* Submit button  */}
            <Box className="buttons">
              <LoadingButton
                text={"Edit Profile"}
                loading={loading}
                onClick={() => {
                  registerUser();
                  console.log(prevData);
                }}
              />
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default EditProfile;
