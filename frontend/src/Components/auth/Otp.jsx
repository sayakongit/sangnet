import React, { useState, useEffect } from "react";
import "./Otp.css";
import axios from "axios";
import OTPInput from "otp-input-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingButton from "../UI/LoadingButton";
import { Box } from "@mui/material";
import ThemeToggleButton from "../UI/ThemeToggleButton";

const Otp = () => {
  const [OTP, setOTP] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const URL = "http://localhost:8000";

  const verifyOTP = async () => {
    try {
      if (OTP.length === 0 || OTP.length < 4) {
        // alert("Kindly fill the Form properly");
        toast.warn("Kindly enter a valid Otp");
      } else {
        setLoading(true);
        let { data } = await axios.post(
          `${URL}/accounts/verify/`,
          {
            email: location.state.email,
            otp: OTP,
          },
          {
            headers: {
              "Content-type": "application/json",
            },
          }
        );

        toast.success("User verified successfully");
        navigate("/login");
      }
    } catch (error) {
      if (error.response.status === 400) {
        toast.error(`${error.response.data.message}`);
      } else {
        toast.error("Something went wrong");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    // if (!location.state) {
    //   return navigate("/login");
    // } else {
    //   setEmail(location.state.email);
    // }
  }, []);

  const themeColor = localStorage.getItem("theme");

  return (
    <>
      <Box sx={{ bgcolor: "background.default", display: "flex" }}>
        <Box className="container_left_otp">
          <h1 className="logo-h1"> Sangnet </h1>
        </Box>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            // alignItems: "center",
            // justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              width: "100%",
              justifyContent: "flex-end",
              display: "flex",
              padding: "1rem",
            }}
          >
            <ThemeToggleButton />
          </div>

          <div
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box className="form_container">
              <Box className="auth-heading otp">
                <p>Enter the OTP sent on {email}</p>
                <h2
                  style={{
                    flex: "100%",
                    fontSize: "1.25rem",
                    color:
                      themeColor === null || themeColor === "light"
                        ? "black"
                        : "white",
                  }}
                >
                  Verify your account
                </h2>
                {/* <Box className="auth_body">
                <OTPInput
                  value={OTP}
                  onChange={setOTP}
                  autoFocus
                  OTPLength={4}
                  otpType="number"
                  disabled={false}
                  secure={false}
                  />
              </Box> */}
                <Box
                  className="auth_body"
                  sx={{ "& > div > input": { backgroundColor : !(themeColor === null || themeColor === "light")?"#121212":"white",
                  border : "0.05px solid rgba(155,155,155,0.35)",
                  color : (themeColor === null || themeColor === "light")?"#121212":"white",} }}
                >
                  <OTPInput
                    value={OTP}
                    onChange={setOTP}
                    autoFocus
                    OTPLength={4}
                    otpType="number"
                    disabled={false}
                    secure={false}
                  />
                </Box>
                <Box className="verify-button">
                  <LoadingButton
                    text={"Verify"}
                    loading={loading}
                    onClick={() => {
                      verifyOTP();
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </div>
        </Box>
      </Box>
    </>
  );
};
export default Otp;
