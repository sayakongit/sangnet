"use client";

import Link from "next/link";
import OTPInput from "react-otp-input";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ToastAction } from "@/components/ui/toast";
import { OuterSidebar } from "@/components/Sidebar";
import { useToast } from "@/components/ui/use-toast";
import { useLocalStorage } from "react-storage-complete";
import userDetails, { User } from "@/components/state/GlobalState";
import {
  json_header,
  req_login,
  verify_otp,
} from "@/components/constants/Const";

const Verify = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { loggedIn, user, setLog } = userDetails() as User;

  const [userId, setUserId] = useLocalStorage("user_id", null);
  const [access, setAccess] = useLocalStorage("access", null);
  const [refresh, setRefresh] = useLocalStorage("refresh", null);

  console.log("Logged in ? = " + loggedIn);
  console.log("User = " + user);

  const verifyOTP = async () => {
    if (otp.length < 4) {
      // TODO: toast.warn("Kindly enter a valid Otp");
      setError("Please Enter a Valid OTP");
      console.log(otp);
      return;
    }

    setLoading(true);

    try {
      // Verifying OTP
      const url = verify_otp;

      const veriFication = await axios.post(
        url,
        {
          email: email,
          otp: otp,
        },
        {
          headers: json_header,
        }
      );

      // TODO: Fix backend to give access token on otp verification
      // console.log(veriFication.data);

      // Getting AccessToken

      const { data } = await axios.post(
        req_login,
        {
          email: email,
          password: password,
        },
        {
          headers: json_header,
        }
      );

      // Setting Access Tokens

      setRefresh(data.token.refresh);
      setAccess(data.token.access);
      setUserId(data.data.user_id);

      setLog(true);

      toast({
        title: "Log in Successful",
        description: "Email Successfully Verified !",
      });

      router.push("/"); // Redirect to Dashboard on success
    } catch (error) {
      const e = error as AxiosError;
      console.log(JSON.stringify(e.response));
      if (e.response) {
        // TODO: toast.error(`${e.response.data.message}`);
        if (e.response.status === 400) {
          setError("The OTP is Incorrect");
          toast({
            variant: "destructive",
            title: "Wrong OTP",
            description: "Please check your entered OTP",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        } else {
          setError(JSON.stringify(e.response.data));
        }
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (loggedIn) {
      router.push("/");
    } else {
      setEmail(user.email);
      setPassword(user.password);
    }
  }, []);

  return (
    <main className="flex flex-row">
      <OuterSidebar></OuterSidebar>

      <section className="ml-[35vw] w-[65vw] min-h-[100vh] grid place-content-center">
        <div className="mx-auto p-6 items-center justify-center">
          <div className="auth-heading text-center">
            <h2 className="text-4xl font-extrabold my-8 mx-4">
              Verify Your Account
            </h2>
            <p className="font-semibold my-4 text-sm">
              Enter the OTP sent to {email}
            </p>
          </div>

          <OTPInput
            value={otp}
            onChange={(value) => {
              setOtp(value);
              setError("");
            }}
            numInputs={4}
            inputType="tel"
            renderInput={(props) => <input {...props} />}
            containerStyle="p-4 rounded-lg"
            inputStyle={`min-h-20 focus:border-0 min-w-20 rounded-lg mx-4 bg-yellow-100/70 font-bold text-2xl ${
              error ? "border-2 border-red-600" : ""
            }`}
          />

          {error ? (
            <p className="text-sm text-center text-red-600 font-bold">
              {error}
            </p>
          ) : null}

          <div className="px-16 mt-8">
            <button
              type="submit"
              onClick={verifyOTP}
              className={loading ? "loading-btn" : "active-btn"}
              disabled={loading}
            >
              {loading ? (
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-4 h-4 font-extrabold me-3 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
              ) : null}
              {loading ? "Verifying" : "Verify"}
            </button>
          </div>
        </div>
        <div className="text-sm text-center font-semibold">
          Have not received yet?{" "}
          <Link className="text-primary" href={"#"}>
            Resend
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Verify;
