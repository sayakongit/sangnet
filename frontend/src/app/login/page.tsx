"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { ToastAction } from "@/components/ui/toast";
import { OuterSidebar } from "@/components/sidebar/Sidebar";
import { useToast } from "@/components/ui/use-toast";
import { useLocalStorage } from "react-storage-complete";
import { getUserData } from "@/components/server/UserManager";
import userDetails, { User } from "@/components/state/GlobalState";
import {
  req_login,
  verify_token,
  json_header,
} from "@/components/constants/Const";

const Login = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser, setLog } = userDetails() as User;

  const [userId, setUserId] = useLocalStorage("user_id", null);
  const [access, setAccess] = useLocalStorage("access", null);
  const [refresh, setRefresh] = useLocalStorage("refresh", null);

  const handleChange = (e: any) => {
    const { target } = e;
    setError(false);
    if (target.id === "email") {
      setEmail(target.value);
    } else {
      setPassword(target.value);
    }

    console.log(target.value);
  };

  const checkAccess = async () => {
    if (access !== null) {
      try {
        await axios.post(
          verify_token,
          {
            token: access,
          },
          {
            headers: json_header,
          }
        );
        router.push("/");
      } catch (error) {
        const e = error as AxiosError;
        console.error(e.response?.data);
      }
    }
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      toast({
        title: "All Fields Required",
        description: "Kindly fill all fields !",
      });
      setError(true);
      return;
    }

    setLoading(true);

    try {
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

      const [_, User] = await getUserData(data.data.user_id);

      const userData = {
        id: User.id,
        coordinates: User.coordinates,
        email: email,
        password: password,
        first_name: User.first_name,
        last_name: User.last_name,
        phone: User.phone,
        address: User.address,
        date_of_birth: User.date_of_birth,
        is_donor: User.is_donor,
        donor_id: User.donor_id,
        adhaar_number: User.adhaar_number,
        created_at: User.created_at,
        updated_at: User.updated_at,
        donor_application_status: User.donor_application_status,
      };

      setUser(userData); // Update Global state after successful Authentication

      setLoading(false);

      if (!data.data.is_verified) {
        toast({
          title: "Account Not Verified",
          description: "Please verify your email !",
        });
        router.push("/verify");
        return;
      }

      setRefresh(data.token.refresh);
      setAccess(data.token.access);
      setUserId(data.data.user_id);

      setLog(true);

      toast({
        title: "Log in Successful",
        description: "You are successfully Logged in",
      });

      router.push("/"); // redirect to Dashboard
    } catch (error) {
      const e = error as AxiosError;

      console.error(e.response?.data);
      setLoading(false);

      if (e.response?.status === 404) {
        setError(true);
        toast({
          variant: "destructive",
          title: "Wrong Credentials",
          description: "The entered user does not exist !",
        });
      } else if (e.response?.status === 400) {
        setError(true);
        toast({
          variant: "destructive",
          title: "Wrong Credentials",
          description: "Please double Check your credentials !",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      } else {
        // TODO: toast.error("Something is wrong !");
        return;
      }
    }
  };

  useEffect(() => {
    checkAccess();
  }, []);

  return (
    <main className="flex flex-row">
      <OuterSidebar></OuterSidebar>

      <section className="ml-[35vw] w-[65vw] min-h-[100vh] grid place-content-center">
        <div className="mx-auto p-6 items-center justify-center">
          <div className="auth-heading">
            <h2 className="text-4xl font-extrabold my-8 mx-4">
              Log in to Sangnet
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg md:max-w-2xl font-bold">
            <form className="space-y-6" action="#" method="POST">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold leading-6"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required={true}
                    onChange={handleChange}
                    placeholder="Enter your Email ID"
                    className={`block bg-yellow-100/70 w-full rounded-lg ${
                      error ? "border-2 border-red-600" : ""
                    } py-1.5 px-2 shadow-sm placeholder:text-gray-400 focus:ring-primary-foreground sm:text-sm sm:leading-6`}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-bold leading-6"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-primary hover:text-primary/90"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required={true}
                    onChange={handleChange}
                    placeholder="Enter your Password"
                    className={`block bg-yellow-100/70 w-full rounded-lg ${
                      error ? "border-2 border-red-600" : ""
                    } border-0 py-1.5 px-2 shadow-sm placeholder:text-gray-400  sm:text-sm sm:leading-6`}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className={loading ? "loading-btn" : "active-btn"}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="animate-spin mr-2" />
                  ) : null}
                  {loading ? "Signing in" : "Sign in"}
                </button>
              </div>
            </form>

            <div className="text-sm text-center my-6 font-semibold">
              Have not registered yet?{" "}
              <Link className="text-primary" href={"/signup"}>
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
