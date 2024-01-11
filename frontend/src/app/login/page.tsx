"use client";

import Link from "next/link";
import axios, { AxiosError } from "axios";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast"
import { backend } from "@/components/constants/Const";
import { useLocalStorage } from 'react-storage-complete';
import { getUserData } from "@/components/auth/AuthManager";
import userDetails, { User } from "@/components/state/GlobalState";

const Login = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser, setLog } = userDetails() as User;
  
  const [ userId, setUserId ] = useLocalStorage("user_id", null);
  const [ access, setAccess ] = useLocalStorage("access", null);
  const [ refresh, setRefresh ] = useLocalStorage("refresh", null);


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
          `${backend}/accounts/token/verify/`,
          {
            token: access,
          },
          {
            headers: {
              "Content-type": "application/json",
            },
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
      })
      setError(true);
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${backend}/accounts/login/`,
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-type": "application/json",
          },
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
        })
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
      })

      router.push("/"); // redirect to Dashboard

    } catch (error) {
      const e = error as AxiosError;

      console.error(e.response?.data);
      setLoading(false);

      if (e.response?.status === 404) {
        // TODO: toast.error("User does not exist");
        return JSON.stringify(e.response?.data);
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
      <Sidebar
        name={"Sangnet"}
        text={'"Connecting Lives, Saving Futures."'}
      ></Sidebar>

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
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-4 h-4 me-3 text-white animate-spin"
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
