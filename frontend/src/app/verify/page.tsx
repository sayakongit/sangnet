"use client";

import Link from "next/link";
import OTPInput from "react-otp-input";
import { Loader2 } from "lucide-react";
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
                <Loader2 className="animate-spin mr-2" />
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
