"use client";

import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { OuterSidebar } from "@/components/Sidebar";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useLocalStorage } from "react-storage-complete";
import userDetails, { User } from "@/components/state/GlobalState";
import {
  verify_token,
  req_signup,
  json_header,
} from "@/components/constants/Const";

const Signup = () => {
  const { toast } = useToast();
  const { setUser } = userDetails() as User;
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
    date_of_birth: "",
    phone: "",
    adhaar_number: "",
    password: "",
    confirm_password: "",
    address: "",
  });

  const router = useRouter();
  const [access, setAccess] = useLocalStorage("access", null);

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

  const isFutureDate = (date: string | number | Date) => {
    const now = new Date();
    const target = new Date(date);
    return target > now;
  };

  const isAtLeast18YearsOld = (date: string | number | Date) => {
    const now = new Date();
    const target = new Date(date);
    let age = now.getFullYear() - target.getFullYear();
    if (
      now.getMonth() < target.getMonth() ||
      (now.getMonth() === target.getMonth() && now.getDate() < target.getDate())
    ) {
      age--;
    }
    return age >= 18;
  };

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // console.log(userInfo);
  };

  const handleSubmit = async () => {
    const isEmpty = Object.values(userInfo).some((x) => x === ""); // Check if any field is empty
    if (isEmpty) {
      // TODO: Toast Empty Field not allowed !
      console.log(isEmpty);
      return;
    }
    // else if (isFutureDate(userInfo.date_of_birth)) {
    //   // TODO: Toast Future Date not allowed !
    //   return;
    // } else if (isAtLeast18YearsOld(userInfo.date_of_birth)) {
    //   // TODO: Toast You Must be Atleast 18 Years old !
    //   return;
    // }
    else if (userInfo.password.length < 6) {
      // TODO: Password must be at least 6 chars long !
      console.log("Password Short");
      return;
    } else if (userInfo.password !== userInfo.confirm_password) {
      // TODO: Password is not matching !
      console.log("Password Diff");
      return;
    }

    setLoading(!loading); // Set the Button as Loading

    try {
      const { data } = await axios.post(req_signup, userInfo, {
        headers: json_header,
      });

      console.log(data);

      // Assuming Registration was Successful ✅

      const userData = {
        id: data.user_id,
        email: userInfo.email,
        password: userInfo.password,
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        phone: userInfo.phone,
        address: userInfo.address,
        date_of_birth: userInfo.date_of_birth,
        adhaar_number: userInfo.adhaar_number,
      };

      setUser(userData); // Update the global State

      setLoading(!loading);

      // TODO: Toast Registration was successful !
      console.log("Pushing Router");

      router.push("/verify"); // Redirect for OTP Verification
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Could not register",
        description: "Something went Wrong!",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      setLoading(!loading); // Set the Button as Loading
      return;
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
            <h2 className="text-4xl font-extrabold my-12 mx-4">
              Create an Account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg md:max-w-2xl font-bold">
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-bold leading-6"
                >
                  First Name
                </label>
                <div className="mt-2">
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    autoComplete="first_name"
                    required={true}
                    onChange={handleChange}
                    placeholder="Enter your First Name"
                    className="block bg-yellow-100/70 w-full rounded-lg border-0 py-1.5 px-2 shadow-sm placeholder:text-gray-400 focus:ring-primary-foreground sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-bold leading-6"
                >
                  Last Name
                </label>
                <div className="mt-2">
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    autoComplete="last_name"
                    required={true}
                    onChange={handleChange}
                    placeholder="Enter your Last Name"
                    className="block bg-yellow-100/70 w-full rounded-lg border-0 py-1.5 px-2 shadow-sm placeholder:text-gray-400 focus:ring-primary-foreground sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

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
                    className="block bg-yellow-100/70 w-full rounded-lg border-0 py-1.5 px-2 shadow-sm placeholder:text-gray-400 focus:ring-primary-foreground sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-bold leading-6"
                >
                  Phone Number
                </label>
                <div className="mt-2">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="phone"
                    required={true}
                    onChange={handleChange}
                    placeholder="+91 00000-00000"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    className="block bg-yellow-100/70 w-full rounded-lg border-0 py-1.5 px-2 shadow-sm placeholder:text-gray-400 focus:ring-primary-foreground sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="date_of_birth"
                  className="block text-sm font-bold leading-6"
                >
                  Date of Birth
                </label>
                <div className="mt-2">
                  <input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    autoComplete="date_of_birth"
                    required={true}
                    onChange={handleChange}
                    className="block bg-yellow-100/70 w-full rounded-lg border-0 py-1.5 px-2 shadow-sm placeholder:text-gray-400 focus:ring-primary-foreground sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="adhaar_number"
                  className="block text-sm font-bold leading-6"
                >
                  Adhaar Card Number
                </label>
                <div className="mt-2">
                  <input
                    id="adhaar_number"
                    name="adhaar_number"
                    type="number"
                    autoComplete="adhaar_number"
                    required={true}
                    onChange={handleChange}
                    placeholder="0000-0000-0000"
                    pattern="[0-9]{12}"
                    maxLength={12}
                    className="block bg-yellow-100/70 w-full rounded-lg border-0 py-1.5 px-2 shadow-sm placeholder:text-gray-400 focus:ring-primary-foreground sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-bold leading-6"
                >
                  Address
                </label>
                <div className="mt-2">
                  <textarea
                    id="address"
                    rows={3}
                    name="address"
                    autoComplete="address"
                    placeholder="Enter Your Full Address"
                    required={true}
                    onChange={handleChange}
                    className="block bg-yellow-100/70 w-full rounded-lg border-0 py-1.5 px-2 shadow-sm placeholder:text-gray-400 focus:ring-primary-foreground sm:text-sm sm:leading-6"
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
                    className="block bg-yellow-100/70 w-full rounded-lg border-0 py-1.5 px-2 shadow-sm placeholder:text-gray-400 focus:ring-primary-foreground sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="confirm_password"
                    className="block text-sm font-bold leading-6"
                  >
                    Confirm Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="confirm_password"
                    type="password"
                    autoComplete="confirm_password"
                    required={true}
                    onChange={handleChange}
                    placeholder="Confirm your Password"
                    className="block bg-yellow-100/70 w-full rounded-lg border-0 py-1.5 px-2 shadow-sm placeholder:text-gray-400 focus:ring-primary-foreground sm:text-sm sm:leading-6"
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
                  Create Account
                </button>
              </div>
            </form>

            <div className="text-sm text-center my-6 font-semibold">
              Already have an account?{" "}
              <Link className="text-primary" href={"/login"}>
                Login Instead
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Signup;
