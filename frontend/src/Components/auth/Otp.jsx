import React, { useState, useEffect } from "react";
import "./Otp.css";
import axios from "axios";
import OTPInput from "otp-input-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingButton from "../UI/LoadingButton";

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
    if (!location.state) {
      return navigate("/login");
    } else {
      setEmail(location.state.email);
    }
  }, []);

  return (
    <>
      <div className="wrapper_otp">
        <div className="container_left_otp">
          <h1> BloodLink </h1>
        </div>
        <div className="container_right_otp">
          <div className="form_container">
            <div className="auth-heading otp">
              <h2>Verify your account</h2>
              <p>Enter the OTP sent on {email}</p>
            </div>
            <div className="auth_body">
              <OTPInput
                value={OTP}
                onChange={setOTP}
                autoFocus
                OTPLength={4}
                otpType="number"
                disabled={false}
                secure={false}
              />
            </div>
            <div className="verify-button">
              <LoadingButton
                text={"Verify"}
                loading={loading}
                onClick={() => {
                  verifyOTP();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Otp;
