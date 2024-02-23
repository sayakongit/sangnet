"use client";

import { json_header, user_profile } from "@/components/constants/Const";
import { getUserData } from "@/components/server/UserManager";
import { OuterSidebar } from "@/components/sidebar/Sidebar";
import userDetails from "@/components/state/GlobalState";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useLocalStorage } from "react-storage-complete";
import Image from "next/image";
import { PROFILE_LOGO } from "@/components/constants/Assets";

const Profile = () => {
  const router = useRouter();
  const { user, setUser } = userDetails();
  const [loading, setLoading] = useState(false);
  const [prevData, setPrevData] = useState<any>({});
  const [user_id, setUserId] = useLocalStorage("user_id", null);

  const updateProfile = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.put(
        `${user_profile}${user_id}/`,
        {
          first_name: prevData.first_name,
          last_name: prevData.last_name,
          phone: prevData.phone,
          address: prevData.address,
        },
        {
          headers: json_header,
        }
      );

      setUser(prevData);

      // TODO: toast.success("Profile updated successfully");

      router.push("/");
    } catch (error) {
      const e = error as AxiosError;
      console.log(e.response?.data);
      if (e.response?.status === 400) {
        // TODO: toast.error(e.response?.data);
      } else {
        // TODO: toast.error("Something went wrong!");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!user_id) {
        return;
      }
      const [_, data] = await getUserData(user_id);
      setUser(data);
      setPrevData(data);
      //   console.log(data);
    };

    fetchUser();
  }, [user]);

  return (
    <main className="flex flex-row">
      <OuterSidebar />
      <section className="ml-[35vw] w-[65vw] min-h-[100vh] grid place-content-center">
        <div className="mx-auto p-6 items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-44 w-44 bg-primary rounded-full">
              <img
                className="rounded-full"
                src={PROFILE_LOGO}
                alt={"PROFILE LOGO"}
              ></img>
            </div>
            <h2 className="text-4xl font-extrabold my-8 mx-4">
              Edit Your Profile
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-2xl md:max-w-4xl font-bold">
            <form className="space-y-6" onSubmit={updateProfile}>
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
                    value={prevData?.first_name}
                    autoComplete="first_name"
                    required={true}
                    onChange={(e) => {
                      setPrevData({
                        ...prevData,
                        first_name: e.target.value,
                      });
                    }}
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
                    value={prevData?.last_name}
                    autoComplete="last_name"
                    required={true}
                    onChange={(e) => {
                        setPrevData({
                          ...prevData,
                          last_name: e.target.value,
                        });
                      }}
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
                    value={prevData?.email}
                    autoComplete="email"
                    disabled={true}
                    placeholder="Enter your Email ID"
                    className="block text-gray-600 bg-gray-300 w-full rounded-lg border-0 py-1.5 px-2 shadow-sm placeholder:text-gray-400 focus:ring-primary-foreground sm:text-sm sm:leading-6"
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
                    value={prevData?.phone}
                    autoComplete="phone"
                    required={true}
                    onChange={(e) => {
                      setPrevData({
                        ...prevData,
                        phone: e.target.value,
                      });
                    }}
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
                    disabled={true}
                    value={prevData?.date_of_birth}
                    autoComplete="date_of_birth"
                    className="block text-gray-600 bg-gray-300 w-full rounded-lg border-0 py-1.5 px-2 shadow-sm placeholder:text-gray-400 focus:ring-primary-foreground sm:text-sm sm:leading-6"
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
                    value={prevData?.adhaar_number}
                    autoComplete="adhaar_number"
                    disabled={true}
                    placeholder="0000-0000-0000"
                    pattern="[0-9]{12}"
                    maxLength={12}
                    className="block text-gray-600 bg-gray-300 w-full rounded-lg border-0 py-1.5 px-2 shadow-sm placeholder:text-gray-400 focus:ring-primary-foreground sm:text-sm sm:leading-6"
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
                    value={prevData?.address}
                    autoComplete="address"
                    placeholder="Enter Your Full Address"
                    required={true}
                    onChange={(e) => {
                        setPrevData({
                          ...prevData,
                          address: e.target.value,
                        });
                      }}
                    className="block bg-yellow-100/70 w-full rounded-lg border-0 py-1.5 px-2 shadow-sm placeholder:text-gray-400 focus:ring-primary-foreground sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className={loading ? "loading-btn mt-4" : "active-btn mt-4"}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;
