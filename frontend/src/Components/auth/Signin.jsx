import React, { useState, useEffect, useRef } from "react";
import { styled } from "styled-components";
import "./Signin.css";
import { useFormik } from "formik";
import { signinSchema } from "../Schema/Schema";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login";
import "./Otp";
import LoadingButton from "../UI/LoadingButton";
import { Box, TextField, Typography } from "@mui/material";
import ThemeToggleButton from "../UI/ThemeToggleButton";


import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";

const Signin = () => {
  // this is used to navigate to different pages
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [value, setValue] = useState(dayjs());

  const initialvalues = {
    fname: "",
    lname: "",
    email: "",
    date: "",
    number: "",
    address: "",
    adhaar_number: "",
    password: "",
    confirm_password: "",
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialvalues,
      validationSchema: signinSchema,
      validateOnChange: signinSchema,
      validateOnBlur: signinSchema,
      onSubmit: (values, action) => {
        console.log(values);
        action.resetForm();
      },
    });

  const URL = "http://localhost:8000";
  const token = localStorage.getItem("access");

  const access = async () => {
    if (token !== null) {
      console.log(`Access Token ${token}`);
      try {
        await axios.post(
          `${URL}/accounts/token/verify/`,
          {
            token: token,
          },
          {
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        navigate("/");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const registerUser = async (values) => {
    try {
      if (
        values.fname === "" ||
        values.lname === "" ||
        values.email === "" ||
        values.date === "" ||
        values.number === "" ||
        values.address === "" ||
        values.adhaar_number === "" ||
        values.password === "" ||
        values.confirm_password === ""
      ) {
        // alert("Kindly fill the Form properly");
        toast.warn("Kindly fill the form properly");
        return;
      }

      if (values.password !== values.confirm_password) {
        toast.error("Password and Confirm Password should be same");
        return;
      }

      setLoading(true);
      let { data } = await axios.post(
        `${URL}/accounts/register/`,
        {
          first_name: values.fname,
          last_name: values.lname,
          email: values.email,
          date_of_birth: values.date,
          phone: values.number,
          adhaar_number: values.adhaar_number,
          password: values.password,
          confirm_password: values.confirm_password,
          address: values.address,
        },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );

      toast.success("User registred successfully");

      navigate("/otp", {
        state: {
          email: values.email,
        },
      });
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        toast.error(error.response.data.message);
      } else if (error.response.status === 404) {
        navigate("/error");
      } else {
        toast.error("Something went wrong!");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    access();
  }, []);

  const themeColor = localStorage.getItem("theme");
  

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <Box
        sx={{
          display: "flex",
          margin: 0,
          flexDirection: "row",
          height: "100vh",
          scrollBehavior: "smooth",
          border: "none",
        }}
      >
        <div
          style={{
            backgroundColor: "#40339f",
            color: "white",
            border: "2px solid #40339f;",
            width: "35vw",
            height: "100vh",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1 className="logo-h1"> Sangnet </h1>
          <p style={{ color: "#ffffffca" }}>
            "Connecting Lives, Saving Futures."
          </p>
        </div>
        <Box sx={{ display: "flex", flex: 2, flexDirection: "column" }}>
          <Box
            sx={{
              padding: "1rem",
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <ThemeToggleButton />
          </Box>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box className="form-container sign-up">
              <Box className="signup_text">
                {/* <Box className="auth-heading">
                <Typography variant="p">Sign up to Sangnet</Typography>
              </Box> */}
                <h6
                  className="auth-heading"
                  style={{
                    color:
                      themeColor === null || themeColor === "light"
                        ? "black"
                        : "white",
                  }}
                >
                  Edit your profile
                </h6>
              </Box>
              <form
                style={{ gap: 10, display: "flex", flexDirection: "column" }}
                onSubmit={handleSubmit}
                autoComplete="off"
              >
                {/* name */}
                <Box className="name_container">
                  {/* FirstName */}
                  <Box className="form-group">
                    <label
                      style={{
                        color:
                          themeColor === null || themeColor === "light"
                            ? "black"
                            : "white",
                      }}
                      htmlFor="fname"
                      className="input-label"
                    >
                      First Name{" "}
                    </label>
                    <input
                      type="text"
                      name="fname"
                      id="fname"
                      autoComplete="off"
                      placeholder="Enter your First Name"
                      value={values.fname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="class_fname"
                      style={{
                        backgroundColor : !(themeColor === null || themeColor === "light")?"#121212":"white",
                        border : "0.05px solid rgba(155,155,155,0.35)",
                        color : (themeColor === null || themeColor === "light")?"#121212":"white",
                      }}
                    />
                    {errors.fname && touched.fname ? (
                      <Box className="errors">
                        <p>{errors.fname}</p>
                      </Box>
                    ) : null}
                  </Box>

                  {/* LastName */}
                  <Box className="form-group">
                    <label
                      htmlFor="lname"
                      className="input-label"
                      style={{
                        color:
                          themeColor === null || themeColor === "light"
                            ? "black"
                            : "white",
                      }}
                    >
                      Last Name{" "}
                    </label>
                    <input
                      type="text"
                      name="lname"
                      id="lname"
                      autoComplete="off"
                      placeholder="Enter your Last Name"
                      value={values.lname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{
                        backgroundColor : !(themeColor === null || themeColor === "light")?"#121212":"white",
                        border : "0.05px solid rgba(155,155,155,0.35)",
                        color : (themeColor === null || themeColor === "light")?"#121212":"white",
                      }}
                    />
                    {errors.lname && touched.lname ? (
                      <Box className="errors">
                        <p>{errors.lname}</p>
                      </Box>
                    ) : null}
                  </Box>
                </Box>

                {/* Email */}
                <Box className="form-group">
                  <label
                    style={{
                      color:
                        themeColor === null || themeColor === "light"
                          ? "black"
                          : "white",
                    }}
                    htmlFor="email"
                    className="input-label"
                  >
                    Email{" "}
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="off"
                    placeholder="Enter your Email ID"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{
                      backgroundColor : !(themeColor === null || themeColor === "light")?"#121212":"white",
                      border : "0.05px solid rgba(155,155,155,0.35)",
                      color : (themeColor === null || themeColor === "light")?"#121212":"white",
                    }}
                  />
                  {errors.email && touched.email ? (
                    <Box className="errors">
                      <p>{errors.email}</p>
                    </Box>
                  ) : null}
                </Box>

                <Box className="form-group">
                  <label
                    style={{
                      color:
                        themeColor === null || themeColor === "light"
                          ? "black"
                          : "white",
                    }}
                    htmlFor="address"
                    className="input-label"
                  >
                    Address{" "}
                  </label>
                  <input
                    type="address"
                    name="address"
                    id="address"
                    autoComplete="off"
                    placeholder="Enter your Address"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{
                      backgroundColor : !(themeColor === null || themeColor === "light")?"#121212":"white",
                      border : "0.05px solid rgba(155,155,155,0.35)",
                      color : (themeColor === null || themeColor === "light")?"#121212":"white",
                    }}
                  />
                  {errors.address && touched.address ? (
                    <Box className="errors">
                      <p>{errors.address}</p>
                    </Box>
                  ) : null}
                </Box>

                {/* Date of Birth */}
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
                  {errors.date && touched.date ? (
                    <Box className="errors">
                      <p>{errors.date}</p>
                    </Box>
                  ) : null}
                </Box>

                {/* Phone Number */}
                <Box className="form-group">
                  <label
                    style={{
                      color:
                        themeColor === null || themeColor === "light"
                          ? "black"
                          : "white",
                    }}
                    htmlFor="number"
                    className="input-label"
                  >
                    Phone Number{" "}
                  </label>
                  <input
                    type="number"
                    name="number"
                    id="number"
                    autoComplete="off"
                    placeholder="Enter your Phone Number"
                    value={values.number}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{
                      backgroundColor : !(themeColor === null || themeColor === "light")?"#121212":"white",
                      border : "0.05px solid rgba(155,155,155,0.35)",
                      color : (themeColor === null || themeColor === "light")?"#121212":"white",
                    }}
                  />
                  {errors.number && touched.number ? (
                    <Box className="errors">
                      <p>{errors.number}</p>
                    </Box>
                  ) : null}
                </Box>

                {/* Adhaar card number */}
                <Box className="form-group">
                  <label
                    style={{
                      color:
                        themeColor === null || themeColor === "light"
                          ? "black"
                          : "white",
                    }}
                    htmlFor="adhaar_number"
                    className="input-label"
                  >
                    Adhaar Card Number{" "}
                  </label>
                  <input
                    type="number"
                    name="adhaar_number"
                    id="adhaar_number"
                    autoComplete="off"
                    placeholder="Enter your Adhaar Card Number"
                    value={values.adhaar_number}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{
                      backgroundColor : !(themeColor === null || themeColor === "light")?"#121212":"white",
                      border : "0.05px solid rgba(155,155,155,0.35)",
                      color : (themeColor === null || themeColor === "light")?"#121212":"white",
                    }}
                  />
                  {errors.adhaar_number && touched.adhaar_number ? (
                    <Box className="errors">
                      <p>{errors.adhaar_number}</p>
                    </Box>
                  ) : null}
                </Box>

                {/* Password */}
                <Box className="form-group">
                  <label
                    style={{
                      color:
                        themeColor === null || themeColor === "light"
                          ? "black"
                          : "white",
                    }}
                    htmlFor="password"
                    className="input-label"
                  >
                    Password{" "}
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    autoComplete="off"
                    placeholder="Enter your Password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{
                      backgroundColor : !(themeColor === null || themeColor === "light")?"#121212":"white",
                      border : "0.05px solid rgba(155,155,155,0.35)",
                      color : (themeColor === null || themeColor === "light")?"#121212":"white",
                    }}
                  />
                  {errors.password && touched.password ? (
                    <Box className="errors">
                      <p>{errors.password}</p>
                    </Box>
                  ) : null}
                </Box>

                {/* Confirm Password */}
                <Box className="form-group">
                  <label
                    style={{
                      color:
                        themeColor === null || themeColor === "light"
                          ? "black"
                          : "white",
                    }}
                    htmlFor="confirm_password"
                    className="input-label"
                  >
                    Confirm Password{" "}
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    id="confirm_password"
                    autoComplete="off"
                    placeholder="Confirm your Password"
                    value={values.confirm_password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{
                      backgroundColor : !(themeColor === null || themeColor === "light")?"#121212":"white",
                      border : "0.05px solid rgba(155,155,155,0.35)",
                      color : (themeColor === null || themeColor === "light")?"#121212":"white",
                    }}
                  />
                  {errors.confirm_password && touched.confirm_password ? (
                    <Box className="errors">
                      <p>{errors.confirm_password}</p>
                    </Box>
                  ) : null}
                </Box>

                <Box className="buttons">
                  <LoadingButton
                    text={"Create Account"}
                    loading={loading}
                    onClick={() => {
                      registerUser(values);
                    }}
                  />
                </Box>

                <Box className="form-bottom">
                  <span
                    style={{
                      color:
                        themeColor === null || themeColor === "light"
                          ? "black"
                          : "white",
                    }}
                  >
                    Already have an account?{" "}
                  </span>
                  <Link to={"/login"}>Login</Link>
                </Box>
              </form>
            </Box>
          </div>
        </Box>
      </Box>
    </Box>
  );
};

// const Wapper = styled.Box`
//   margin: 0px;
//   border: none;
//   display: flex;
//   flex-direction: row;
//   height: 100vh;
//   scroll-behavior: smooth;
// `;

// const Box = styled.Box`
//   background: #40339f;
//   color: White;
//   border: 2px solid #40339f;
//   width: 35vw;
//   height: 100vh;
//   text-align: center;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   p {
//     color: #ffffffca;
//   }
// `;

// const Box = styled.Box``;

export default Signin;
